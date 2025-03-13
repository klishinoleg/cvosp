#!/bin/bash
set -e

if [ -n "$AWS_REGION" ] && [ -n "$SECRET_NAME" ]; then
    echo "Fetching secrets from AWS Secrets Manager..."
    SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --region "$AWS_REGION" --query SecretString --output text || echo "")

    if [ -n "$SECRET_JSON" ]; then
        export POSTGRES_USER=$(echo "$SECRET_JSON" | jq -r '.POSTGRES_USER')
        export POSTGRES_PASSWORD=$(echo "$SECRET_JSON" | jq -r '.POSTGRES_PASSWORD')
    else
        echo "AWS Secrets not available, using .env"
    fi
else
    echo "AWS Secrets Manager is not configured, using .env"
fi

exec "$@"
