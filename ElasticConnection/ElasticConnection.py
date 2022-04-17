from elasticsearch import Elasticsearch
from confluent_kafka import Consumer
from confluent_kafka import Producer
import json
from datetime import datetime

conf = {'bootstrap.servers': "10.0.0.1:9092",
        'group.id': "group1",
        'auto.offset.reset': 'earliest'}

es = Elasticsearch([{'host': 'localhost', 'port': 30200,'scheme':""}])

consumer = Consumer(conf)
consumer.subscribe(["procesed_news"])


conf_p = {'bootstrap.servers': '10.0.0.1:9092'}
producer = Producer(conf_p)

while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None: continue
    else:
        print("recived")
        now=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        try:
            news_json = json.loads(msg.value())
            #news_json = json.loads(str(msg.value()).replace("\'", "\""))
            url = news_json["link"]

            print(news_json)

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

            if len(resp["hits"]["hits"]) == 0:
                news_json["Inserted_datetime"]=now
                es.index(index='news', document=news_json)

                json_logs = json.dumps({'link':  news_json["link"],
                                'source':  news_json["source"],
                                'RSSTag':  news_json["RSSTag"],
                                'Action_datetime': now,
                                'status': 'success',
                                'service': 'elastic-connection',
                                })

                print(json.dumps(json_logs))
                producer.poll(0)
                producer.produce(topic="logs", value=json.dumps(json_logs))

                print(news_json["link"]+"---Sent")
        except Exception as e:
            print(e)
            json_logs = json.dumps({'link':  news_json["link"],
                            'source':  news_json["source"],
                            'RSSTag':  news_json["RSSTag"],
                            'Action_datetime': now,
                            'status': 'failure',
                            'service': 'elastic-connection',
                            })

            print(json.dumps(json_logs))
            producer.poll(0)
            producer.produce(topic="logs", value=json.dumps(json_logs))
            print("Invalid")


