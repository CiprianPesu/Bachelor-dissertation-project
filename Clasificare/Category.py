from pydoc import describe
from nltk import *
import pickle
from keras import models, preprocessing as kprocessing
import json
import nltk

from confluent_kafka import Consumer
from confluent_kafka import Producer

nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('omw-1.4')

STOPWORDS_CORPUS = corpus.stopwords.words('english')
LEMMATIZATION    = WordNetLemmatizer()
STEMMING         = PorterStemmer()

with open('tokenizer.pickle', 'rb') as handle:
    tokenizer = pickle.load(handle)

model = models.load_model('model2.h5')

labels=['ARTS & CULTURE', 'BUSINESS', 'CRIME', 'EDUCATION',
       'ENTERTAINMENT', 'ENVIRONMENT', 'FOOD & DRINK', 'HEALTHY LIVING',
       'HOME & LIVING', 'POLITICS', 'RELIGION', 'SCIENCE', 'SPORTS',
       'STYLE & BEAUTY', 'TRAVEL']


##############################
conf = {'bootstrap.servers': "10.0.0.1:9092",
        'group.id': "group1",
        'auto.offset.reset': 'earliest'}

consumer = Consumer(conf)
consumer.subscribe(["crawled_news"])

conf_p = {'bootstrap.servers': '10.0.0.1:9092'}
producer = Producer(conf_p)

##############################

def preprocess_string(text, lemmatizer = WordNetLemmatizer(), stemmer = PorterStemmer(), stopwords_corpus = corpus.stopwords.words('english')):
    text = str(text).lower().strip()
    text = re.sub(r'[^\w\s]', '', text).split()
    text = [word for word in text if word not in stopwords_corpus]
    text = [lemmatizer.lemmatize(word) for word in text]
    text = [stemmer.stem(word) for word in text]
    return text

while True:
    msg = consumer.poll(timeout=1.0)
    if msg is None: continue
    else:
        try:
            news_json = json.loads(msg.value())

            paragrafe=news_json["content"].split("*NewPARAGRAF*")

            title=news_json["title"]
            description=news_json["description"]

            paragrafe.insert(0,title)
            paragrafe.insert(0,description)

            paragrafe=list(map(preprocess_string, paragrafe))

            while("" in paragrafe) :
                 paragrafe.remove("")
                 
            tokParagrafe=tokenizer.texts_to_sequences(paragrafe)
	    
            padParagrafe=kprocessing.sequence.pad_sequences(tokParagrafe,  maxlen=128, padding="post", truncating="post")
            
            results=model.predict(padParagrafe)

            vector=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
            nr_paragrafe=0
            for i in range(len(results)):
                nr_paragrafe+=1*len(tokParagrafe[i])
                results[i]=results[i]*len(tokParagrafe[i])
                for j in range(len(vector)):
                    vector[j]+=results[i][j]
                
            for i in range(len(vector)):
                vector[i]=vector[i]/nr_paragrafe
            
    
            count=0
            for i in range(len(vector)):
                if(vector[i]>=0.33):
                    count+=1

            Category=""    
            for i in range(len(vector)):
                if(vector[i]>=0.25):
                    Category=Category+labels[i]+"*"+str(vector[i])+"-"
            
            if(Category==""):
                Category="No category"
                
            print(Category)
            
            news_json["category"]=Category

            producer.poll(0)
            producer.produce('categorised_news', json.dumps(news_json))
        except Exception as e:
            print(e)
            print("Invalid")
