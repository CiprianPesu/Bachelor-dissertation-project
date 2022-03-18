import pickle
import json
import string
from nltk.stem import PorterStemmer
import tensorflow as tf

from transformers import DistilBertTokenizer
from transformers import TFDistilBertForSequenceClassification

from elasticsearch import Elasticsearch
from confluent_kafka import Consumer
from confluent_kafka import Producer

import os
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3' 
##############################

porter=PorterStemmer()
stopwords=['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y']

with open('tokenizer-200.pickle', 'rb') as handle:
    words = pickle.load(handle)

words_list=json.loads(words.to_json())
y=json.loads(words_list["config"]["word_counts"])
words=list(y.keys())

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

def clean_words(a):
    a_token=a.split()
    str1=""
    for tk in a_token:
        if tk in words:
            str1 += tk+" "
            
    return str1

##############################
conf = {'bootstrap.servers': "10.0.0.1:9092",
        'group.id': "group1",
        'auto.offset.reset': 'earliest'}

es = Elasticsearch([{'host': 'localhost', 'port': 30200}])

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

tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
model = TFDistilBertForSequenceClassification.from_pretrained('distilbert-base-uncased')
model.load_weights('./checkpoints2/my_checkpoint')


test="Editor's Note -- Sign up for Unlocking the World, CNN Travel's weekly newsletter . Get news about destinations opening and closing, inspiration for future adventures, plus the latest in aviation, food and drink, where to stay and other travel developments."
test=clean_punct(test)
test=clean_stop(test)
test=clean_stem(test)
test=clean_words(test)

results=predict_proba([test], model, tokenizer).tolist() 

print(results)


while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None: continue
    else:
        try:
            news_json = json.loads(msg.value())
            
            paragrafe=str(news_json["content"]).split("  ")
            while("" in paragrafe) :
                 paragrafe.remove("")

            paragrafe=list(map(clean_punct, paragrafe))
            
            len_cuvinte=0
            for paragarf in paragrafe:
                len_cuvinte+=len(paragarf.split(" "))

            paragrafe=list(map(clean_stop, paragrafe))
            paragrafe=list(map(clean_stem, paragrafe))       
            paragrafe=list(map(clean_words, paragrafe))  

            results=predict_proba(paragrafe, model, tokenizer).tolist() 

            sum_poz=0
            sum_neg=0
            nr_paragrafe=0
            for i in range(0,len(paragrafe)):
                nr_paragrafe+=1*len(str(paragrafe[i]).split())
                sum_poz+=results[i][1]*len(str(paragrafe[i]).split())
                sum_neg+=results[i][0]*len(str(paragrafe[i]).split())

            procent_neg=sum_neg/nr_paragrafe-0.05
            procent_poz=sum_poz/nr_paragrafe+0.05

            news_json["Procent_Pozitiv"]=procent_poz
            news_json["Word_Count"]=len_cuvinte
            
            print("")
            print(len_cuvinte)
            print(len(paragrafe))
            print("  "+str(procent_neg)+"  "+str(procent_poz))
            print(news_json["link"])


            producer.poll(0)
            producer.produce('procesed_news',json.dumps(news_json).encode('utf-8'))

        except:
            print("Invalid")










