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
    deployer.deploy(Rentings, DeclaToken.address, AssetToken.address).then(function(){
      token.setRentingsContract(Rentings.address);
      asset.setRentingsContract(Rentings.address);
    });
  }).then(function(){
    deployer.deploy(CommunityContract, DeclaToken.address, AssetToken.address).then(function(){
      token.setCommunityContract(CommunityContract.address);
      asset.setCommunityContract(CommunityContract.address);
    });
  }).then(function(){
    deployer.deploy(CommentEconomy, DeclaToken.address, AssetToken.address).then(function(){
      token.setCommentContract(CommentEconomy.address);
      asset.setCommentContract(CommentEconomy.address);
    });
  }).then(function(){
  deployer.deploy(
      IcoContract,
      '0x7D239D841D4C5713CB3CbA2a8D74E6d85F42EfCd', //owner address
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
