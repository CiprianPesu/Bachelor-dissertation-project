FROM ubuntu:latest
COPY ElasticConnection.py /usr/src/myapp/ElasticConnection.py
COPY bash.sh /usr/src/myapp/bash.sh
WORKDIR /usr/src/myapp
RUN apt-get update && apt-get install -y python3
RUN apt-get update && apt-get install -y python3-pip
RUN apt-get update && apt-get install -y gcc
RUN pip install --no-input confluent-kafka
RUN pip install --no-input elasticsearch
CMD bash ./bash.sh
