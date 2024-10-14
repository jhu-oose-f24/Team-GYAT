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

## Frontend
### Setup
From Team-GYAT directory
  - cd frontend
  - npm install
  - npm start

## Smart Contract
The `contract` directory holds the smart contract, which is also compiled and stored in `contract/artifacts`. The Remix online IDE has a testing framework, which will be used to ensure all functionality of the contract is working properly. From there, the `web3.py` framework will be used to create a contract from the backend, and `ether.js` will be used to interact with the contract for any following contract interactions.  

## Known bugs
...
