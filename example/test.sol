pragma solidity ^0.4.0;

contract addab {
  uint public count;

  function add(uint a, uint b) returns(uint) {
    count++;
    return a + b;
  }

  function getCount() returns(uint){
    return count;
  }
}
