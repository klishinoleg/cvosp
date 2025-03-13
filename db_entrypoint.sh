#!/bin/bash
set -e

if [ -n "$AWS_REGION" ] && [ -n "$SECRET_NAME" ]; then
    echo "Fetching secrets from AWS Secrets Manager..."
    SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --region "$AWS_REGION" --query SecretString --output text || echo "")

    if [ -n "$SECRET_JSON" ]; then
        export POSTGRES_USER_NEW=$(echo "$SECRET_JSON" | jq -r '.POSTGRES_USER')
        export POSTGRES_PASSWORD_NEW=$(echo "$SECRET_JSON" | jq -r '.POSTGRES_PASSWORD')

        if [[ -n "$POSTGRES_USER_NEW" && "$POSTGRES_USER_NEW" != "null" ]]; then
            export POSTGRES_USER="$POSTGRES_USER_NEW"
            echo "export POSTGRES_USER=\"$POSTGRES_USER_NEW\"" >> /etc/environment
        fi

        if [[ -n "$POSTGRES_PASSWORD_NEW" && "$POSTGRES_PASSWORD_NEW" != "null" ]]; then
            export POSTGRES_PASSWORD="$POSTGRES_PASSWORD_NEW"
            echo "export POSTGRES_PASSWORD=\"$POSTGRES_PASSWORD_NEW\"" >> /etc/environment
        fi
    else
        echo "AWS Secrets not available, using .env"
    fi
else
    echo "AWS Secrets Manager is not configured, using .env"
fi

exec env $(cat /etc/environment | xargs) "$@"
