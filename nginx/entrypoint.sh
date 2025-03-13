#!/bin/sh
set -e

# Заменяем переменные окружения в шаблоне и сохраняем как `default.conf`
envsubst '${APP_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Запускаем Nginx
exec "$@"