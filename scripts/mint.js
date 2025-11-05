require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  // Use the default signer (wallet running the script)
  const [caller] = await ethers.getSigners();

  // Grab addresses from environment variables
  const SBT_ADDRESS = process.env.SBT_ADDRESS;
  const USDC_ADDRESS = process.env.USDC_ADDRESS;
  if (!SBT_ADDRESS || !USDC_ADDRESS) throw new Error("Missing SBT_ADDRESS or USDC_ADDRESS in .env");

  console.log("Minting SBT from account:", caller.address);

  // Attach deployed contracts
  const SBT = await ethers.getContractFactory("SoulboundNFT");
  const sbt = SBT.attach(SBT_ADDRESS);
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);

  // Define price using parseUnits (6 decimals for USDC)
  const price = ethers.parseUnits("5", 6); // 5 USDC

  const tokenURI = "https://example.com/metadata/1.json"; // Update per token if needed

  // Check USDC balance
  const balance = await usdc.balanceOf(caller.address);
  console.log("USDC balance:", ethers.formatUnits(balance, 6));
  if (balance < price) throw new Error("Not enough USDC to mint");

  // Approve SBT contract to spend USDC
  console.log("Approving SBT contract to spend 5 USDC...");
  const approvalTx = await usdc.approve(SBT_ADDRESS, price);
  await approvalTx.wait();
  console.log("Approval done.");

  // Mint the Soulbound NFT
  console.log("Minting SBT...");
  const tx = await sbt.mint(tokenURI);
  await tx.wait();
  console.log(`Minted SBT successfully to: ${caller.address}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});