#!/bin/bash
set -e

if [[ "$SERVER_HOST" != "localhost" ]]; then
  SERVER_PORT="80"
  VITE_PORT="80"
fi

export SERVER_PORT VITE_PORT SERVER_HOST VITE_HOST
envsubst '${SERVER_PORT} ${SERVER_HOST} ${VITE_PORT} ${VITE_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

cat /etc/nginx/conf.d/default.conf

exec "$@"
