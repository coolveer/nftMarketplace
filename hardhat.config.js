require("@nomiclabs/hardhat-waffle");
const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();


module.exports = {
  networks:{
    hardhat:{
      chainId:1337
    },
    goerli:{
      url:"https://goerli.infura.io/v3/5c9db9375d8e45618b0acde54ca9c415",
      accounts:[privateKey]
    }
    // mainnet:{}
  },
  solidity: "0.8.4",
};
