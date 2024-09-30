#!/bin/bash

# define credentials
MYSQL_ROOT_PASSWORD="team-gyat"
MYSQL_DATABASE="task-market-db"
MYSQL_USER="mqsql-user"
MYSQL_PASSWORD="mysql-password"
CONTAINER_NAME="task-market-db-container"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# create the docker-compose.yml file if it doesn't already exist
if [ ! -f "$DOCKER_COMPOSE_FILE" ]; then
    echo "Creating docker-compose.yml file..."
    cat <<EOF > $DOCKER_COMPOSE_FILE
version: '3.8'

services:
  db:
    image: mysql:latest
    container_name: $CONTAINER_NAME
    environment:
      MYSQL_ROOT_PASSWORD: $MYSQL_ROOT_PASSWORD
      MYSQL_DATABASE: $MYSQL_DATABASE
      MYSQL_USER: $MYSQL_USER
      MYSQL_PASSWORD: $MYSQL_PASSWORD
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
EOF
else
    echo "docker-compose.yml already exists. Skipping creation."
fi

# start mysql container
echo "Starting MySQL container..."
docker-compose up -d

sleep 20

# Create SQL commands for Users and Jobs tables
SQL_COMMANDS="
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS Jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    status ENUM('open', 'accepted', 'provider_done', 'requester_approved', 'finished'),
    price FLOAT,
    smart_contract_address VARCHAR(255),
    requester_id INT,
    FOREIGN KEY (requester_id) REFERENCES Users(id),
    provider_id INT,
    FOREIGN KEY (provider_id) REFERENCES Users(id),
);
"

# create tables using the above definitions
echo "Creating tables Users and Jobs..."
docker exec -i $CONTAINER_NAME mysql -u root -p$MYSQL_ROOT_PASSWORD $MYSQL_DATABASE <<< "$SQL_COMMANDS"

echo "setup complete."
