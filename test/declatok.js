var Token = artifacts.require("DeclaToken");

contract('reallifetoken', function(accounts) {
  it("should assert true", function() {
    var token;
    return Token.deployed().then(function(instance){
     token = instance;
     return token.totalSupply.call();
    }).then(function(result){
     assert.equal(result.toNumber(), 300000000000000000000000000, 'total supply is wrong');
    })
  });
it("should return the balance of token owner", function() {
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
    return token.balanceOf.call(accounts[0]);
  }).then(function(result){
    assert.equal(result.toNumber(), 300000000000000000000000000, 'balance is wrong');
  })
});

it("should transfer right token", function() {
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
    return token.transfer(accounts[1], 150000000000000000000000000);
  }).then(function(){
    return token.balanceOf.call(accounts[0]);
  }).then(function(result){
    assert.equal(result.toNumber(), 150000000000000000000000000, 'accounts[0] balance is wrong');
    return token.balanceOf.call(accounts[1]);
  }).then(function(result){
    assert.equal(result.toNumber(), 150000000000000000000000000, 'accounts[1] balance is wrong');
  })
});

it("should give accounts[1] authority to spend account[0]'s token", function() {
  var token;
  return Token.deployed().then(function(instance){
   token = instance;
   return token.approve(accounts[1], 50000000000000000000000000);
  }).then(function(){
   return token.allowance.call(accounts[0], accounts[1]);
  }).then(function(result){
   assert.equal(result.toNumber(), 50000000000000000000000000, 'allowance is wrong');
   return token.transferFrom(accounts[0], accounts[2], 50000000000000000000000000, {from: accounts[1]});
  }).then(function(){
   return token.balanceOf.call(accounts[0]);
  }).then(function(result){
   assert.equal(result.toNumber(), 100000000000000000000000000, 'accounts[0] balance is wrong');
   return token.balanceOf.call(accounts[1]);
  }).then(function(result){
   assert.equal(result.toNumber(), 150000000000000000000000000, 'accounts[1] balance is wrong');
   return token.balanceOf.call(accounts[2]);
  }).then(function(result){
   assert.equal(result.toNumber(), 50000000000000000000000000, 'accounts[2] balance is wrong');
  })
});
it("should show the transfer event", function() {
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
    return token.transfer(accounts[1], 100000);
  }).then(function(result){
    console.log(result.logs[0].event)
  })
});
it("allows users to create suggestions", function(){
//check that it takes away correct amount of money
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
    return token.suggest(5000000000, "blah", Math.round((new Date()).getTime() / 1000)+300, 1, accounts[1]);
  }).then(function(result){
    assert.equal(suggestions[1].task, "blah");
  });
});
it("correctly verifies patrons", function(){
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });
});
it("finds the correct patron number for a given patron", function(){
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });
});
it("allows patrons to add money to suggestions", function(){
  //check that it takes away correct amount of money
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });
});
it("allows patrons to vote", function(){
  //check that it doesn't allow nonpatrons to vote
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });
});
it("allows agents to accept suggestions", function(){
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });  
});
it("allows users to transfer their money to the agent from the suggestion", function(){
  //
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });
});
it("finalizes suggestions once votes have reached the level necessary", function(){
  //check regular and general suggestion
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });
});
it("allows users to get their money back after the deadline", function(){
  //check that users can't get money back before
  var token;
  return Token.deployed().then(function(instance){
    token = instance;
  });
});


});
