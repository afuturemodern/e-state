pragma solidity ^0.4.21;

interface ERC20 {
    function transferFrom(address _from, address _to, uint _value) public returns (bool);
    function approve(address _spender, uint _value) public returns (bool);
    function allowance(address _owner, address _spender) public constant returns (uint);
    event Approval(address indexed _owner, address indexed _spender, uint _value);
}

interface ERC223 {
    function transfer(address _to, uint _value, bytes _data) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint value, bytes indexed data);
}

contract Ownable {
    address public owner;
    function Ownable() {
        owner = msg.sender;
    }
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    function transferOwnership(address newOwner) onlyOwner {
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

    function Token(string symbol, string name, uint8 decimals, uint totalSupply) public {
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
    function transfer(address _to, uint _value) public returns (bool);
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
   function name() constant returns (string name){
        return __name;
   }
   string internal __symbol = "DPT"; 
   function symbol() constant returns (string symbol){
        return __symbol;
   }
   uint internal __totalSupply;
   function totalSupply() constant returns (uint256 totalSupply){
        return __totalSupply;
   }
   mapping(address => uint) private balances;
   function balanceOf(address _owner) constant returns (uint balance){
        return balances[_owner];
   }
   // Functions that define ownership
   mapping(uint256 => address) private tokenOwners;
   mapping(uint256 => bool) private tokenExists;
   //mapping(uint256 => mapping(uint256=>address)) public ownerHistory;
   mapping(address => mapping(address => uint256)) public allowed;
   mapping(address => mapping(uint256 => uint256)) private ownerTokens;
   mapping(uint256 => string) tokenLinks;
   function removeFromTokenList(address _owner, uint256 _tokenId) private {
        uint256 i = 0;
        for(i = 0; ownerTokens[_owner][i] != _tokenId; i++){
        }
        ownerTokens[_owner][i+1] = 0;
        //ownerTokens[_owner][_tokenId] = 0;
   }
   function addToTokenList(address _owner, uint256 _tokenId) private {
        ownerTokens[_owner][balances[_owner]+1] = _tokenId;
   }
   function ownerOf(uint256 _tokenId) constant returns (address owner){
        require(tokenExists[_tokenId]);
        return tokenOwners[_tokenId];
   }
   function approve(address _to, uint256 _tokenId){
        require(msg.sender == ownerOf(_tokenId));
        require(msg.sender != _to);

        allowed[msg.sender][_to] = _tokenId; //this is iffy
        emit Approval(msg.sender, _to, _tokenId);
   }
   function takeOwnership(uint256 _tokenId){
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
   function transfer(address _to, uint256 _tokenId){
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
   function tokenOfOwnerByIndex(address _owner, uint256 _index) constant returns (uint tokenId){
        return ownerTokens[_owner][_index];
   }
   // Token metadata
   function tokenMetadata(uint256 _tokenId) constant returns (string infoUrl){
        return tokenLinks[_tokenId];
   }
   // Events
   event Transfer(address indexed _from, address indexed _to, uint256 _tokenId);
   event Approval(address indexed _owner, address indexed _approved, uint256 _tokenId);
}
contract AssetToken is ERC721 {
    using SafeMath for uint;
    mapping(uint256 => bool) rentable;
    mapping(uint256 => bool) rentToOwnable;
    mapping(uint256 => uint256) rentToOwnAmount;
    mapping(address => bool) hasCred;

    uint256 reqd_amount = 10;
    mapping(uint256 => bytes[]) ipfsHash;
    mapping(uint256 => bytes[]) name;
    mapping(uint256 => bytes) physaddr;
    function CreateAssetToken(string name, string physaddr){
        require DeclaToken.balanceOf(msg.sender) > reqd_amount;
        DeclaToken.Lock(msg.sender, reqd_amount);
        __totalSupply.add(1)
        addToTokenList(msg.sender, __totalSupply.sub(1));
        balances[owner].add(1)
        tokenOwners[__totalSupply.sub(1)] = msg.sender;
        tokenExists[__totalSupply.sub(1)] = true;
    }

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
    function pause() onlyOwner whenNotPaused returns (bool){
        paused = true;
        emit Pause();
        return true;
    }
    function unpause() onlyOwner whenPaused returns (bool){
        paused = false;
        emit Unpause();
        return true;
    }
}

contract DeclaToken is Token("DCT", "Decla Token", 18, 300000000000000000000000000), ERC20, ERC223, Pausable {

    address public icoContract;
    using SafeMath for uint;
    mapping(address => uint256) LockedTokens;
    
    function DeclaToken() public {
        _balanceOf[msg.sender] = _totalSupply;
    }
    event Lock(address indexed locker, uint256 value);
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

    function transfer(address _to, uint _value) whenNotPaused onlyPayloadSize(2 * 32) public returns (bool) {
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
        _lock(msg.sender, _value);
    }
    function _lock(address _who, uint256 _value) internal {
        require(_value <= balances[_who]);
        balanceOf[_who] = balanceOf[_who].sub(_value);
        LockedTokens[_who] = LockedTokens[_who].add(_value);
        emit Lock(_who, _value);
    }
    function _burn(address _who, uint256 _value) internal {
        require(_value <= balances[_who]);

        _balanceOf[_who] = _balanceOf[_who].sub(_value);
        _totalSupply = _totalSupply.sub(_value)
        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value);
    }

    function transfer(address _to, uint _value, bytes _data) whenNotPaused onlyPayloadSize(2 * 32) public returns (bool) {
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

    function transferFrom(address _from, address _to, uint _value) whenNotPaused onlyPayloadSize(2 * 32) public returns (bool) {
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

    function approve(address _spender, uint _value) public returns (bool) {
        _allowances[msg.sender][_spender] = _allowances[msg.sender][_spender].add(_value);
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public constant returns (uint) {
        return _allowances[_owner][_spender];
    }

    function setIcoContract(address _icoContract) onlyOwner {
        if (_icoContract != address(0)) {
            icoContract = _icoContract;
        }
    }    

    function sell(address _recipient, uint256 _value) whenNotPaused returns (bool) {
        assert(_value > 0);
        require(msg.sender == icoContract);
        _balanceOf[_recipient] += _value;
        _totalSupply += _value;
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
        LogCreateICO(0x0, to, val);
        return ico.sell(to, val);
    }
    function IcoContract(
        address _ethFundDeposit,
        address _icoAddress,
        uint256 _tokenCreationCap,
        uint256 _tokenExchangeRate,
        uint256 _fundingStartTime,
        uint256 _fundingEndTime,
        uint256 _minContribution
    )
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

    function () payable {
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

           ethFundDeposit.transfer(this.balance);
           return;
        }
        totalSupply = checkedSupply;
        require(CreateICO(_beneficiary, tokens));
        ethFundDeposit.transfer(this.balance);

    }
    function finalize() external onlyOwner {
        require (!isFinalized);
        isFinalized = true;
        ethFundDeposit.transfer(this.balance);
    }
    

}
