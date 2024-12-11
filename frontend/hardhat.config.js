require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.27", 
  networks: {
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_URL, 
      accounts: [process.env.PRIVATE_KEY] 
    }
  }
};