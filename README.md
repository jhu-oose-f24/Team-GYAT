# Team-GYAT

Our app is a platform for students to find and offer services to their peers. Think of existing online marketplaces for tasks like Fiverr, but this is only offered to JHU students, and students use cryptocurrency to pay each other, eliminating the need for a middle man in terms of payments. Additionally, our app will use advanced searching algorithms to help users find tasks that match their past interests. 

## Backend 
### Server Setup
The `flask` framework is used for the server, which interacts with the database using `SQLAlchemy`.

Make sure to run 'pip3 install -r requirements.txt' before running the backend.
To run the backend:
- make sure you are in the directory of Team-GYAT/backend
- run 'python3 app.py'

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

## How to Create User
Since we do not have login functionality setup we are creating a user through POSTMAN. 
1. Creating a User
POST URL:http://127.0.0.1:5000/users
Headers: Content-Type: application/json
Body(JSON): {
    "username": "johndoe",
    "fullname": "John Doe",
    "year": "2024",
    "email": "johndoe@example.com",
    "password": "securepassword123"
}
2. Fetching all Users
GET URL: http://127.0.0.1:5000/users

3. Fetching Single User by ID
*note make sure you have the right user id should be users/userID
GET URL: http://127.0.0.1:5000/users/1
  
4. Updating a User
PUT URL: http://127.0.0.1:5000/users/1
Headers: Content-Type: application/json
Body(JSON):{
    "fullname": "Johnathan Doe",
    "email": "johnathan.doe@example.com",
    "year": "2025"
}

5. Deleting a User
DELETE URL: http://127.0.0.1:5000/users/1

User profile page can be viewed right now by clicking the button 'Profile'. Dummy
information currently until we have login setup, which we are working on for
next iteration. Currently have it setup so you can update username, fullname,
year, and email, but might to choose to remove updating feature later. Will
connect everything to backend after login setup.

## Connecting to ETH testnet
1. Running the testnet: in `frontend`, run `npm install hardhat`, then `npx hardhat node`. This command will start the testnet, and provide 20 mock accounts with 10000 ETH loaded into each one. Take note of the url present at the top of the printed text block when hardhat is run: `http://127.0.0.1:8545`.
2. Adding the testnet network to MetaMask: in the networks menu reachable from the top left button, select "Add Network" then "Add Network Manually" at the bottom of the next page. Name the network anything, and input the url from the previous step as the New GPC url. Input `31337` as the chain ID and `ETH` as the currency`.
3. Connecting to an account: In the logs printed by hardhat, choose one of the "Private Key"s and copy it. In MetaMask at the center top, select "Account", "Add Account or Hardware Wallet", "Import Account", and paste the private key. You should see 10000 ETH loaded into your account on MetaMask (assuming you have the testnet selected. If not, change to the testnet in the top left corner).
4. Creating a smart contract: on the web app, input data into the create contract fields and press submit. On MetaMask, ensure that the account that you just added is the one selected. Confirm the contract creation on MetaMask.

### Troubleshooting:
- If you encounter `invalid block number` or `invalid nonce number`: stop the hardhat network, run `rm -rf cache/ artifacts/`. Redo the testnet setup outlined above, and use a private key corresponding to a different account number than used previously.
- JHU wifi blocks MetaMask, so use a personal hotspot if you're on campus.
=======

## How to Use Conversations and Messages
Since this API doesn't currently require login, we’ll demonstrate creating and managing conversations and messages directly through Postman. NOTE: Make sure to replace the ids with the ids you generate.

1. Creating a Conversation
POST URL: http://127.0.0.1:5000/conversations
Headers: Content-Type: application/json
Body (JSON):
{
  "participant_ids": [1, 2]
}

2. Fetching All Conversations for a User
GET URL: http://127.0.0.1:5000/users/1/conversations

3. Creating Messages
POST URL: http://127.0.0.1:5000/messages
Headers: Content-Type: application/json
Body (JSON):
{
  "text": "Hello, everyone!",
  "sender_id": 1,
  "conversation_id": 1
}

4. Fetching All Messages in a Conversation
Method: GET
URL: http://127.0.0.1:5000/conversations/1/messages

5. Fetching a Single Message by ID
GET URL: http://127.0.0.1:5000/messages/1

6. Adding a Participant to an Existing Conversation
POST URL: http://127.0.0.1:5000/conversations/1/participants
Headers: Content-Type: application/json
Body (JSON):
{
  "user_id": 3
}

7. Removing a Participant from a Conversation
DELETE URL: http://127.0.0.1:5000/conversations/1/participants/2

8. Fetching Participants in a Conversation
GET URL: http://127.0.0.1:5000/conversations/1/participants

## Creating Job/Service
On the Navigation Bar of our app, there is a "Become a Seller" button
Click on it, and fill out the fields there to post your job/service, and it 
should be displayed on the job feed now when clicking navigating back
to the main page.

## Known bugs
Props rendering is almost done, we are having a merge conflict problem with the new addition with the addition of descriptions into the database and once that is resolved we will have individual props rendering
