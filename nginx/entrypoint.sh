#!/bin/bash
set -e

SERVER_PORT=${SERVER_PORT:-8001}
VITE_PORT=${VITE_PORT:-80}
SERVER_HOST="localhost"
VITE_HOST="localhost"

if [ -n "$AWS_REGION" ] && [ -n "$SECRET_NAME" ]; then
    echo "Fetching domains from AWS Secrets Manager..."
    SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --region "$AWS_REGION" --query SecretString --output text || echo "")

    if [ -n "$SECRET_JSON" ]; then
        SERVER_HOST_NEW=$(echo "$SECRET_JSON" | jq -r '.SERVER_HOST')
        VITE_HOST_NEW=$(echo "$SECRET_JSON" | jq -r '.VITE_HOST')

        if [[ -n "$SERVER_HOST_NEW" && "$SERVER_HOST_NEW" != "null" ]]; then
            SERVER_HOST="$SERVER_HOST_NEW"
            SERVER_PORT="80"
        fi
        if [[ -n "$VITE_HOST_NEW" && "$VITE_HOST_NEW" != "null" ]]; then
            VITE_HOST="$VITE_HOST_NEW"
            VITE_PORT="80"
        fi
    fi
fi

export SERVER_PORT VITE_PORT SERVER_HOST VITE_HOST
envsubst '${SERVER_PORT} ${SERVER_HOST} ${VITE_PORT} ${VITE_HOST}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
cat /etc/nginx/conf.d/default.conf
exec "$@"
