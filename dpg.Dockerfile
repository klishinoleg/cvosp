FROM postgres:15
RUN apt-get update && apt-get install -y awscli jq

