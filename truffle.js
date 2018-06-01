var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "shoe noodle tooth often spin share draft decade ancient blast drama keep";
var infura_apikey = "0lahMLTdgVWYQPpNa8W8";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      gasPrice: 2000000000,
    },
    ropsten: {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey),
      network_id: 3
    }
  }
};
