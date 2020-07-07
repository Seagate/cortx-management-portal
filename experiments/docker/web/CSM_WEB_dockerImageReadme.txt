1) Open DockerFile and update Workdir location
2) Download the nodejs from https://nodejs.org/dist/v12.13.0/node-v12.13.0-linux-x64.tar.xz ,untar this and put on the workdir locaion
3) Download the latest rpm from ci-storage directory ex: http://ci-storage.mero.colo.seagate.com/releases/eos/Cortx-1.0.0-13-rc8/ and put on the workdir location.
4) Copy the ssl certificate file from csm\jenkins\cicd location to workdir location 
5) Put the dockerFile on the workdir location
6) run "docker build --tag csm_web_docker_image ." (it will build the docker image.)
7) run "docker run  -p 28100:28100 -it csm_web_docker_image /bin/bash" (it will run the docker )
8) run this command in docker context "/opt/nodejs/node-v12.13.0-linux-x64/bin/node /opt/seagate/eos/csm/web/web-dist/server.js"
9) run "ifconfig" in vm to know its ip address
10) now our csm_web service is accecible from outside try https://<vm ipaddress>:28100/#/login (page should get loaded)



