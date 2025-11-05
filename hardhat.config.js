require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./.env" });

const { PRIVATE_KEY, ARC_TESTNET_RPC_URL } = process.env;

if (!PRIVATE_KEY || !ARC_TESTNET_RPC_URL) {
  throw new Error(
    "⚠️ Missing environment variables. Ensure .env contains PRIVATE_KEY and ARC_TESTNET_RPC_URL"
  );
}

module.exports = {
  solidity: "0.8.28",
  networks: {
    arcTestnet: {
      url: ARC_TESTNET_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5042002,
    },
  },
};