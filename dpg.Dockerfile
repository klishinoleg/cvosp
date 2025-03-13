FROM postgres:15

RUN apt-get update && apt-get install -y awscli jq

COPY db_entrypoint.sh /cvosp/db_entrypoint.sh
RUN chmod +x /cvosp/db_entrypoint.sh
