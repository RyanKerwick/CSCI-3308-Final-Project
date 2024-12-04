#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://users_db_zoq2_user:rhhEnS4R7amNmefKM8yxyM5SqfhvjwUC@dpg-ct0b0f68ii6s73fk6ne0-a.oregon-postgres.render.com/users_db_zoq2"

# Execute each .sql file in the directory
for file in ./src/init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done