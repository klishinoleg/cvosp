#!/bin/bash
set -e
export ROLLUP_NO_BINARY=true
if [[ "$SERVER_HOST" == "localhost" ]]; then
    SERVER_DOMAIN="localhost:${SERVER_PORT}"
else
    SERVER_DOMAIN="${SERVER_HOST}"
fi

cat > /app/.env <<EOF
VITE_HOST=${VITE_HOST}
VITE_SERVER_DOMAIN=${SERVER_DOMAIN}
VITE_API_URL=${HTTP_SCHEME}://${SERVER_DOMAIN}/api/v1
VITE_SERVER_URL=${HTTP_SCHEME}://${SERVER_DOMAIN}
VITE_DEFAULT_LANGUAGE=${LANGUAGE}
VITE_LANGUAGES=${LANGUAGES}
VITE_DEBUG=false
EOF

echo "✅ vite/.env created:"
npm run build
exec npm run preview -- --host
