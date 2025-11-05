require("dotenv").config();
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const usdcAddress = process.env.USDC_ADDRESS;
  if (!usdcAddress) throw new Error("USDC_ADDRESS not set in .env");

  const SBT = await hre.ethers.getContractFactory("SoulboundNFT");
  const sbt = await SBT.deploy(usdcAddress); // start deployment
  await sbt.waitForDeployment(); // <-- Ethers v6

  console.log("SoulboundNFT deployed at:", sbt.target); // <-- use .target for address in v6
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});