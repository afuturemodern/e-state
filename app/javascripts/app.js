// Import the page's CSS. Webpack will know what to do with it.
import jQuery from 'jquery';
window.$ = window.jQuery = jQuery;

import 'bootstrap';

import "../stylesheets/app.scss";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'
import asset_artifacts from '../../build/contracts/AssetToken.json'
import token_artifacts from '../../build/contracts/DeclaToken.json'
import rentings_artifacts from '../../build/contracts/Rentings.json'
import community_artifacts from '../../build/contracts/CommunityContract.json'
import comment_artifacts from '../../build/contracts/CommentEconomy.json'
var Asset = contract(asset_artifacts);
var Token = contract(token_artifacts);
var Rentings = contract(rentings_artifacts);
var Community = contract(community_artifacts);
var Comment = contract(comment_artifacts);
const IPFSUploader = require('ipfs-image-web-upload');



// Import our contract artifacts and turn them into usable abstractions.

// MetaCoin is our usable abstraction, which we'll use through the code below.

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI('localhost', '5001');
const OrbitDB = require('orbit-db');

const ipfsOptions = {
  EXPERIMENTAL: {
    pubsub: true
  },
};

var IPFS = require('ipfs');
var uploader = new IPFSUploader(new IPFS());
const ipfs2 = new IPFS(ipfsOptions);
/*
ipfs2.on('ready', async () => {
  const orbitdb = new OrbitDB(ipfs2);
  const access ={
    write: ['*'],
  }
  const db = await orbitdb.log('ulo-database', access);
  const test_hash = await db.add('hello world');
  const latest = db.iterator({limit: 5}).collect();

  console.log(JSON.stringify(latest, null, 2));
  
})*/


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
      Asset.setProvider(web3.currentProvider);
      Token.setProvider(web3.currentProvider);
      Rentings.setProvider(web3.currentProvider);
      Community.setProvider(web3.currentProvider);
      Comment.setProvider(web3.currentProvider);

      accounts = accs;
      account = accounts[0];
      var bal;
      Token.deployed().then(function(instance){
        instance.balanceOf.call(accounts[0]).then(function(balance){
          bal = balance.toNumber()/1000000000000000000;
          $('#balance').val(bal);
        });
      });

//      self.refreshBalance();


      var ethAddressIput = $('#sign-up-eth-address').val(accounts[0]);
      var signUpButton = $('#create-asset-button').click(function() {
	      self.createAsset();
	      return false;
      });
	    self.getAssets();
    });
  },
  createAsset: function(){
    var name = $('#asset_name').val();
    var physaddr = $('#phys_addr').val();
    var description = $('#desc').val();
    var pic_input = document.getElementById("pic_input");
    //var file_input = document.getElementById("file_input");
    var ipfsHash = '';
    //var imghash = uploader.uploadBlob(pic_input.target.files[0]);
    var assetJson = {name: name, physaddr: physaddr, description: description};
    ipfs.add([Buffer.from(JSON.stringify(assetJson))], function(err, res){
      if (err) throw err
      ipfsHash = res[0].hash; 
      console.log("ipfs hash is: "+ipfsHash);
      Asset.deployed().then(function(instance){
        console.log("creating asset token",name, physaddr, ipfsHash);
        instance.CreateAssetToken(name, physaddr, ipfsHash, {from: accounts[0]}).then(function(success){
          if(success){
            console.log('created asset token');
          } else {
            console.log('error')
          }
        }).catch(function(e){
          console.log(e);
        });
        
        

      })
    });
  },
  getAnAsset: function(instance, i){
    var instanceUsed = instance;
    var name;
    var ipfsHash;
    var physaddr;
    var assetCardId = 'asset-card-'+i;
    return instanceUsed.name_t.call(i).then(function(name){
      console.log('name: ', name);
      $('#'+assetCardId).find('.card-title').text(name);
      return instanceUsed.physaddr.call(i);
    }).then(function(physaddr){
      console.log(physaddr);
      $('#'+assetCardId).find('.card-subtitle').text(physaddr);
      return instanceUsed.validated.call(i);
    }).then(function(validated){
      console.log(validated);
      return instanceUsed.tokenMetadata.call(i);
    }).then(function(metadata){
      var url = "http://localhost:8080/ipfs/"+metadata;
      console.log('getting asset info from', url);
      $.getJSON(url, function(assetJson) {
        console.log('gotassetinfo from ipfs', assetJson);
        $('#' + assetCardId).find('.card-text').text(assetJson.description);
        //$('#'+assetCardId).find('.card-text').text(userJson.intro);
      });
      return instanceUsed.tokenOwners.call(i);
    }).then(function(address){
      console.log('owner address ', address);
      $('#'+assetCardId).find('card-eth-address').text(address);
      return true;
    }).catch(function(e){
      console.log('error getting asset #', i, ':', e);
    });
  },
  getAssets: function(){
    var self = this;
    var instanceUsed;
    Asset.deployed().then(function(contractInstance){
      instanceUsed = contractInstance;
      return instanceUsed.totalSupply.call();
    }).then(function(assetCount){
      assetCount = assetCount.toNumber();
      console.log('Asset Count', assetCount);
      var rowCount = 0;
      var assetsDiv = $('#assets-div');
      var currentRow;
      for (var i = 0; i < assetCount; i++){
        var assetCardId = "asset-card-"+i;
        if(i%4 == 0){
          var currentRowId = 'user-row-'+ rowCount;
          var assetRowTemplate = '<div class="row" id="'+currentRowId +  '"></div>';
          assetsDiv.append(assetRowTemplate);
          currentRow = $('#'+currentRowId);
          rowCount++;
        }
        var assetTemplate = `
        <div class="col-lg-3 mt-1 mb-1" id="` +assetCardId+`">
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
        currentRow.append(assetTemplate);

      }
        console.log("getting assets...");
        for(var i = 0; i < assetCount; i++){
          self.getAnAsset(instanceUsed, i);
        }
    });

  },

	/*createUser: function(){
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
	},*/
	/*getAUser: function(instance, i) {
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
	},*/
/*getUsers: function() {
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

},*/

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
