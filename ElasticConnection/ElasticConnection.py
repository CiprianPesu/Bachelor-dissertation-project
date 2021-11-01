from elasticsearch import Elasticsearch
from confluent_kafka import Consumer
import json

conf = {'bootstrap.servers': "10.0.0.1:9092",
        'group.id': "group1",
        'auto.offset.reset': 'earliest'}

es = Elasticsearch([{'host': 'localhost', 'port': 30200}])

consumer = Consumer(conf)
consumer.subscribe(["crawled_news"])

while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None: continue
    else:
        news_json = json.loads(msg.value())
        es.index(index='news', document=news_json)
        print(news_json["link"]+"---Sent")


