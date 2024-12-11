const hre = require("hardhat");

async function main() {
  const Lock = await hre.ethers.getContractFactory("Lock");
  
  const unlockTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365;
  const lock = await Lock.deploy(unlockTime, {
    value: hre.ethers.parseEther("0.001") 
  });

  await lock.waitForDeployment();

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });