#!/bin/bash
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

        if [[ -n "$POSTGRES_PASSWORD_NEW" && "$POSTGRES_PASSWORD_NEW" != "null" ]]; then
            POSTGRES_PASSWORD="$POSTGRES_PASSWORD_NEW"
        fi
    else
        echo "AWS Secrets not available, using .env"
    fi
else
    echo "AWS Secrets Manager is not configured, using .env"
fi

echo "Final DB_USER: $DB_USER"
echo "Final DB_PASSWORD: $DB_PASSWORD"
echo "Final POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
echo "Final POSTGRES_USER: $POSTGRES_USER"

exec env POSTGRES_PASSWORD="$POSTGRES_PASSWORD" POSTGRES_USER="$POSTGRES_USER" docker-entrypoint.sh postgres &

sleep 5

echo "Hello 5"

DB_EXISTS=$(psql -U $POSTGRES_USER -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

if [ "$DB_EXISTS" == "1" ]; then
    echo "✅ [init_db.sh] Database $DB_NAME already exists. Skipping initialization."
else
    echo "📌 [init_db.sh] Creating database $DB_NAME..."

    psql -U $POSTGRES_USER <<EOSQL
        CREATE USER "$DB_USER" WITH PASSWORD '$DB_PASSWORD';
        CREATE DATABASE "$DB_NAME" OWNER "$DB_USER";
        GRANT ALL PRIVILEGES ON DATABASE "$DB_NAME" TO "$DB_USER";
EOSQL

    echo "✅ [init_db.sh] Database $DB_NAME and user $DB_USER created successfully."
fi

wait
