/** @type import('hardhat/config').HardhatUserConfig */
require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100
      },
      viaIR: true
    }
  },

  networks: {
    hardhat: {
      forking: {
        url: "https://eth.llamarpc.com",
        // url: "https://flashy-alien-telescope.quiknode.pro/c2f9146b98ffb9fc8808a23dcffdb488890a32a1/",
        blockNumber: 18667678, //Before an opening trove,
        origin: 'singapore'
      }
    },
    goerli:{
      url:"https://eth-goerli.public.blastapi.io"
      // accounts: [process.env.GOERLI_PRIVATE_KEY]
    },
    mainnet:{
      url: "https://eth.llamarpc.com"
      // accounts: [process.env.MAIN_NET_PRIVATE_KEY]
    }
  },
  etherscan:{
    apiKey: "VZ78U22G3ED27ZBQZ2E2TA7U5CUHMDJI81"
  },
  localhost: {
    url: "http://127.0.0.1:8545"
  }
}
