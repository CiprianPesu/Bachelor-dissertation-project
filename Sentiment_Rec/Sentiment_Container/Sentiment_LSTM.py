import pickle
import json
import string
from nltk.stem import PorterStemmer
import tensorflow as tf
import numpy as np
from tensorflow import keras
from keras.preprocessing.sequence import pad_sequences

from elasticsearch import Elasticsearch
from confluent_kafka import Consumer
from confluent_kafka import Producer

import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
##############################

porter=PorterStemmer()
stopwords=['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y']

with open('tokenizer-200-nou.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

def clean_punct(a):        
    return a.lower().translate(str.maketrans('', '', string.punctuation))

def clean_stop(a):
    a_token=a.split()
    
    str1=""
    for tk in a_token:
        if tk in stopwords:
            continue
        else:
            str1 += tk+" "
            
    return str1

def clean_stem(a):
    a_token=a.split()
    
    str1=""
    for tk in a_token:
            str1 += porter.stem(tk)+" "
            
    return str1

##############################
conf = {'bootstrap.servers': "10.0.0.1:9092",
        'group.id': "group1",
        'auto.offset.reset': 'earliest'}

es = Elasticsearch([{'host': 'localhost', 'port': 30200, 'scheme':""}])

consumer = Consumer(conf)
consumer.subscribe(["crawled_news"])

conf_p = {'bootstrap.servers': '10.0.0.1:9092'}
producer = Producer(conf_p)

##############################

def predict_proba(text_list, model, tokenizer):
  encodings = tokenizer(text_list, max_length=128, truncation=True, padding=True)
  dataset = tf.data.Dataset.from_tensor_slices((dict(encodings))) 
  preds = model.predict(dataset.batch(1)).logits
  res = tf.nn.softmax(preds, axis=1).numpy()
    
  return res

##############################


model = keras.models.load_model('./Model-200-l3-2')

while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None: continue
    else:
        try:
            news_json = json.loads(msg.value())
            
            paragrafe=news_json["content"].split("*NewPARAGRAF*")
            print(paragrafe[0])

            paragrafe=list(map(clean_punct, paragrafe))
            
            len_cuvinte=0
            for paragarf in paragrafe:
                len_cuvinte+=len(paragarf.split(" "))

            paragrafe=list(map(clean_stop, paragrafe))
            paragrafe=list(map(clean_stem, paragrafe))        
            while("" in paragrafe) :
                 paragrafe.remove("")



            X_train = tokenizer.texts_to_sequences(paragrafe)
            X_train = pad_sequences(X_train, maxlen = 128)

            results=model.predict(X_train)

            sum_poz=0
            sum_neg=0
            nr_paragrafe=0
            for i in range(0,len(paragrafe)):
                if np.count_nonzero(X_train[i]) > 2:
                    nr_paragrafe+=1*len(str(paragrafe[i]).split())
                    sum_neg+=results[i][0]*len(str(paragrafe[i]).split())
                    sum_poz+=results[i][1]*len(str(paragrafe[i]).split())

            procent_neg=sum_neg/nr_paragrafe
            procent_poz=sum_poz/nr_paragrafe

            ParagrafPozitiv=[]
            for i in range(0,len(paragrafe)):
                ParagrafPozitiv.append(results[i][1])

            news_json["Procent_Pozitiv"]=procent_poz
            news_json["Paragraf_Pozitiv"]=str(ParagrafPozitiv)
            news_json["Word_Count"]=len_cuvinte
            
            print("")
            print(len_cuvinte)
            print(json.dumps(news_json))

            producer.poll(0)
            producer.produce('procesed_news', json.dumps(news_json))

        except Exception as e:
            print(e)
            print("Invalid")










