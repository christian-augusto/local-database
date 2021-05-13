sudo docker container rm -f $(sudo docker container ls -aq)
sudo docker image rm -f $(sudo docker image ls -aq)
sudo docker network rm $(sudo docker network ls -q)
