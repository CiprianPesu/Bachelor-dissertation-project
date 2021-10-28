sudo docker image rm localhost:32000/rssparser
sudo docker image rm rssparser
sudo docker image build -t rssparser .
sudo docker image tag rssparser localhost:32000/rssparser
sudo docker image push localhost:32000/rssparser
