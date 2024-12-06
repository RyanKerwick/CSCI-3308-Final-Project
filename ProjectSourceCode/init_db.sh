#!/bin/bash

# DO NOT PUSH THIS FILE TO GITHUB
# This file contains sensitive information and should be kept private

# TODO: Set your PostgreSQL URI - Use the External Database URL from the Render dashboard
PG_URI="postgresql://users_db_f717_user:UIZE86LOxb26VrQcZ9alApGix5RVED62@dpg-ct9k8sm8ii6s73ah9pu0-a.oregon-postgres.render.com/users_db_f717"

# Execute each .sql file in the directory
for file in init_data/*.sql; do
    echo "Executing $file..."
    psql $PG_URI -f "$file"
done