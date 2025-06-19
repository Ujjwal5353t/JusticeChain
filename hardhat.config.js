require("@nomiclabs/hardhat-waffle");

const PRIVATE_KEY = "0xa3a711b3ce1f86a929dcc4ed6412ba8b9631edeb261309e97d3fcbfcad35a0f5";
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/qVq2L-afC0Mh7D_ZlygGynnGTFsW4KXJ";

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY]
    }
  }
};

