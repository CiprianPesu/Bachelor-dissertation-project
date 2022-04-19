FROM ubuntu:latest
COPY Similarity.py /usr/src/myapp/Similarity.py
COPY bash.sh /usr/src/myapp/bash.sh
WORKDIR /usr/src/myapp
RUN apt-get update && apt-get install -y python3
RUN apt-get update && apt-get install -y python3-pip
RUN apt-get update && apt-get install -y gcc
RUN pip install --no-input --upgrade pip
RUN pip install --no-input flask
RUN pip install --no-input spacy_universal_sentence_encoder
RUN pip install --no-input elasticsearch
CMD bash ./bash.sh
