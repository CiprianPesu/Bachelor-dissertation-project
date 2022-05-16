FROM ubuntu:latest

COPY Category.py /usr/src/myapp/Category.py
COPY model2.h5 /usr/src/myapp/model2.h5
COPY tokenizer.pickle /usr/src/myapp/tokenizer.pickle
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
CMD bash ./bash.sh
