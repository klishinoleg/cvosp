FROM python:3.11

RUN apt update && apt install -y postgresql-client netcat-traditional

WORKDIR /cvosp

COPY pyproject.toml requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY supervisord.conf /etc/supervisord.conf
RUN mkdir -p /var/log/supervisor
RUN mkdir -p uploads

RUN pip install supervisor

RUN chmod +x /cvosp/entrypoint.sh

CMD ["/cvosp/entrypoint.sh"]
