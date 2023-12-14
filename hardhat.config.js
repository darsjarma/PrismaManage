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
        url: "https://rpc.mevblocker.io/fullprivacy",
        // url: "https://little-yolo-emerald.quiknode.pro/369be4aaa1161d62e009f0e1a4ac1e94cd6fb45b",
        // url: "https://mainnet.infura.io/v3/565f790bcf44405d9869fff6a0a78843",
        // blockNumber: 18757690 //Before an opening trove,
        // origin: 'singapore'
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
