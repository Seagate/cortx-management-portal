FROM registry.access.redhat.com/ubi8/ubi
MAINTAINER Seagate
RUN yum install -y wget
RUN yum install -y net-tools
WORKDIR /home/72031
RUN mkdir -p /opt/nodejs/node-v12.13.0-linux-x64
ADD node-v12.13.0-linux-x64/ /opt/nodejs/node-v12.13.0-linux-x64/
RUN mkdir -p /etc/ssl/stx
COPY stx.pem /etc/ssl/stx/stx.pem
COPY eos-csm.rpm . 
RUN yum install -y eos-csm.rpm
