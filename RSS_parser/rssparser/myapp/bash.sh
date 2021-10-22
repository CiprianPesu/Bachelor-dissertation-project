echo "nameserver 8.8.8.8" | tee /etc/resolv.conf > /dev/null
apt-get update
apt-get install -y openjdk-8-jre
java -jar rssparser.jar
sleep 5h
