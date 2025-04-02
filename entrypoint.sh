#!/bin/bash
echo "Waiting for PostgreSQL to be ready at $DB_HOST:$DB_PORT"

DB_HOST="db"

for i in {1..5}; do
  if nc -z "$DB_HOST" "$DB_PORT"; then
    echo "✅ PostgreSQL is ready!"
    break
  else
    echo "⏳ Waiting ($i)..."
    sleep 1
  fi
done

if ! nc -z "$DB_HOST" "$DB_PORT"; then
  echo "❌ Could not connect to PostgreSQL at $DB_HOST:$DB_PORT"
  exit 1
fi

echo "PostgreSQL is ready!"

set -e

if [ -n "$AWS_REGION" ] && [ -n "$SECRET_NAME" ]; then
    echo "Fetching secrets from AWS Secrets Manager..."
    SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --region "$AWS_REGION" --query SecretString --output text || echo "")

    if [ -n "$SECRET_JSON" ]; then
        DB_USER_NEW=$(echo "$SECRET_JSON" | jq -r '.DB_USER')
        DB_PASSWORD_NEW=$(echo "$SECRET_JSON" | jq -r '.DB_PASSWORD')
        POSTGRES_PASSWORD_NEW=$(echo "$SECRET_JSON" | jq -r '.POSTGRES_PASSWORD')

        if [[ -n "$DB_USER_NEW" && "$DB_USER_NEW" != "null" ]]; then
            DB_USER="$DB_USER_NEW"
        fi

        if [[ -n "$DB_PASSWORD_NEW" && "$DB_PASSWORD_NEW" != "null" ]]; then
            DB_PASSWORD="$DB_PASSWORD_NEW"
        fi
    else
        echo "AWS Secrets not available, using .env"
    fi
else
    echo "AWS Secrets Manager is not configured, using .env"
fi

echo "Final DB_USER: $DB_USER"
echo "Final DB_PASSWORD: $DB_PASSWORD"

if [ -d "/cvosp/migrations/models" ]; then
    echo "Migrations already exist, skipping init-db. Check migrations and update"
    aerich migrate
    aerich upgrade
else
    sleep 10
    echo "Running Aerich migrations..."
    echo "Initializing Aerich..."
    aerich init -t app.cfg.database.TORTOISE_ORM
    aerich init-db
    aerich upgrade
    echo "Creating admin user..."
    python t.py add_admin "$ADMIN_USER" "$ADMIN_PASSWORD"
fi

exec supervisord -c /etc/supervisord.conf
