FROM schatzop/veto-ui:latest

RUN apt-get update && apt-get upgrade -y

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get install -y git
RUN apt-get install jq -y
 
# install python 3.7
RUN apt install software-properties-common -y
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt-get update

RUN apt-get install python3.7 -y && \
    apt install python3-pip -y

RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.7 1

# install pands
RUN pip3 install pandas

# install java 8
RUN apt-get install -y --no-install-recommends --assume-yes openjdk-8-jdk 
    
ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/

# create appriate folders
RUN mkdir -p /dataX/VeTo/VeTo-data
RUN mkdir -p /dataX/VeTo/VeTo-results
RUN mkdir -p /dataX/VeTo/VeTo-workflows

# clone veto-workflows
RUN git clone https://github.com/schatzopoulos/VeTo-workflows.git /dataX/VeTo/VeTo-workflows

