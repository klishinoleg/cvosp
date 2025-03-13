#!/bin/bash
echo "Waiting for PostgreSQL to be ready..."
while ! nc -z $DB_HOST $DB_PORT; do sleep 1; done
echo "PostgreSQL is ready!"


echo "Running Aerich migrations..."

if [ -d "/cvosp/migrations/models" ]; then
    echo "Migrations already exist, skipping init-db."
else
    echo "Initializing Aerich..."
    aerich init -t app.cfg.database.TORTOISE_ORM
    aerich init-db
    aerich upgrade
    echo "Creating admin user..."
    python t.py add_admin "$ADMIN_USER" "$ADMIN_PASSWORD"
fi

exec supervisord -c /etc/supervisord.conf