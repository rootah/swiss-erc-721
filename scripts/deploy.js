const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const RTH721 = await hre.ethers.getContractFactory("RTH721");

  // Deploy the contract and provide the deployer's address as the initial owner
  const nft = await RTH721.deploy(deployer.address);

  // Wait for the contract to be deployed
  await nft.waitForDeployment();

  // Get the deployed contract address
  const nftAddress = await nft.getAddress();

  console.log("RTH721 deployed to:", nftAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
