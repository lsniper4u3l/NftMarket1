require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs")
const privateKey = fs.readFileSync(".secret").toString()
const projectId = "76f14100d1574f9e91cad402a7ba2832"


module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: 'https://polygon-mumbai.infura.io/v3/${projectId}' ,
      accounts: [privateKey]
    },
    mainnet: {
      url: 'https://polygon-mainnet.infura.io/v3/${projectId}' ,
      accounts: [privateKey]
    }
  },
  solidity: "0.8.19",
};
