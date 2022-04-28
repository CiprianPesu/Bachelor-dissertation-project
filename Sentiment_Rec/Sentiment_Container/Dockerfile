FROM ubuntu:latest
COPY Sentiment_LSTM.py /usr/src/myapp/Sentiment_LSTM.py
COPY Model-200-l3-2/ /usr/src/myapp/Model-200-l3-2/
COPY tokenizer-200-nou.pickle /usr/src/myapp/tokenizer-200-nou.pickle
COPY bash.sh /usr/src/myapp/bash.sh
WORKDIR /usr/src/myapp
RUN apt-get update && apt-get install -y python3
RUN apt-get update && apt-get install -y python3-pip
RUN apt-get update && apt-get install -y gcc
RUN apt-get update && apt-get install -y librdkafka-dev
RUN pip install --no-input --upgrade pip
RUN pip install --no-input nltk
RUN pip install --no-input tensorflow
RUN pip install --no-input confluent-kafka
RUN pip install --no-input elasticsearch
CMD bash ./bash.sh
