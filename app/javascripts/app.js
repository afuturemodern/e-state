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
var buffer = require('buffer');
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
      self.getAssets();



      var ethAddressIput = $('#sign-up-eth-address').val(accounts[0]);
      var signUpButton = $('#create-asset-button').click(function() {
	      self.createAsset();
	      return false;
      });
      $(document).ready(function(){
      var editNameButton = $('.edit-name-button').click(function(){
        console.log('edit name clicked');
        var data = $.parseJSON($(this).attr('data-button'));
        self.editName(data.option1);
      });
      var editPhysaddrButton = $('.edit-physaddr-button').click(function(){
        console.log('edit physaddr clicked');
      });
      var editDescButton = $('.add-desc-button').click(function(){

      });
      var addPicButton = $('.add-pic-button').click(function(){

      });
      var addVidButton = $('.add-vid-button').click(function(){

      });
      var addFileButton = $('.add-file-button').click(function(){

      });
      });
	    
    });
  },
  editName: function(x){
    var newName = $('#asset_name'+x).val();
    console.log("editing name");
    Asset.deployed().then(function(instance){
      instance.ChangeName(x, newName, {from: accounts[0]}).then(function(success){
        if(success){
            console.log('Successfully edited name');
          } else {
            console.log('error')
          }
      }).catch(function(e){
        console.log(e);
      });
    });
  },
  editPhysaddr: function(x){
    var newPhysaddr = $('#phys_addr'+x).val();
    console.log("editing physical address");
    Asset.deployed().then(function(instance){
      instance.ChangePhysAddr(x, newPhysaddr, {from: accounts[0]}).then(function(success){
        if(success){
            console.log('Successfully edited physical address');
          } else {
            console.log('error')
          }
      }).catch(function(e){
        console.log(e);
      });
    });
  },
  editDescription: function(x){
    console.log("editing description");
    var newDesc = $('#desc'+x).val();
    var instance;
    Asset.deployed().then(function(g){
      instance = g;
      return instance.tokenMetadata.call(x);
    }).then(function(metadata){
      var url = "http://localhost:8080/ipfs/"+metadata;
      return $.getJSON(url, function(assetJson) {
        console.log('gotassetinfo from ipfs', assetJson);
        return assetJson;
      });
    }).then(function(assetJson){
      assetJson.description = newDesc;
      var ipfsHash = '';
      ipfs.add([Buffer.from(JSON.stringify(assetJson))], function(err, res){
        if (err) throw err
        ipfsHash = res[0].hash; 
        console.log("ipfs hash is: "+ipfsHash);
        instance.UpdateTokenData(x, ipfsHash, {from: accounts[0]}).then(function(success){
          if(success){
            console.log('Successfully edited description');
          } else {
            console.log('error')
          }
        }).catch(function(e){
          console.log(e);
        });
      });
    });
/*
return instanceUsed.tokenMetadata.call(i);
    }).then(function(metadata){
      var url = "http://localhost:8080/ipfs/"+metadata;
      console.log('getting asset info from', url);
      $.getJSON(url, function(assetJson) {
        console.log('gotassetinfo from ipfs', assetJson);
        $('#' + assetCardId).find('.card-text').text(assetJson.description);

*/
  },
  uploadPic: function(x){
    var reader = new FileReader();
    console.log("adding photo");
    var instance;
    Asset.deployed().then(function(g){
      instance = g;
      return instance.tokenMetadata.call(x);
    }).then(function(metadata){
      var url = "http://localhost:8080/ipfs/"+metadata;
      return $.getJSON(url, function(assetJson) {
        console.log('gotassetinfo from ipfs', assetJson);
        return assetJson;
      });
    }).then(function(assetJson){
    reader.onloadend = function(){
      const buf = buffer.Buffer(reader.result);
      ipfs.files.add(buf, (err, result) => {
        if(err){
          console.error(err);
          return;
        }
        var pichash = result[0].hash;
        console.log("Picture hash:",pichash);
        assetJson.pics.push({"pic":pichash});
        ipfs.add([Buffer.from(JSON.stringify(assetJson))], function(err, res){
        if (err) throw err
        var ipfsHash = res[0].hash; 
        console.log("ipfs hash is: "+ipfsHash);
        instance.UpdateTokenData(x, ipfsHash, {from: accounts[0]}).then(function(success){
          if(success){
            console.log('Successfully uploaded picture');
          } else {
            console.log('error')
          }
        }).catch(function(e){
          console.log(e);
        });
      });

      });
    }
    var photo = document.getElementById("photo"+x);
    reader.readAsArrayBuffer(photo.files[0]);
  });

  },
  uploadVid: function(x){
    var reader = new FileReader();
    console.log("adding video");
    var instance;
    Asset.deployed().then(function(g){
      instance = g;
      return instance.tokenMetadata.call(x);
    }).then(function(metadata){
      var url = "http://localhost:8080/ipfs/"+metadata;
      return $.getJSON(url, function(assetJson) {
        console.log('gotassetinfo from ipfs', assetJson);
        return assetJson;
      });
    }).then(function(assetJson){
    reader.onloadend = function(){
      const buf = buffer.Buffer(reader.result);
      ipfs.files.add(buf, (err, result) => {
        if(err){
          console.error(err);
          return;
        }
        var vidhash = result[0].hash;
        console.log("Video hash:",vidhash);
        assetJson.vids.push({"vid":vidhash});
        ipfs.add([Buffer.from(JSON.stringify(assetJson))], function(err, res){
        if (err) throw err
        var ipfsHash = res[0].hash; 
        console.log("ipfs hash is: "+ipfsHash);
        instance.UpdateTokenData(x, ipfsHash, {from: accounts[0]}).then(function(success){
          if(success){
            console.log('Successfully uploaded video');
          } else {
            console.log('error')
          }
        }).catch(function(e){
          console.log(e);
        });
      });

      });
    }
    var video = document.getElementById("video"+x);
    reader.readAsArrayBuffer(video.files[0]);
  });

  },
  ValidateAsset: function(x){
    var instance;
    Asset.deployed().then(function(g){
      instance = g;
      return instance.VoteAssetToken(x, {from: accounts[0]});
    }).then(function(success) {
      if(success){
        console.log("Successfully voted for asset's approval");
      } else {
        console.log("Error: ");
      }
    }).catch(function(e){
      console.log(e);
    });
  },
  uploadFile: function(x){
    var reader = new FileReader();
    console.log("adding file");
    var instance;
    Asset.deployed().then(function(g){
      instance = g;
      return instance.tokenMetadata.call(x);
    }).then(function(metadata){
      var url = "http://localhost:8080/ipfs/"+metadata;
      return $.getJSON(url, function(assetJson) {
        console.log('gotassetinfo from ipfs', assetJson);
        return assetJson;
      });
    }).then(function(assetJson){
    reader.onloadend = function(){
      const buf = buffer.Buffer(reader.result);
      ipfs.files.add(buf, (err, result) => {
        if(err){
          console.error(err);
          return;
        }
        var filehash = result[0].hash;
        console.log("File hash:",filehash);
        assetJson.files.push({"file":filehash});
        ipfs.add([Buffer.from(JSON.stringify(assetJson))], function(err, res){
        if (err) throw err
        var ipfsHash = res[0].hash; 
        console.log("ipfs hash is: "+ipfsHash);
        instance.UpdateTokenData(x, ipfsHash, {from: accounts[0]}).then(function(success){
          if(success){
            console.log('Successfully uploaded file');
          } else {
            console.log('error')
          }
        }).catch(function(e){
          console.log(e);
        });
      });

      });
    }
    var file = document.getElementById("file"+x);
    reader.readAsArrayBuffer(file.files[0]);
  });

  },
  sellAsset: function(x){
    var price = Number($('#asset_price'+x).val()) * 1000000000000000000;
    var instance;
    Asset.deployed().then(function(g){
      instance = g;
      return instance.ListforSale(x, price, {from: accounts[0]});
    }).then(function(success) {
      if(success){
        console.log("Successfully listed asset for sale");
      } else {
        console.log("Error: ");
      }
    }).catch(function(e){
      console.log(e);
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
    var assetJson = {name: name, physaddr: physaddr, description: description, pics: [], vids: [], files:[], owners:[{owner: accounts[0], price: 10, timestamp: Date.now()}]};
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
  loadShow: function(x){
    Asset.deployed().then(function(instance){
      return instance.tokenMetadata.call(x);
    }).then(function(metadata){
      var url = "http://localhost:8080/ipfs/"+metadata;
      return $.getJSON(url, function(assetJson) {
        console.log('gotassetinfo from ipfs', assetJson);
        return assetJson;
      });
    }).then(function(assetJson){
      var pics = assetJson.pics;
      var picsdiv = $('#photos-div'+x);
      for(var i=0; i< pics.length; i++) {
        console.log(pics[i]["pic"]);
        if(i==0){
          var pictemplate = `<div class="carousel-item active">
          <img class="d-block w-100" src="http://localhost:8080/ipfs/`+pics[i]["pic"]+`" height="200px">
          </div>`;
        } else {
          var pictemplate = `<div class="carousel-item">
          <img class="d-block w-100" src="http://localhost:8080/ipfs/`+pics[i]["pic"]+`" height="200px">
          </div>`;
        }
        picsdiv.append(pictemplate);
      }

      var vids = assetJson.vids;
      var vidsdiv = $('#vids-div'+x);
      for(var i = 0; i <vids.length; i++){
        console.log(vids[i]["vid"]);
        if(i==0){
        var vidtemplate = `
          <div class="carousel-item active">
          <video width="320" height="240" controls>
          <source src="http://localhost/8080/ipfs/`+vids[i]["vid"]+`" type="video/mp4">
          </video>
          </div>`;
        } else {
          var vidtemplate = `
          <div class="carousel-item">
          <video width="320" height="240" controls>
          <source src="http://localhost/8080/ipfs/`+vids[i]["vid"]+`" type="video/mp4">
          </video>
          </div>`;
        }
        vidsdiv.append(vidtemplate);
      }
      var files = assetJson.files;
      var filesdiv = $('#files-div'+x);
      for(var i=0; i< files.length; i++) {
        console.log(files[i]["file"]);
        var filetemplate = `<a href="http://localhost:8080/ipfs/`+files[i]["file"]+`" target="_blank">File `+i+`</a>`;
        filesdiv.append(filetemplate);
      }
      var owners = assetJson.owners;
      var ownersdiv = $('#history-div'+x);
      for(var i=0; i< owners.length; i++) {
        console.log(owners[i]["owner"]);
        console.log(owners[i]["price"]);
        console.log(owners[i]["timestamp"]);
        var stamp = new Date(parseInt(owners[i]["timestamp"])).toLocaleString();
        var ownertemplate = `<li>Owner: `+owners[i]["owner"]+`, Purchase Price: `+owners[i]["price"]+`, Date and Time Purchased: `+stamp;
        ownersdiv.append(ownertemplate);
      }

    });
  },
  showPrice: function(i){
    var instance;
    Asset.deployed().then(function(s){
      instance = s;
    }).then(function(){
        instance.tokenPrice(i).then(function(price){
        $('#buy-modal'+i).find('.buy-price-p2').text(price/1000000000000000000);
      });
    });
  },
  buyAsset: function(i){
    var instance;
    Asset.deployed().then(function(s){
      instance = s;
    }).then(function(){
      return instance.BuyToken(i, {from: accounts[0]});
    }).then(function(success){
      if(success){
        console.log("Successfully bought asset. Please click to make it IPFS official");
    
        Asset.deployed().then(function(instance){
          return instance.tokenMetadata.call(i);
        }).then(function(metadata){
          var url = "http://localhost:8080/ipfs/"+metadata;
          return $.getJSON(url, function(assetJson) {
            console.log('gotassetinfo from ipfs', assetJson);
            return assetJson;
          });
        }).then(function(assetJson){
          instance.tokenPrice(i).then(function(price){
            assetJson.owners.push({owner: accounts[0], price: price/1000000000000000000, timestamp: Date.now()});
            return assetJson;
          }).then(function(assetJson){
            console.log(assetJson.owners);
            ipfs.add([Buffer.from(JSON.stringify(assetJson))], function(err, res){
              if (err) throw err
              var ipfsHash = res[0].hash; 
              console.log("ipfs hash is: "+ipfsHash);
              instance.UpdateTokenData(i, ipfsHash, {from: accounts[0]}).then(function(success){
              if(success){
                console.log('Successfully added ownership');
              } else {
                console.log('error')
              }
            });
          });
          });

        }).catch(function(e){
          console.log(e);
        });
        
      } else {
        console.log("Error: ");
      }
    }).catch(function(e){
      console.log(e);
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
      if(validated){
        $('#'+assetCardId).find('.card-validated').show();
      }
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
      $('#'+assetCardId).find('.card-eth-address').text(address);
      $(document).ready(function(){
      if(address == accounts[0]){
        console.log('same address');
        if($('#'+assetCardId).find('.edit-button').is(":visible")){
          $('#'+assetCardId).find('.edit-button').hide();
        } else {
          $('#'+assetCardId).find('.edit-button').show();
        }
      }
      instanceUsed.forSale(i).then(function(for_sale){
        if(for_sale){
          if($('#'+assetCardId).find('.card-for-sale').is(":visible")){
            $('#'+assetCardId).find('.card-for-sale').hide();
          } else {
            $('#'+assetCardId).find('.card-for-sale').show();
          }
          if(address != accounts[0]){
            if($('#'+assetCardId).find('.buy-button').is(":visible")){
              $('#'+assetCardId).find('.buy-button').hide();
            } else {
              $('#'+assetCardId).find('.buy-button').show();
            }
            instanceUsed.tokenPrice(i).then(function(price){
              $('#'+assetCardId).find('.card-price').text(price/1000000000000000000);
            });
            
          }
        }
      });
      instanceUsed.hasCred.call(accounts[0]).then(function(isvalidator){
        if(isvalidator){
          instanceUsed.show_validated(i).then(function(valid){
            if(!valid){
              instanceUsed.voted_for(i, accounts[0]).then(function(voted){
                if(!voted){
                  if($('#'+assetCardId).find('.validate-button').is(":visible")){
                    $('#'+assetCardId).find('.validate-button').hide();
                  } else {
                    $('#'+assetCardId).find('.validate-button').show();
                  }
                }
              });
            } else {
              instanceUsed.forSale(i).then(function(for_sale){
                if(!for_sale){
                  if(address == accounts[0]){
                    if($('#'+assetCardId).find('.sale-button').is(":visible")){
                      $('#'+assetCardId).find('.sale-button').hide();
                    } else {
                      $('#'+assetCardId).find('.sale-button').show();
                    }
                  }
                }
              });
            }
          })
        }
      });

      });
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
                <p class="card-validated" style="display: none;">
                Verified <i class="fa fa-check-circle"></i>
                </p>
                <p class="card-for-sale" style="display: none;">
                For Sale <i class="fa fa-star"></i>
                Price: <span class="card-price" style="color:06e"></span>
                </p>
                <button type="button" class="btn btn-success edit-button" data-toggle="modal" data-target="#edit-modal`+assetCardId+`">Edit</button>
                <button type="button" class="btn btn-danger show-button" data-toggle="modal" data-target="#show-modal`+assetCardId+`" onclick="window.App.loadShow(`+i+`); this.onclick=null;">Show More</button>
                <button type="button" class="btn btn-success validate-button" style="display: none" onclick="window.App.ValidateAsset(`+i+`); this.onclick=null;">Validate</button>
                <button type="button" class="btn btn-warning sale-button" style="display: none" data-toggle="modal" data-target="#sale-modal`+assetCardId+`">List For Sale</button>
                <button type="button" class="btn btn-success buy-button" style="display: none" data-toggle="modal" data-target="#buy-modal`+i+`" onclick="window.App.showPrice(`+i+`); this.onclick=null;">Buy Asset</button>
              </div>
            </div>
        </div>
<div class="modal fade" id="buy-modal`+i+`" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Buy Asset #` + i +`</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div class="alert alert-danger" role="alert">
        Purchases are Final! Be sure you are actually willing to pay the price.
      </div>
      <div class="form-group">
      <label for="name">Price</label>
      <span class="buy-price-p2" style="color: #0056e8">
      </span>
      </div>
      <button type="button" class="btn btn-success buy-button" onclick="window.App.buyAsset(`+i+`);">Buy Asset</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="sale-modal`+assetCardId+`" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Sell Asset #` + i +`</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div class="alert alert-danger" role="alert">
        Sales are Final! You can stop them before someone buys, but not after. Be very careful to pick a price you actually want to sell your property for. 
      </div>
      <div class="form-group">
      <label for="name">Selling Price</label><br />
      <input type="number" min="0.00" class="form-control" id="asset_price`+i+`" >
      
      </div>
      <button type="button" class="btn btn-success sale-button" onclick="window.App.sellAsset(`+i+`);">List For Sale</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="edit-modal`+assetCardId+`" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Edit Asset #` + i +`</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      <div class="form-group">
      <label for="name">Edit Name</label><br />
      <input type="text" class="form-control" id="asset_name`+i+`" >
      <button type="button" class="edit-name-button btn btn-warning" data-button="`+i+`" onclick="window.App.editName(`+i+`)">Edit</button> 
      </div>

      <div class="form-group">
      <label for="name">Physical Address</label><br />
      <input type="text" class="form-control" id="phys_addr`+i+`" >
      <button type="button" class="btn btn-warning edit-physaddr-button" onclick="window.App.editPhysaddr(`+i+`)">Edit</button>
      </div>

       <div class="form-group">
      <label for="username">Edit Description</label><br />
      <textarea class="form-control" id="desc`+i+`" rows="2"></textarea>
      <button type="button" class="btn btn-warning add-desc-button" onclick="window.App.editDescription(`+i+`)">Edit</button>
        </div>
      <div class="form-group">
      <label for="username">Add Photo</label><br />
      <input type="file" name="photo" id="photo`+i+`">
      <button type="button" class="btn btn-warning add-desc-button" onclick="window.App.uploadPic(`+i+`)">Add Photo</button>
        </div>
      <div class="form-group">
      <label for="username">Add Video</label><br />
      <input type="file" name="video" id="video`+i+`">
      <button type="button" class="btn btn-warning add-desc-button" onclick="window.App.uploadVid(`+i+`)">Add Video</button>
        </div>
      <div class="form-group">
      <label for="username">Add File</label><br />
      <input type="file" name="video" id="file`+i+`">
      <button type="button" class="btn btn-warning add-desc-button" onclick="window.App.uploadFile(`+i+`)">Add File</button>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="show-modal`+assetCardId+`" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Show Asset #` + i +`</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">


      <h3>Photos</h3>
      <div id="carouselExampleControlsPic`+i+`" class="carousel slide" data-ride="carousel">
  <div class="carousel-inner" id="photos-div`+i+`">


  </div>
  <a class="carousel-control-prev" href="#carouselExampleControlsPic`+i+`" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleControlsPic`+i+`" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
  </div>

      
      <h3>Videos</h3>
      <div id="carouselExampleControlsvid`+i+`" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner" id="vids-div`+i+`">



      </div>

  <a class="carousel-control-prev" href="#carouselExampleControlsvid`+i+`" role="button" data-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="carousel-control-next" href="#carouselExampleControlsvid`+i+`" role="button" data-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>

      </div>

    
      <h3>Files</h3>
      <div id="files-div`+i+`"></div>
            <h3>Ownership History</h3>
      <div>
      <ul id="history-div`+i+`">

      </ul>
      </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        
      </div>
    </div>
  </div>
</div>


        `;
        currentRow.append(assetTemplate);

      }
        console.log("getting assets...");
        for(var i = 0; i < assetCount; i++){
          self.getAnAsset(instanceUsed, i);
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
