from __future__ import barry_as_FLUFL
from ast import Str
from datetime import date, datetime
import json
from time import time
from goose3.extractors import content
import unidecode
import urllib.request

from bs4 import BeautifulSoup
from goose3 import Goose
from goose3.extractors.content import ContentExtractor

from dateutil import parser, tz

from confluent_kafka import Consumer
from confluent_kafka import Producer

from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': 'localhost', 'port': 30200,"scheme":""}])


def post_cleanup(ce_inst):
    """\
    remove any divs that looks like non-content,
    clusters of links, or paras with no gusto
    """
    parse_tags = ['p']
    if ce_inst.config.parse_lists:
        parse_tags.extend(['ul', 'ol'])
    if ce_inst.config.parse_headers:
        parse_tags.extend(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

    target_node = ce_inst.article.top_node
    node = ce_inst.add_siblings(target_node)
    for elm in ce_inst.parser.getChildren(node):
        e_tag = ce_inst.parser.getTag(elm)
        if e_tag not in parse_tags:
            if ce_inst.is_highlink_density(elm) or ce_inst.is_table_and_no_para_exist(elm):
                ce_inst.parser.remove(elm)

    return node


def calculate_best_node(ce_inst, doc):
    top_node = None
    nodes_to_check = ce_inst.nodes_to_check(doc)

    starting_boost = float(1.0)
    cnt = 0
    i = 0
    parent_nodes = []
    nodes_with_text = []

    for node in nodes_to_check:
        text_node = ce_inst.parser.getText(node)
        word_stats = ce_inst.stopwords_class(
            language=ce_inst.get_language()).get_stopword_count(text_node)
        high_link_density = ce_inst.is_highlink_density(node)
        if word_stats.get_stopword_count() > 2 and not high_link_density:
            nodes_with_text.append(node)

    nodes_number = len(nodes_with_text)
    negative_scoring = 0
    bottom_negativescore_nodes = float(nodes_number) * 0.25

    for node in nodes_with_text:
        boost_score = float(0)
        # boost
        if ce_inst.is_boostable(node):
            if cnt >= 0:
                boost_score = float((1.0 / starting_boost) * 50)
                starting_boost += 1
        # nodes_number
        if nodes_number > 15:
            if (nodes_number - i) <= bottom_negativescore_nodes:
                booster = float(bottom_negativescore_nodes -
                                (nodes_number - i))
                boost_score = float(-pow(booster, float(2)))
                negscore = abs(boost_score) + negative_scoring
                if negscore > 40:
                    boost_score = float(5)

        text_node = ce_inst.parser.getText(node)
        word_stats = ce_inst.stopwords_class(
            language=ce_inst.get_language()).get_stopword_count(text_node)
        upscore = int(word_stats.get_stopword_count() + boost_score)

        # parent node
        parent_node = ce_inst.parser.getParent(node)
        ce_inst.update_score(parent_node, upscore)
        ce_inst.update_node_count(parent_node, 1)

        if parent_node not in parent_nodes:
            parent_nodes.append(parent_node)

        # parentparent node
        parent_parent_node = ce_inst.parser.getParent(parent_node)
        if parent_parent_node is not None:
            ce_inst.update_node_count(parent_parent_node, 1)
            ce_inst.update_score(parent_parent_node, upscore - eps)
            if parent_parent_node not in parent_nodes:
                parent_nodes.append(parent_parent_node)

        # parentparentparent node
        if parent_parent_node != None:
            parent_parent_parent_node = ce_inst.parser.getParent(
                parent_parent_node)
            if parent_parent_parent_node is not None:
                ce_inst.update_node_count(parent_parent_parent_node, 1)
                ce_inst.update_score(
                    parent_parent_parent_node, upscore - 2 * eps)
                if parent_parent_parent_node not in parent_nodes:
                    parent_nodes.append(parent_parent_parent_node)
        cnt += 1
        i += 1

    top_node_score = 0
    for itm in parent_nodes:
        score = ce_inst.get_score(itm)

        if score > top_node_score:
            top_node = itm
            top_node_score = score

        if top_node is None:
            top_node = itm

    return top_node


def eliminate_ads(content):

    lines = content.splitlines()
    new_content = ""
    for line in lines:
        if IsValidContent(line) == True:
            new_content = new_content+" "+line

    return new_content


def IsValidContent(line):
    if line.isupper() == True:
        return False
    elif line.find("Last updated on") != -1:
        return False
    elif line.find("The BBC is not responsible for the content of external sites") != -1:
        return False
    elif line.find("enable JavaScript") != -1:
        return False
    elif line.find("You can now listen to Fox News articles") != -1:
        return False
    elif line.find("video can not be played") != -1:
        return False
    elif line.find("Editor's Note") != -1:
        return False
    else:
        return True


def IsValidLink(link):
    if link.find("vpx") != -1:
        return False
    elif link.find("/videos/") != -1:
        return False
    else:
        return True


class ArticleFetcher():

    def __init__(self):
        super(ArticleFetcher, self).__init__()

    def _extract_content(self, html):
        ContentExtractor.calculate_best_node = calculate_best_node
        ContentExtractor.post_cleanup = post_cleanup
        g = Goose({'enable_image_fetching': False})
        article = g.extract(raw_html=html)
        ContentExtractor.calculate_best_node = f1
        ContentExtractor.post_cleanup = f2
        return article.cleaned_text

    def _html_to_infomation(self, html, link):
        soup = BeautifulSoup(html, 'lxml')
        head = soup.head

        try:
            content = self._extract_content(html)
            content = eliminate_ads(content)
            content = unidecode.unidecode(content)

            return content
        except Exception:
            return None


conf = {'bootstrap.servers': "10.0.0.1:9092",
        'group.id': "group1",
        'auto.offset.reset': 'earliest'}

conf_p = {'bootstrap.servers': '10.0.0.1:9092'}

consumer = Consumer(conf)

producer = Producer(conf_p)


try:
    consumer.subscribe(["rss_data"])

    count = 0
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        else:
            rss_json = json.loads(msg.value())

            eps = 1e-6
            f1 = ContentExtractor.calculate_best_node
            f2 = ContentExtractor.post_cleanup

            url = rss_json["link"]

            try:
                resp = es.search(index="news", 
                query={'term': 
                    {
                        'link': url,
                    }
                })
            except:
                print("Index does not exist yet")
                resp={"hits": {"hits":""}}

            
            print("-----")

            if len(resp["hits"]["hits"]) == 0:
                
                try:

                    rss_json['pubDate'] = parser.parse(rss_json["pubDate"])

                    pub_datetime = (rss_json["pubDate"]).strftime(
                        "%Y-%m-%d %H:%M:%S")
                    rss_json["pubDate"] = pub_datetime
                    print(rss_json['pubDate'])
                    print("-------------")
                except:
                    print("--Unknown Date--")
                    print("----------------")
                    continue

                now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                if IsValidLink(url) == True:
                    print(url)
                    try:
                        url_page = urllib.request.urlopen(url)
                        page_bytes = url_page.read()
                        url_page.close()

                        html = page_bytes.decode()

                        article_fatcher = ArticleFetcher()

                        rss_json["description"] = unidecode.unidecode(
                            rss_json["description"])
                        rss_json["title"] = unidecode.unidecode(rss_json["title"])

                        content = article_fatcher._html_to_infomation(html, url)
                        rss_json["Crawlerd_datetime"] = now
                        rss_json["content"] = content
                        producer.poll(0)
                        producer.produce('crawled_news', json.dumps(
                            rss_json).encode('utf-8'))

                        json_logs = json.dumps({'link':  rss_json["link"],
                                                'source':  rss_json["source"],
                                                'RSSTag':  rss_json["RSSTag"],
                                                'Action_datetime': now,
                                                'status': 'success',
                                                'service': 'URL-Crawler',
                                                })

                        producer.poll(0)
                        producer.produce('logs', json.dumps(
                            json_logs).encode('utf-8'))

                    except Exception:
                        json_logs = json.dumps({'link':  rss_json["link"],
                                                'source':  rss_json["source"],
                                                'RSSTag':  rss_json["RSSTag"],
                                                'Action_datetime': now,
                                                'status': 'invalid link',
                                                'service': 'URL-Crawler',
                                                })
                        producer.poll(0)
                        producer.produce('logs', json.dumps(
                            json_logs).encode('utf-8'))

                        print(url + "    --->Invalid Link 404")
                else:
                    json_logs = json.dumps({'link':  rss_json["link"],
                                            'source':  rss_json["source"],
                                            'RSSTag':  rss_json["RSSTag"],
                                            'Action_datetime': now,
                                            'status': 'invalid link',
                                            'service': 'URL-Crawler',
                                            })
                    producer.poll(0)
                    producer.produce('logs', json.dumps(json_logs).encode('utf-8'))
                    print(url + "    --->Invalid")
finally:
    # Close down consumer to commit final offsets.
    consumer.close()
