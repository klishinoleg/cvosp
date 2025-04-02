#!/bin/bash
set -e
export ROLLUP_NO_BINARY=true
SERVER_PORT=${SERVER_PORT:-8001}
SERVER_HOST="localhost"

if [ -n "$AWS_REGION" ] && [ -n "$SECRET_NAME" ]; then
    echo "🔐 Fetching secrets from AWS Secrets Manager..."
    SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id "$SECRET_NAME" --region "$AWS_REGION" --query SecretString --output text || echo "")
    if [ -n "$SECRET_JSON" ]; then
         SERVER_HOT_NEW=$(echo "$SECRET_JSON" | jq -r '.SERVER_HOST')
         if [[ -n "$SERVER_HOST_NEW" && "$SERVER_HOST_NEW" != "null" ]]; then
            SERVER_HOST="$SERVER_HOST_NEW"
            SERVER_PORT="80"
        fi
    fi
fi

if [[ "$SERVER_HOST" == "localhost" ]]; then
    SERVER_DOMAIN="http://localhost:${SERVER_PORT}"
else
    SERVER_DOMAIN="https://${SERVER_HOST}"
fi

cat > /app/.env <<EOF
VITE_API_URL=${SERVER_DOMAIN}/api/v1
VITE_SERVER_URL=${SERVER_DOMAIN}
VITE_DEFAULT_LANGUAGE=${LANGUAGE}
VITE_LANGUAGES=${LANGUAGES}
VITE_DEBUG=false
EOF

echo "✅ vite/.env created:"
npm run build
exec npm run preview -- --host
