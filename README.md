# Team-GYAT

## Backend 
### Server
The `flask` framework is used for the server, which interacts with the database using `SQLAlchemy`.

### DB setup
A `MySQL` database is the database of choice for this application. To start:
- run `backend/setup_mysql.sh` bash script. This script creates:
  - a new `docker-compose.yml` file and stores it in the `backend` directory
  - a new docker container which runs the `MySQL` instance
  - `Jobs` and `Users` tables which are defined in the script.
    - To create new tables / alter the fields of an existing table, do it here. 

If this script has been run already from a previous session, there is no need to run it again. To spin up the database in subsequent sessions:
- `docker-compose up -d`

To shut down the database at the end of a session:
- `docker-compose down`. Optionally add `-v` flag to clear database memory, but the setup script will need to be run again to recreate the database schema.

## Known Bugs
At the end of iteration 1, we were not able to finish all of the CRUD APIs for the backend. We can successfully create users, but creating jobs causes an error, as the `Users.user_id` foreign key is not recognized, and we did not have time to investigate this bug further. It will be competed in Iteration 2.

## Running Frontend
From Team-GYAT
  - cd frontend
  - npm install
  - npm start