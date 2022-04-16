from flask import Flask
from datetime import datetime
from datetime import timedelta
import sys
from elasticsearch import Elasticsearch
import json
import string
import spacy_universal_sentence_encoder

app = Flask(__name__)

nlp = spacy_universal_sentence_encoder.load_model('en_use_lg')
es = Elasticsearch([{'host': 'localhost', 'port': 30200, 'scheme': ""}])


@app.route('/similarity/<id>')
def index(id):
    ProcesedNews = []
    SimilarNews = []

    result = es.search(index="news",
                       query={
                           "match": {
                               "_id":id,
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
                            #    "must": [
                            #        {
                            #            "range": {
                            #                "pubDate": {
                            #                    "gte": startDate,
                            #                    "lte": endDate,
                            #                }
                            #            }
                            #        },
                            #    ],
                               "must_not": {
                                   "match": {
                                       "_id": id,
                                   }
                               }
                           },
                       },
                       size=999,
                       )

    nlpMainNewsContent = nlp(MainNews["content"])
    nlpMainNewsTitle = nlp(MainNews["title"])

    for i in result["hits"]["hits"]:
        news = {
            "id": i["_id"],
            "title": i["_source"]["title"],
            "pubDate": i["_source"]["pubDate"],
            "content": i["_source"]["content"],
            "RSSTag": i["_source"]["RSSTag"],
        }
        try:

            
            nlpNewsTitle = nlp(news["title"])
            similarity_title = nlpMainNewsTitle.similarity(nlpNewsTitle)
            
            if similarity_title >= 0.3:

                nlpNewsContent = nlp(news["content"])
                similarity_content = nlpMainNewsContent.similarity(
                    nlpNewsContent)

                similarity = similarity_content
                news["similarity"] = similarity
                ProcesedNews.append(news)
        except:
            continue

    ProcesedNews.sort(key=lambda x: x["similarity"], reverse=True)
    if len(ProcesedNews) >= 5:
        for i in range(0, 5):
            del ProcesedNews[i]["content"]
            SimilarNews.append(ProcesedNews[i])
    else:
        for i in range(0, len(ProcesedNews)):
            del ProcesedNews[i]["content"]
            SimilarNews.append(ProcesedNews[i])

    return json.dumps(SimilarNews)
