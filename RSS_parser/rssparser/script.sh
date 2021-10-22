sudo docker image rm localhost:32000/rssparser2
sudo docker image rm rssparser2
sudo docker image build -t rssparser2 .
sudo docker image tag rssparser2 localhost:32000/rssparser2
sudo docker image push localhost:32000/rssparser2
