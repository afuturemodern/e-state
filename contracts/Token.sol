pragma solidity ^0.4.21;

interface ERC20 {
    function transferFrom(address _from, address _to, uint _value) external returns (bool);
    function approve(address _spender, uint _value) external returns (bool);
    function allowance(address _owner, address _spender) external constant returns (uint);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

interface ERC223 {
    function transfer(address _to, uint _value, bytes _data) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint value, bytes indexed data);
}

contract Ownable {
    address public owner;
    //function Ownable() {
    constructor() public{
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function transferOwnership(address newOwner) onlyOwner public {
      if (newOwner != address(0)){
        owner = newOwner;
      }
    }
}

contract ERC223ReceivingContract {

    struct TKN {
        address sender;
        uint value;
        bytes data;
        bytes4 sig;
}
    function tokenFallback(address _from, uint _value, bytes _data) public pure{
      TKN memory tkn;
      tkn.sender = _from;
      tkn.value = _value;
      tkn.data = _data;
      uint32 u = uint32(_data[3]) + (uint32(_data[2]) << 8) + (uint32(_data[1]) << 16) + (uint32(_data[0]) << 24);
      tkn.sig = bytes4(u);
      
      /* tkn variable is analogue of msg variable of Ether transaction
      *  tkn.sender is person who initiated this token transaction   (analogue of msg.sender)
      *  tkn.value the number of tokens that were sent   (analogue of msg.value)
      *  tkn.data is data of token transaction   (analogue of msg.data)
      *  tkn.sig is 4 bytes signature of function
      *  if data of token transaction is a function execution
      */
	}
    
}



contract Token {
    string internal _symbol;
    string internal _name;
    uint8 internal _decimals;
    uint internal _totalSupply;
    mapping (address => uint) internal _balanceOf;
    mapping (address => mapping (address => uint)) internal _allowances;

    constructor(string symbol, string name, uint8 decimals, uint totalSupply) public {
        _symbol = symbol;
        _name = name;
        _decimals = decimals;
        _totalSupply = totalSupply;
    }

    function name() public constant returns (string) {
        return _name;
    }

    function symbol() public constant returns (string) {
        return _symbol;
    }

    function decimals() public constant returns (uint8) {
        return _decimals;
    }

    function totalSupply() public constant returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address _addr) public constant returns (uint);
    function transfer(address _to, uint _value) external returns (bool);
    event Transfer(address indexed _from, address indexed _to, uint _value);
}

library SafeMath {
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return c;
  }

  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    assert(b <= a);
    return a - b;
  }

  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    assert(c >= a);
    return c;
  }
}

contract ERC721 {
   // ERC20 compatible functions
   using SafeMath for uint;
   string internal __name = "Decla Property Token";
   function name() public constant returns (string _name){
        return __name;
   }
   string internal __symbol = "DPT"; 
   function symbol() public constant returns (string _symbol){
        return __symbol;
   }
   uint internal __totalSupply;
   function totalSupply() public constant returns (uint256 _totalSupply){
        return __totalSupply;
   }
   mapping(address => uint) public balances;
   function balanceOf(address _owner) public constant returns (uint balance){
        return balances[_owner];
   }
   // Functions that define ownership
   mapping(uint256 => address) public tokenOwners;
   mapping(uint256 => bool) public tokenExists;
   //mapping(uint256 => mapping(uint256=>address)) public ownerHistory;
   mapping(address => mapping(address => uint256)) public allowed;
   mapping(address => mapping(uint256 => uint256)) public ownerTokens;
   mapping(uint256 => string) public tokenLinks;
   function removeFromTokenList(address _owner, uint256 _tokenId) internal {
        uint256 i = 0;
        for(i = 0; ownerTokens[_owner][i] != _tokenId; i++){
        }
        ownerTokens[_owner][i+1] = 0;
        //ownerTokens[_owner][_tokenId] = 0;
   }
   function addToTokenList(address _owner, uint256 _tokenId) internal {
        ownerTokens[_owner][balances[_owner]+1] = _tokenId;
   }
   function ownerOf(uint256 _tokenId) public constant returns (address owner){
        require(tokenExists[_tokenId]);
        return tokenOwners[_tokenId];
   }
   function approve(address _to, uint256 _tokenId) public{
        require(msg.sender == ownerOf(_tokenId));
        require(msg.sender != _to);

        allowed[msg.sender][_to] = _tokenId; //this is iffy
        emit Approval(msg.sender, _to, _tokenId);
   }
   function takeOwnership(uint256 _tokenId) public{
        require(tokenExists[_tokenId]);
        address oldOwner = ownerOf(_tokenId);
        address newOwner = msg.sender;

        require(newOwner != oldOwner);
        require(allowed[oldOwner][newOwner] == _tokenId);

        balances[oldOwner] = balances[oldOwner].sub(1);
        tokenOwners[_tokenId] = newOwner;
        removeFromTokenList(oldOwner, _tokenId);
        addToTokenList(newOwner, _tokenId);

        balances[newOwner] = balances[newOwner].add(1);
        emit Transfer(oldOwner, newOwner, _tokenId);
   }
   function transfer(address _to, uint256 _tokenId) public{
        address currentOwner = msg.sender;
        address newOwner = _to;

        require(tokenExists[_tokenId]);
        require(currentOwner != newOwner);
        require(newOwner != address(0));
        removeFromTokenList(currentOwner, _tokenId);
        addToTokenList(newOwner, _tokenId);

        balances[currentOwner] = balances[currentOwner].sub(1);
        tokenOwners[_tokenId] = newOwner;


        balances[newOwner] = balances[newOwner].add(1);
        emit Transfer(currentOwner, newOwner, _tokenId);

   }
   function tokenOfOwnerByIndex(address _owner, uint256 _index) public constant returns (uint tokenId){
        return ownerTokens[_owner][_index];
   }
   // Token metadata
   function tokenMetadata(uint256 _tokenId) public constant returns (string infoUrl){
        return tokenLinks[_tokenId];
   }
   // Events
   event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
   event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
}
contract AssetToken is ERC721, Ownable {
    using SafeMath for uint;
    DeclaToken public dec;
    address public decAddress;
    constructor(address _decAddress) public{
        decAddress = _decAddress;
        dec = DeclaToken(decAddress);
    }
    mapping(uint256 => bool) public rentable;
    mapping(uint256 => bool) public rentToOwnable;
    mapping(uint256 => uint256) public rentToOwnAmount;
    mapping(address => bool) public hasCred;
    mapping(uint256 => uint256) public votesFor;
    mapping (uint256 => uint256) public votesAgainst;
    
    mapping(uint256 => bool) public validated;
    mapping(uint256 => bool) public invalidated;
    mapping(uint256 => bool) public forSale;
    mapping(uint256 => uint256) public tokenPrice;
    
    mapping(address => uint) public tokenValidations;
    //todo make rent to own functionality and decentralized autonomous governance


    uint256 reqd_erc223_amount = 10;
    uint256 reqd_votes_amount = 5;
    uint256 credThreshold = 5;
    uint256 reqd_votes_against = 200;
    mapping(uint256 => string) public ipfsHash;
    mapping(uint256 => string) public name_t;
    mapping(uint256 => string) public physaddr;
    struct lease_requester{
        bool is_requester;
        uint256 amount;
        uint256 late_fee;
    }
    mapping(uint256 => mapping(address => lease_requester)) public lease_requesters;
    struct renter{
        bool is_renter;
        uint256 amount;
        uint256 late_fee;
        uint256 total_ever_paid;
        uint256 time_due;
        bool paid;
    }
    mapping(uint256 => mapping(address => renter)) public renters;
    function show_name(uint256 _tokenId) public constant returns(string){
        return name_t[_tokenId];
    }
    function show_physaddr(uint256 _tokenId) public constant returns(string){
        return physaddr[_tokenId];
    }
    function show_ipfsHash(uint256 _tokenId) public constant returns(string){
        return ipfsHash[_tokenId];
    }
    function show_price(uint256 _tokenId) public constant returns (uint){
        return tokenPrice[_tokenId];
    }
    function show_cred(address _entity) public constant returns (bool){
        return hasCred[_entity];
    }
    function show_votes_for(uint256 _tokenId) public constant returns (uint256){
        return votesFor[_tokenId];
    }
    function show_votes_against(uint256 _tokenId) public constant returns (uint256){
        return votesAgainst[_tokenId];
    }
    function show_validated(uint256 _tokenId) public constant returns (bool){
        return validated[_tokenId];
    }
    function show_invalidated(uint256 _tokenId) public constant returns (bool){
        return invalidated[_tokenId];
    }
    function show_for_sale(uint256 _tokenId) public constant returns (bool){
        return forSale[_tokenId];
    }
    function CreateAssetToken(string _name_t, string _physaddr, string _link) public returns (bool){
        require(dec.balanceOf(msg.sender) > reqd_erc223_amount);
        dec.lock_by_contract(msg.sender, reqd_erc223_amount);
        __totalSupply.add(1);
        addToTokenList(msg.sender, __totalSupply.sub(1));
        balances[owner].add(1);
        tokenOwners[__totalSupply.sub(1)] = msg.sender;
        tokenExists[__totalSupply.sub(1)] = true;
        name_t[__totalSupply.sub(1)] = _name_t;
        physaddr[__totalSupply.sub(1)] = _physaddr;
        tokenLinks[__totalSupply.sub(1)] = _link;
        emit CreateToken(msg.sender, __totalSupply.sub(1));
        return true;
    }
    function UpdateTokenData(uint256 _tokenId, string _ipfsHash) public returns (bool){
        require(tokenOwners[_tokenId] == msg.sender);
        tokenLinks[_tokenId] = _ipfsHash;
        ipfsHash[_tokenId] = _ipfsHash;
    }
    function ChangeName(uint256 _tokenId, string _name_t) public returns (bool){
        require(tokenOwners[_tokenId] == msg.sender);
        require(tokenExists[_tokenId]);
        name_t[_tokenId] = _name_t;
        return true;
    }
    function ChangePhysAddr(uint256 _tokenId, string _physaddr) public returns (bool){
        require(tokenOwners[_tokenId] == msg.sender);
        require(tokenExists[_tokenId]);
        physaddr[_tokenId] = _physaddr;
        return true;
    }
    function MakeRentable(uint256 _tokenId) public returns (bool){
        require(msg.sender == tokenOwners[_tokenId]);
        require(validated[_tokenId]);
        require(!invalidated[_tokenId]);
        rentable[_tokenId] = true;
    }
    function MakeNonRentable(uint256 _tokenId) public returns (bool){
        require(msg.sender == tokenOwners[_tokenId]);
        rentable[_tokenId] = false;
    }
    function MakeRentToOwnable(uint256 _tokenId, uint256 _rentToOwnAmount) public returns (bool){
        require(msg.sender == tokenOwners[_tokenId]);
        require(validated[_tokenId]);
        require(!invalidated[_tokenId]);
        rentToOwnable[_tokenId] = true;
        rentToOwnAmount[_tokenId] = _rentToOwnAmount;
    }
    function ChangeRentToOwnAmount(uint256 _tokenId, uint256 _rentToOwnAmount) public returns (bool){
        require(msg.sender == tokenOwners[_tokenId]);
        rentToOwnAmount[_tokenId] = _rentToOwnAmount;
    }
    function RequestLease(uint256 _tokenId, uint256 _price, uint256 _late_fee) public returns (bool){
        require(rentable[_tokenId]);
        lease_requesters[_tokenId][msg.sender] = lease_requester(true,_price, _late_fee);
        return true;
    }
    function CancelLeaseRequest(uint256 _tokenId) public returns (bool){
        require(rentable[_tokenId]);
        lease_requesters[_tokenId][msg.sender] = lease_requester(false, 0, 0);
        return true;
    }
    function RentTo(uint256 _tokenId, address _renter, uint256 _time_due) public returns(bool){
        require(msg.sender == tokenOwners[_tokenId]);
        require(rentable[_tokenId]);
        require(lease_requesters[_tokenId][_renter].is_requester == true);
        renters[_tokenId][_renter] = renter(true,lease_requesters[_tokenId][_renter].amount, lease_requesters[_tokenId][_renter].late_fee, 0, _time_due, false);
        emit RentTo_(_tokenId, _renter, lease_requesters[_tokenId][_renter].amount);
        return true;
    }
    function PayRent(uint256 _tokenId) public returns (bool){
        require(rentable[_tokenId]);
        require(renters[_tokenId][msg.sender].is_renter == true);
        require(renters[_tokenId][msg.sender].paid == false);
        address _seller = tokenOwners[_tokenId];
        if(now < renters[_tokenId][msg.sender].time_due){
            require(dec.balanceOf(msg.sender) >= renters[_tokenId][msg.sender].amount);
            dec.transferByContract(msg.sender, tokenOwners[_tokenId], renters[_tokenId][msg.sender].amount);
            renters[_tokenId][msg.sender].total_ever_paid = renters[_tokenId][msg.sender].total_ever_paid.add(renters[_tokenId][msg.sender].amount);
            renters[_tokenId][msg.sender].paid = true;
            emit PayRent_(_tokenId, msg.sender, renters[_tokenId][msg.sender].amount);
            if(rentToOwnable[_tokenId]){
                if(renters[_tokenId][msg.sender].total_ever_paid >= rentToOwnAmount[_tokenId]){
                    tokenOwners[_tokenId] = msg.sender;
                    balances[msg.sender] = balances[msg.sender].add(1);
                    forSale[_tokenId] = false;
                    rentToOwnable[_tokenId] = false;
                    balances[_seller] = balances[_seller].sub(1);
                    removeFromTokenList(_seller, _tokenId);
                    addToTokenList(msg.sender, _tokenId);
                    emit RentToOwnPossess(_tokenId, msg.sender);
                    emit Transfer(_seller, msg.sender, _tokenId);
                }
            }
        } else {
            require(dec.balanceOf(msg.sender) >= renters[_tokenId][msg.sender].amount.add(renters[_tokenId][msg.sender].late_fee));
            dec.transferByContract(msg.sender, tokenOwners[_tokenId], renters[_tokenId][msg.sender].amount.add(renters[_tokenId][msg.sender].late_fee));
            renters[_tokenId][msg.sender].paid = true;
            renters[_tokenId][msg.sender].total_ever_paid = renters[_tokenId][msg.sender].total_ever_paid.add(renters[_tokenId][msg.sender].amount.add(renters[_tokenId][msg.sender].late_fee));
            emit PayRent_(_tokenId, msg.sender, renters[_tokenId][msg.sender].amount);
            if(rentToOwnable[_tokenId]){
                if(renters[_tokenId][msg.sender].total_ever_paid >= rentToOwnAmount[_tokenId]){
                    tokenOwners[_tokenId] = msg.sender;
                    balances[msg.sender] = balances[msg.sender].add(1);
                    forSale[_tokenId] = false;
                    rentToOwnable[_tokenId] = false;
                    balances[_seller] = balances[_seller].sub(1);
                    removeFromTokenList(_seller, _tokenId);
                    addToTokenList(msg.sender, _tokenId);
                    emit RentToOwnPossess(_tokenId, msg.sender);
                    emit Transfer(_seller, msg.sender, _tokenId);
                }
            }
        }

    }

    function MakeNonRentToOwnable(uint256 _tokenId) public returns (bool){
        require(msg.sender == tokenOwners[_tokenId]);
        rentToOwnable[_tokenId] = false;
    }
    function GiveCredO(address _recipient) onlyOwner public{
        hasCred[_recipient] = true;
        emit CredGiven(_recipient);
    }
    function GrantCred(address _recipient) internal{
        hasCred[_recipient] = true;
        emit CredGiven(_recipient);
    }
    function RevokeCred(address _recipient) internal{
        hasCred[_recipient] = false;
        emit CredLost(_recipient);
    }
    function VoteAssetToken(uint256 _tokenId) public{//function to vote for validity of token/owner
        require(hasCred[msg.sender]);
        require(tokenExists[_tokenId]);
        votesFor[_tokenId] = votesFor[_tokenId].add(1);
        if(votesFor[_tokenId] >= reqd_votes_amount){
            ValidateAssetToken(_tokenId);
        }
        emit VoteToken(_tokenId, msg.sender);

    }
    function ValidateAssetToken(uint256 _tokenId) internal{
        validated[_tokenId] = true;
        tokenValidations[tokenOwners[_tokenId]] = tokenValidations[tokenOwners[_tokenId]].add(1);
        if(tokenValidations[tokenOwners[_tokenId]] >= credThreshold){
            GrantCred(tokenOwners[_tokenId]);
        }
        emit ValidateToken(_tokenId, tokenOwners[_tokenId]);
    }
    function InvalidateAssetToken(uint256 _tokenId) internal{
        validated[_tokenId] = false;
        invalidated[_tokenId] = true;
        tokenValidations[tokenOwners[_tokenId]] = tokenValidations[tokenOwners[_tokenId]].sub(1);
        if(tokenValidations[tokenOwners[_tokenId]] < credThreshold){
            RevokeCred(tokenOwners[_tokenId]);
        }
        emit InvalidateToken(_tokenId, tokenOwners[_tokenId]);

    }
    function ListforSale(uint256 _tokenId, uint256 _price) public returns(bool res) {
        require(msg.sender == tokenOwners[_tokenId]);
        require(validated[_tokenId]);
        require (!invalidated[_tokenId]);
        require(tokenExists[_tokenId]);
        forSale[_tokenId] = true;
        tokenPrice[_tokenId] = _price;
        emit ListToken(_tokenId, _price);
        return true; 
    }

    function DeListforSale(uint256 _tokenId) public returns (bool){
        require(msg.sender == tokenOwners[_tokenId]);
        forSale[_tokenId] = false;
        emit DeListToken(_tokenId, msg.sender);
        return true;
    }
    function BuyToken(uint256 _tokenId) public returns (bool){
        require(dec.balanceOf(msg.sender) >= tokenPrice[_tokenId]);
        require(forSale[_tokenId]);
        require(tokenExists[_tokenId]);
        address _seller = tokenOwners[_tokenId];
        dec.transferByContract(msg.sender, tokenOwners[_tokenId], tokenPrice[_tokenId]);
        tokenOwners[_tokenId] = msg.sender;
        balances[msg.sender] = balances[msg.sender].add(1);
        forSale[_tokenId] = false;
        balances[_seller] = balances[_seller].sub(1);
        removeFromTokenList(_seller, _tokenId);
        addToTokenList(msg.sender, _tokenId);
        emit AssetSale(msg.sender, _seller, _tokenId);
        emit Transfer(_seller, msg.sender, _tokenId);
        emit DeListToken(_tokenId, msg.sender);
        return true;
        
    }
    event ListToken(uint256 _tokenId, uint256 _price);
    event DeListToken(uint256 _tokenId, address _delister);
    event RentTo_(uint256 _tokenId, address _renter, uint256 amount);
    event PayRent_(uint256 _tokenId, address _renter, uint256 amount);
    event RentToOwnPossess(uint256 _tokenId, address _new_owner);
    event CreateToken(address indexed _creator, uint256 _tokenId);
    event ValidateToken(uint256 _tokenId, address _owner);
    event InvalidateToken(uint256 _tokenId, address _owner);
    event VoteToken(uint256 _tokenId, address voter);
    event CredGiven(address _recipient);
    event CredLost(address _recipient);
    event AssetSale(address _buyer, address _seller, uint256 amount);

}
contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;
    modifier whenNotPaused() {
        require (!paused);
        _;
    }
    modifier whenPaused {
        require (paused);
        _;
    }
    function pause() onlyOwner whenNotPaused public returns (bool){
        paused = true;
        emit Pause();
        return true;
    }
    function unpause() onlyOwner whenPaused public returns (bool){
        paused = false;
        emit Unpause();
        return true;
    }
}

contract DeclaToken is Token("DCT", "Decla Token", 18, 300000000000000000000000000), ERC20, ERC223, Pausable {

    address public icoContract;
    address public assetContract;
    using SafeMath for uint;
    mapping(address => uint256) LockedTokens;
    
    constructor() public {
        _balanceOf[msg.sender] = _totalSupply;
    }
    event Lock(address indexed locker, uint256 value);
    event Unlock(address indexed locker, uint256 value);
    event Burn(address indexed burner, uint256 value);
    function totalSupply() public constant returns (uint) {
        return _totalSupply;
    }

    function balanceOf(address _addr) public constant returns (uint) {
        return _balanceOf[_addr];
    }

    modifier onlyPayloadSize(uint size) {
        require(msg.data.length >= size + 4) ;
      _;
    }

    function transfer(address _to, uint _value) whenNotPaused onlyPayloadSize(2 * 32) external returns (bool) {
        if (_value > 0 &&
            _value <= _balanceOf[msg.sender] &&
            !isContract(_to)) {
            _balanceOf[msg.sender] = _balanceOf[msg.sender].sub(_value);
            _balanceOf[_to] = _balanceOf[_to].add(_value);
            emit Transfer(msg.sender, _to, _value);
            return true;
        }
        return false;
    }

    function burn(uint256 _value) public {
        _burn(msg.sender, _value);
    }
    function lock(uint256 _value) public {
        require(_value > 0);
        _lock(msg.sender, _value);
    }
    function _unlock(address _who, uint256 _value) internal{
        require(_value <= LockedTokens[_who]);
        require(_value > 0);
        LockedTokens[_who] = LockedTokens[_who].sub(_value);
        _balanceOf[_who] = _balanceOf[_who].add(_value);
        emit Unlock(_who, _value);
    }
    function lock_by_contract(address _locker,uint256 _value) public {
        require(msg.sender == assetContract);
        require(_value > 0);
        _lock(_locker, _value);
    }
    function unlock_by_contract(address _locker, uint256 _value) public{
        require(msg.sender == assetContract);
        require(_value > 0);
        _unlock(_locker, _value);
    }
    function _lock(address _who, uint256 _value) internal {
        require(_value > 0);
        require(_value <= _balanceOf[_who]);
        _balanceOf[_who] = _balanceOf[_who].sub(_value);
        LockedTokens[_who] = LockedTokens[_who].add(_value);
        emit Lock(_who, _value);
    }
    function _burn(address _who, uint256 _value) internal {
        require(_value <= _balanceOf[_who]);

        _balanceOf[_who] = _balanceOf[_who].sub(_value);
        _totalSupply = _totalSupply.sub(_value);
        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value);
    }

    function transfer(address _to, uint _value, bytes _data) whenNotPaused onlyPayloadSize(2 * 32) external returns (bool) {
        if (_value > 0 &&
            _value <= _balanceOf[msg.sender] &&
            isContract(_to)) {
            _balanceOf[msg.sender] = _balanceOf[msg.sender].sub(_value);
            _balanceOf[_to] = _balanceOf[_to].add(_value);
            ERC223ReceivingContract _contract = ERC223ReceivingContract(_to);
            _contract.tokenFallback(msg.sender, _value, _data);
            emit Transfer(msg.sender, _to, _value, _data);
            return true;
        }
        return false;
    }

    function isContract(address _addr) private constant returns (bool) {
        uint codeSize;
        assembly {
            codeSize := extcodesize(_addr)
        }
        return codeSize > 0;
    }

    function transferFrom(address _from, address _to, uint _value) whenNotPaused onlyPayloadSize(2 * 32) external returns (bool) {
        if (_allowances[_from][msg.sender] > 0 &&
            _value > 0 &&
            _allowances[_from][msg.sender] >= _value &&
            _balanceOf[_from] >= _value) {
            _balanceOf[_from] = _balanceOf[_from].sub(_value);
            _balanceOf[_to] = _balanceOf[_to].add(_value);
            _allowances[_from][msg.sender] = _allowances[_from][msg.sender].sub(_value);
            emit Transfer(_from, _to, _value);
            return true;
        }
        return false;
    }

    function approve(address _spender, uint _value) external returns (bool) {
        _allowances[msg.sender][_spender] = _allowances[msg.sender][_spender].add(_value);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public constant returns (uint) {
        return _allowances[_owner][_spender];
    }

    function setIcoContract(address _icoContract) onlyOwner public {
        if (_icoContract != address(0)) {
            icoContract = _icoContract;
        }
    }    
    function setAssetContract(address _assetContract) onlyOwner public{
        if (_assetContract != address(0)){
            assetContract = _assetContract;
        }
    }
    function transferByContract(address _spender, address _recipient, uint256 _value) public returns (bool){
        assert(_value > 0);
        require(msg.sender == assetContract);
        require(_balanceOf[_spender] >= _value);
        _balanceOf[_spender] = _balanceOf[_spender].sub(_value);
        _balanceOf[_recipient] = _balanceOf[_recipient].add(_value);
        emit Transfer(_spender, _recipient, _value);
        return true;

    }
    function sell(address _recipient, uint256 _value) whenNotPaused public returns (bool) {
        assert(_value > 0);
        require(msg.sender == icoContract);
        _balanceOf[_recipient] = _balanceOf[_recipient].add(_value);
        _totalSupply = _totalSupply.add(_value);
        emit Transfer(0x0, owner, _value);
        emit Transfer(owner, _recipient, _value);
        return true;
    }
}
// =======Crowdsale Contract Start ========
contract IcoContract is Pausable{
    using SafeMath for uint;
    DeclaToken public ico;
    uint256 public tokenCreationCap;
    uint256 public totalSupply;

    address public ethFundDeposit;
    address public icoAddress;

    uint256 public fundingStartTime;
    uint256 public fundingEndTime;
    uint256 public minContribution;

    bool public isFinalized;
    uint256 public tokenExchangeRate;

    event LogCreateICO(address from, address to, uint256 val);
 
    function CreateICO(address to, uint256 val) internal returns (bool){
        emit LogCreateICO(0x0, to, val);
        return ico.sell(to, val);
    }
    constructor(
        address _ethFundDeposit,
        address _icoAddress,
        uint256 _tokenCreationCap,
        uint256 _tokenExchangeRate,
        uint256 _fundingStartTime,
        uint256 _fundingEndTime,
        uint256 _minContribution
    ) public
    {
        ethFundDeposit = _ethFundDeposit;
        icoAddress = _icoAddress;
        tokenCreationCap = _tokenCreationCap;
        tokenExchangeRate = _tokenExchangeRate;
        fundingStartTime = _fundingStartTime;
        minContribution = _minContribution;
        fundingEndTime = _fundingEndTime;
        ico = DeclaToken(icoAddress);
        isFinalized = false;
    }

    function () payable public{
        createTokens(msg.sender, msg.value);
    }
    function createTokens(address _beneficiary, uint256 _value) internal whenNotPaused {
        require (tokenCreationCap > totalSupply);
        require (now >= fundingStartTime);
        require (now <= fundingEndTime);
        require (_value >= minContribution);
        require (!isFinalized);

        uint256 tokens = _value.mul(tokenExchangeRate);
        uint256 checkedSupply = totalSupply.add(tokens);
        if (tokenCreationCap < checkedSupply) {
            uint256 tokensToAllocate = tokenCreationCap.sub(totalSupply);
            uint256 tokensToRefund   = tokens.sub(tokensToAllocate);
            totalSupply = tokenCreationCap;
            uint256 etherToRefund = tokensToRefund / tokenExchangeRate;

            require(CreateICO(_beneficiary, tokensToAllocate));
            msg.sender.transfer(etherToRefund);

           ethFundDeposit.transfer(address(this).balance);
           return;
        }
        totalSupply = checkedSupply;
        require(CreateICO(_beneficiary, tokens));
        ethFundDeposit.transfer(address(this).balance);

    }
    function finalize() external onlyOwner {
        require (!isFinalized);
        isFinalized = true;
        ethFundDeposit.transfer(address(this).balance);
    }
    

}
