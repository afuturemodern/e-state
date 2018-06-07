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
      network_id: "*" // Match any network id
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/"+infura_apikey)
      },
      network_id: 3
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/"+infura_apikey)
      },
      gasPrice: 2000000000000,
      network_id: 3
    }
  }
  
};
