// Import the page's CSS. Webpack will know what to do with it.
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import 'bootstrap';

import "../stylesheets/app.scss";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import user_artifacts from '../../build/contracts/User.json'
var User = contract(user_artifacts);

// Import our contract artifacts and turn them into usable abstractions.

// MetaCoin is our usable abstraction, which we'll use through the code below.

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('localhost', '5001');
//const ipfs = ipfsAPI('infuria.io', '5001', {protocol: 'https'});
window.App = {
  start: function() {
    var self = this;

    ipfs.id(function(err, res) {
	    if (err) throw err
		    console.log("Connected to IPFS node!", res.id, res.agentVersion, res.protocolVersion);
    });
    // Bootstrap the MetaCoin abstraction for Use.

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

//      self.refreshBalance();
      User.setProvider(web3.currentProvider);

      var ethAddressIput = $('#sign-up-eth-address').val(accounts[0]);
      var signUpButton = $('#sign-up-button').click(function() {
	      self.createUser();
	      return false;
      });
	self.getUsers();
    });
  },
	createUser: function(){
		var username = $('#sign-up-username').val();
		var title = $('#sign-up-title').val();
		var intro = $('#sign-up-intro').val();

		var ipfsHash = '';

		console.log('creating user on eth for', username);
		var userJson = {username: username, title: title, intro: intro};
		ipfs.add([Buffer.from(JSON.stringify(userJson))], function(err, res){
			if (err) throw err
			ipfsHash = res[0].hash
		
		console.log('creating user on eth for', username, title, intro, ipfsHash);
		
		User.deployed().then(function(contractInstance){
			contractInstance.createUser(username, ipfsHash, {from: web3.eth.accounts[0]}).then(function(success){
				if(success){
					console.log('created user on ethereum!');
				} else {
					console.log('error creating user on ethereum');
				}
			}).catch(function(e) {
				console.log('error creating user:', username,":",e);
			});
		});
		});
	},
	getAUser: function(instance, i) {
		var instanceUsed = instance;
		var username;
		var ipfsHash;
		var address;
		var userCardId = 'user-card-'+ i;
		return instanceUsed.getUsernameByIndex.call(i).then(function(_username){
console.log('username:', username = web3.toAscii(_username), i); 
 $('#' + userCardId).find('.card-title').text(username);
 return instanceUsed.getIpfsHashByIndex.call(i);

}).then(function(_ipfsHash) {

console.log('ipfsHash:', ipfsHash = web3.toAscii(_ipfsHash), i);
 if(ipfsHash != 'not-available') {
   var url = 'http://localhost:8080/ipfs/' + ipfsHash;
   console.log('getting user info from', url);

   $.getJSON(url, function(userJson) {
	   console.log('gotuserinfo from ipfs', userJson);
	   $('#' + userCardId).find('.card-subtitle').text(userJson.title);
	   $('#'+userCardId).find('.card-text').text(userJson.intro);
   });
 }
 return instanceUsed.getAddressByIndex.call(i);
 
 }).then(function(_address) {

console.log('address:', address = _address, i);
 $('#' + userCardId).find('.card-eth-address').text(address);
 return true;

}).catch(function(e) {

console.log('error getting user #', i, ':', e);

});
	},
getUsers: function() {
    var self = this;

var instanceUsed;

User.deployed().then(function(contractInstance) {

instanceUsed = contractInstance;

return instanceUsed.getUserCount.call();

}).then(function(userCount) {

userCount = userCount.toNumber();

console.log('User count', userCount);

var rowCount = 0;
      var usersDiv = $('#users-div');
      var currentRow;

for(var i = 0; i < userCount; i++) {

var userCardId = 'user-card-' + i;

if(i % 4 == 0) {
          var currentRowId = 'user-row-' + rowCount;
          var userRowTemplate = '<div class="row" id="' + currentRowId + '"></div>';
          usersDiv.append(userRowTemplate);
          currentRow = $('#' + currentRowId);
          rowCount++;
        }

var userTemplate = `
          <div class="col-lg-3 mt-1 mb-1" id="` + userCardId + `">
            <div class="card bg-gradient-primary text-white card-profile p-1">
              <div class="card-body">
                <h5 class="card-title"></h5>
                <h6 class="card-subtitle mb-2"></h6>
                <p class="card-text"></p>        
                <p class="eth-address m-0 p-0">
                  <span class="card-eth-address"></span>
                </p>
              </div>
            </div>
          </div>`;

currentRow.append(userTemplate);

}

console.log("getting users...");

for(var i = 0; i < userCount; i++) {

self.getAUser(instanceUsed, i);

}

});

},

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
