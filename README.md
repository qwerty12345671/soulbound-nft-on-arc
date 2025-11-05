# Arc Soulbound NFT (SBT) Backend Guide

This repository contains the **backend-only implementation** for deploying and minting **Soulbound NFTs (SBTs)** on the **Arc Testnet**, using **USDC** as the payment token.  

All frontend code has been removed to maintain a **clean backend focus**. This guide covers **every step**, including setup, deployment, minting, and GitHub version control.

---

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Prerequisites](#prerequisites)  
3. [Project Setup](#project-setup)  
4. [Environment Configuration](#environment-configuration)  
5. [Installing Dependencies](#installing-dependencies)  
6. [Project Structure](#project-structure)  
7. [Compiling Smart Contracts](#compiling-smart-contracts)  
8. [Deploying Contracts](#deploying-contracts)  
9. [Minting a Soulbound NFT](#minting-a-soulbound-nft)  
10. [Smart Contract Overview](#smart-contract-overview)  
11. [Scripts Overview](#scripts-overview)  
12. [GitHub Version Control](#github-version-control)  
13. [License](#license)  

---

## Project Overview

- ERC721-based **Soulbound NFT**  
- Users pay **5 USDC** to mint  
- **Non-transferable NFTs** (soulbound)  
- Designed for **Arc Testnet**  

---

## Prerequisites

- Node.js >= 18  
- npm  
- Hardhat (`npm install --save-dev hardhat`)  
- MetaMask (for Arc Testnet testing)  

---

## Project Setup

Clone the repository:

```bash
git clone https://github.com/qwerty12345671/soulbound-nft-on-arc.git
cd soulbound-nft-on-arc
````
Initialize Hardhat (if not already):
```bash
npx hardhat
````
## Environment Configuration

Create a .env file at the root:
```bash
PRIVATE_KEY=your_wallet_private_key
ARC_TESTNET_RPC_URL=https://rpc.testnet.arc.network
USDC_ADDRESS=0x3600000000000000000000000000000000000000
SBT_ADDRESS=Your Deployed Soulbound NFT contract address
````
•	PRIVATE_KEY: Wallet private key for deploying/minting

•	ARC_TESTNET_RPC_URL: Arc Testnet RPC endpoint

•	USDC_ADDRESS: Arc Testnet USDC token address

•	SBT_ADDRESS: Deployed Soulbound NFT contract address

## Installing Dependencies
```bash
npm install
````
Installs:

•	Hardhat

•	Ethers.js

•	OpenZeppelin Contracts

•	dotenv

## Project Structure
```text
arc-sbt/
├─ contracts/
│  └─ SoulboundNFT.sol
├─ scripts/
│  ├─ deploy.js
│  └─ mint.js
├─ test/
│  └─ Lock.js
├─ hardhat.config.js
├─ package.json
├─ package-lock.json
├─ .gitignore
├─ .env
└─ README.md
````
## Compiling Smart Contracts
```bash
npx hardhat compile
````
Expected output:
```bash
Compiled 1 Solidity file successfully (evm target: paris)
````
## Deploying Contracts
```bash
npx hardhat run scripts/deploy.js --network arcTestnet
````
Sample output:
```bash
Deploying with account: 0xYourWalletAddress
SoulboundNFT deployed at: 0xDeployedContractAddress
````
Update .env with SBT_ADDRESS after deployment.

## Minting a Soulbound NFT
Run the mint script:
```bash
npx hardhat run scripts/mint.js --network arcTestnet
````
Steps performed by the script:

	1.	Connect to Arc Testnet wallet
  
	2.	Check USDC balance
  
	3.	Approve SBT contract to spend 5 USDC
  
	4.	Mint the Soulbound NFT with metadata URL

Sample output:
```bash
Minting SBT from account: 0xYourWalletAddress
USDC balance: 8.495286
Approving SBT contract to spend 5 USDC...
Approval done.
Minting SBT...
Minted SBT successfully to: 0xYourWalletAddress
````
## Smart Contract Overview
SoulboundNFT.sol
```bash
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SoulboundNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;
    IERC20 public usdc;
    uint256 public price = 5 * 10 ** 6; // 5 USDC, 6 decimals

    constructor(address usdcAddress) ERC721("ArcSoulbound", "ASBT") {
        usdc = IERC20(usdcAddress);
    }

    function mint(string memory tokenURI) public {
        require(usdc.transferFrom(msg.sender, address(this), price), "Payment failed");
        _tokenIds++;
        _safeMint(msg.sender, _tokenIds);
        _setTokenURI(_tokenIds, tokenURI);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override {
        require(from == address(0) || to == address(0), "Soulbound: cannot transfer");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
}
````
written in javascript

## Scripts Overview
deploy.js
```bashconst hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const usdcAddress = process.env.USDC_ADDRESS;
  const SBT = await hre.ethers.getContractFactory("SoulboundNFT");
  const sbt = await SBT.deploy(usdcAddress);

  await sbt.deployed();
  console.log("SoulboundNFT deployed at:", sbt.address);
}

main().catch(console.error);
````
mint.js
```bash
require("dotenv").config();
const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [caller] = await ethers.getSigners();
  const SBT_ADDRESS = process.env.SBT_ADDRESS;
  const USDC_ADDRESS = process.env.USDC_ADDRESS;

  const SBT = await ethers.getContractFactory("SoulboundNFT");
  const sbt = SBT.attach(SBT_ADDRESS);
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);

  const price = ethers.BigNumber.from(5).mul(10 ** 6);
  const tokenURI = "https://example.com/metadata/1.json";

  const balance = await usdc.balanceOf(caller.address);
  if (balance.lt(price)) throw new Error("Not enough USDC to mint");

  const approvalTx = await usdc.approve(SBT_ADDRESS, price);
  await approvalTx.wait();

  const tx = await sbt.mint(tokenURI);
  await tx.wait();
  console.log(`Minted SBT successfully to: ${caller.address}`);
}

main().catch(console.error);
````
written in javascript

## GitHub Version Control
```bash
git init
git add -A
git commit -m "Backend only: Arc SBT"
git branch -M main
git remote add origin https://github.com/qwerty12345671/soulbound-nft-on-arc.git
git push -u origin main
````

## License

MIT License

by @qwerty12345671
