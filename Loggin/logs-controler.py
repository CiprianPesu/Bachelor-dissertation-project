from datetime import datetime
from json.encoder import JSONEncoder
from elasticsearch import Elasticsearch
from confluent_kafka import Consumer
from confluent_kafka import Producer
import json

conf = {'bootstrap.servers': "10.0.0.1:9092",
        'group.id': "group1",
        'auto.offset.reset': 'earliest'}

es = Elasticsearch([{'host': 'localhost', 'port': 30200}])

consumer = Consumer(conf)
consumer.subscribe(["logs"])

conf_p = {'bootstrap.servers': '10.0.0.1:9092'}
producer = Producer(conf_p)

while True:
    msg = consumer.poll(timeout=5.0)
    if msg is None: continue
    else:
        log_json = json.loads(json.loads(msg.value().decode("utf-8")))
        print(log_json)

        log_json["Logging_datetime"]=datetime.now()

        service= log_json['service']


        if service == 'elastic-connection' :
            es.index(index='logs-elastic-connection', document=log_json)
        elif service =='URL-Crawler' :
            es.index(index='logs-url-crawler', document=log_json)


