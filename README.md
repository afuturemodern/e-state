#ULO Codebase 1 

###Build Instructions
1. [Download and install Node.js](https://nodejs.org/en/download/)
2. [Download, install, and run Ganache](https://github.com/trufflesuite/ganache/releases)
3. Run `npm install -g truffle`
4. Run `npm install .`
5. Run `truffle compile` to compile contracts
6. Run `truffle migrate` to push contracts to local network

###Testing Instructions
#####Console Testing
To test in the console, run `truffle console`. From there, you can grab an
instance of the three main contracts by typing `myContract.deployed().then(function(instance){myInstance = instance;})`. After this, you can call func
tions using javascript.

#####Unit Testing (not implemented yet)
To test using unit tests, run `truffle test tests/mytest.js`
#####Browser Testing (not ready yet)
To test in the browser run `npm run dev`, and make sure you have [Metamask installed](https://metamask.io/) and you're [configured to use Ganache's Testnet](http://truffleframework.com/docs/advanced/truffle-with-metamask)
