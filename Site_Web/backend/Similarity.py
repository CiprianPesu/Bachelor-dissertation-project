from datetime import datetime
from datetime import timedelta
import sys
from elasticsearch import Elasticsearch
import json
import string
import en_core_web_md
from requests import delete

nlp = en_core_web_md.load()
es = Elasticsearch([{'host': 'localhost', 'port': 30200, 'scheme': ""}])

result = es.search(index="news",
                   query={
                       "match": {
                         "_id": sys.argv[1],
                       }
                   },)


MainNews = {
    "title": result["hits"]["hits"][0]["_source"]["title"],
    "pubDate": result["hits"]["hits"][0]["_source"]["pubDate"],
    "description": result["hits"]["hits"][0]["_source"]["description"],
    "RSSTag": result["hits"]["hits"][0]["_source"]["RSSTag"],
    "content": result["hits"]["hits"][0]["_source"]["content"],
}


MainDate = datetime.strptime(MainNews.get("pubDate"), '%Y-%m-%d %H:%M:%S')


MainDate = MainDate.replace(hour=0, minute=0, second=0)
startDate = MainDate - timedelta(days=2)
endDate = MainDate + timedelta(days=2, hours=11, minutes=59, seconds=59)

result = es.search(index="news",
                   query={
                       "bool": {
                         "must": [
                             {
                                 "range": {
                                     "pubDate": {
                                         "gte": startDate,
                                         "lte": endDate,
                                     }
                                 }
                             },
                         ],
                           "must_not": {
                             "match": {
                                 "_id": sys.argv[1],
                             }
                         }
                       },
                   },
                   size=999,
                   )


stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these',
             'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y']


def clean_stop(a):
    a_token = a.split()

    str1 = ""
    for tk in a_token:
        if tk in stopwords:
            continue
        else:
            str1 += tk+" "

    return str1


def get_similarity(news):

    NewsTitle_clean = clean_stop(news["title"].lower().translate(
    str.maketrans('', '', string.punctuation)))
    nlpNewsTitle = nlp(NewsTitle_clean)
    similarity_title=nlpMainNewsTitle.similarity(nlpNewsTitle)


    if similarity_title >= 0.5:
        NewsContent_clean = clean_stop(news["content"].lower().translate(
        str.maketrans('', '', string.punctuation)))
        nlpNewsContent = nlp(NewsContent_clean)
        similarity_content=nlpMainNewsContent.similarity(nlpNewsContent)

        similarity = (similarity_content
                  * 0.5+similarity_title*0.5)
        return similarity
    else:
        return 0


MainNewsContent_clean = clean_stop(MainNews["content"].lower(
).translate(str.maketrans('', '', string.punctuation)))
MainNewsTitle_clean = clean_stop(MainNews["title"].lower(
).translate(str.maketrans('', '', string.punctuation)))
nlpMainNewsContent = nlp(MainNewsContent_clean)
nlpMainNewsTitle = nlp(MainNewsTitle_clean)

ProcesedNews=[]
for i in result["hits"]["hits"]:
    news={
        "id": i["_id"],
        "title": i["_source"]["title"],
        "pubDate": i["_source"]["pubDate"],
        "content": i["_source"]["content"],
        "RSSTag": i["_source"]["RSSTag"],
    }
    try:
        similarity = get_similarity(news)
        news["similarity"] = similarity
        ProcesedNews.append(news)
    except:
        continue



ProcesedNews.sort(key=lambda x: x["similarity"], reverse=True)

SimilarNews=[]
if len(ProcesedNews) >= 5:
    for i in range(0, 5):
        del ProcesedNews[i]["content"]
        SimilarNews.append(ProcesedNews[i])
else:
    for i in range(0, len(ProcesedNews)):
        del ProcesedNews[i]["content"]
        SimilarNews.append(ProcesedNews[i])

print(json.dumps(SimilarNews))
sys.stdout.flush()
exit(0)
