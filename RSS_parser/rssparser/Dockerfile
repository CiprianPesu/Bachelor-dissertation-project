FROM ubuntu:latest
COPY ./myapp/* /usr/src/myapp/
WORKDIR /usr/src/myapp
RUN apt-get update && apt-get install -y openjdk-8-jre
RUN chmod 755 /usr/src/myapp/phantomjs
CMD bash ./bash.sh

