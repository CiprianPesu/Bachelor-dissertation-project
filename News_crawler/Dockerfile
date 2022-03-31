FROM ubuntu:latest
COPY url_crawler.py /usr/src/myapp/url_crawler.py
COPY bash.sh /usr/src/myapp/bash.sh
WORKDIR /usr/src/myapp
RUN apt-get update && apt-get install -y python3
RUN apt-get update && apt-get install -y python3-pip
RUN apt-get update && apt-get install -y gcc
RUN pip install --no-input Unidecode
RUN pip install --no-input --upgrade pip
RUN pip install --no-input confluent-kafka
RUN pip install --no-input BeautifulSoup4
RUN pip install --no-input goose3
RUN pip install --no-input elasticsearch
CMD bash ./bash.sh
