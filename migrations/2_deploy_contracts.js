/*const DeclaToken = artifacts.require("DeclaToken");
const IcoContract = artifacts.require("IcoContract");
const AssetToken = artifacts.require("AssetToken");
const Rentings = artifacts.require("Rentings");
const CommunityContract = artifacts.require("CommunityContract");
const CommentEconomy = artifacts.require("CommentEconomy");

module.exports = async function(deployer) {
  
  var token;
  var asset;
  await deployer.deploy(DeclaToken);
  await DeclaToken.deployed().then(function(instance){token = instance;});

  await deployer.deploy(AssetToken, DeclaToken.address);
  await AssetToken.deployed().then(function(instance){asset = instance;});

  await token.setAssetContract(AssetToken.address);

  await deployer.deploy(Rentings, DeclaToken.address, AssetToken.address);

  await token.setRentingsContract(Rentings.address);

  await asset.setRentingsContract(Rentings.address);

  await deployer.deploy(CommunityContract, DeclaToken.address, AssetToken.address);

  await token.setCommunityContract(CommunityContract.address);

  await asset.setCommunityContract(CommunityContract.address);

  await deployer.deploy(CommentEconomy, DeclaToken.address, AssetToken.address);
  await token.setCommentContract(CommentEconomy.address);

  await asset.setCommentContract(CommentEconomy.address);

  await deployer.deploy(
    IcoContract,
    '0x627306090abaB3A6e1400e9345bC60c78a8BEf57', //owner address
    DeclaToken.address,
    '1000000000000000000000000000',//1000000000 Token
    '1000',
    '1525791307', //05/08/2018
    '1575068800', //sometime in august, idk
    '100000000000000000', //0.1 ETH
  );

  token.setIcoContract(IcoContract.address);
    
    
};
*/


const DeclaToken = artifacts.require("DeclaToken");
const IcoContract = artifacts.require("IcoContract");
const AssetToken = artifacts.require("AssetToken");
const Rentings = artifacts.require("Rentings");
const CommunityContract = artifacts.require("CommunityContract");
const CommentEconomy = artifacts.require("CommentEconomy");

module.exports = function(deployer) {
  var token;
  var asset;
  return deployer.deploy(DeclaToken).then(function(instance){
    token = instance;
    return token;
  }).then(function(){
    return deployer.deploy(AssetToken, DeclaToken.address).then(function(instance){
      asset = instance;
      return asset;
    });
  }).then(function(){
    token.setAssetContract(AssetToken.address);
  }).then(function(){
    deployer.deploy(Rentings, DeclaToken.address, AssetToken.address);
  }).then(function(){
    token.setRentingsContract(Rentings.address);
  }).then(function(){
    asset.setRentingsContract(Rentings.address);
  }).then(function(){
    deployer.deploy(CommunityContract, DeclaToken.address, AssetToken.address);
  }).then(function(){
    token.setCommunityContract(CommunityContract.address);
  }).then(function(){
    asset.setCommunityContract(CommunityContract.address);
  }).then(function(){
    deployer.deploy(CommentEconomy, DeclaToken.address, AssetToken.address);
  }).then(function(){
    token.setCommentContract(CommentEconomy.address);
  }).then(function(){
    asset.setCommentContract(CommentEconomy.address);
  }).then(function(){
  deployer.deploy(
      IcoContract,
      '0x627306090abaB3A6e1400e9345bC60c78a8BEf57', //owner address
      DeclaToken.address,
      '1000000000000000000000000000',//1000000000 Token
      '1000',
      '1525791307', //05/08/2018
      '1535068800', //sometime in august, idk
      '100000000000000000', //0.1 ETH
    ).then(() => {
      return DeclaToken.deployed().then(function(instance) {
        return instance.setIcoContract(IcoContract.address);
      });  
    });
});  
};


/*const DeclaToken = artifacts.require("DeclaToken");
const IcoContract = artifacts.require("IcoContract");
const AssetToken = artifacts.require("AssetToken");
const Rentings = artifacts.require("Rentings");
const CommunityContract = artifacts.require("CommunityContract");
const CommentEconomy = artifacts.require("CommentEconomy");

module.exports = function(deployer) {
  deployer.deploy(DeclaToken).then(() => {
    deployer.deploy(AssetToken, DeclaToken.address).then( () => {
      return DeclaToken.deployed().then(function(instance){
        return instance.setAssetContract(AssetToken.address);
      })});
    deployer.deploy(Rentings, DeclaToken.address, AssetToken.address).then( () => {
      DeclaToken.deployed().then(function(instance){
        instance.setRentingsContract(Rentings.address);
      });
	    return AssetToken.deployed().then(function(instance){
		    instance.setRentingsContract(Rentings.address);
	    }
		);
    });
    deployer.deploy(CommunityContract, DeclaToken.address, AssetToken.address).then( () => {
      DeclaToken.deployed().then(function(instance){
        instance.setCommunityContract(CommunityContract.address);
      });
      return AssetToken.deployed().then(function(instance){
        instance.setRentingsContract(CommunityContract.address);
      }
    );
    });
    deployer.deploy(CommentEconomy, DeclaToken.address, AssetToken.address).then( () => {
      DeclaToken.deployed().then(function(instance){
        instance.setCommentContract(CommentEconomy.address);
      });
      return AssetToken.deployed().then(function(instance){
        instance.setCommentContract(CommentEconomy.address);
      }
    );
    });
    return deployer.deploy(
      IcoContract,
      '0x627306090abaB3A6e1400e9345bC60c78a8BEf57', //owner address
      DeclaToken.address,
      '1000000000000000000000000000',//1000000000 Token
      '1000',
      '1525791307', //05/08/2018
      '1535068800', //sometime in august, idk
      '100000000000000000', //0.1 ETH
    ).then(() => {
      return DeclaToken.deployed().then(function(instance) {
        return instance.setIcoContract(IcoContract.address);
      });  
    });
  });
};
*/
