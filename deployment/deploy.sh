microk8s kubectl apply -f zoo.yaml
microk8s kubectl apply -f kafka.yaml
microk8s kubectl apply -f RSSparser.yaml

microk8s kubectl apply -f Volumes.yaml

microk8s kubectl apply -f ElasticSearch.yaml
microk8s kubectl apply -f kibana.yaml
