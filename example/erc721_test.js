#!/usr/bin/env node
/*
   Test the ERC721 contract interface on MOAC network.
   This test requires a running MOAC node with RPC http port open at 8545
   and the contract address and abi.
1. Connect to a local MOAC node.
2. Load the contract address and abi.
3. 
*/

// var Chain3 = require('chain3');
var Chain3 = require('../index.js');
var chain3 = new Chain3();



//Set the contract ABI and address to use
//The ABI info can be obtained using REMIX
//The address is the contract HASH after deploying the contract. 
var tokenabi='[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenIndexToOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"INITIAL_SUPPLY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"name":"owner","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_code","type":"string"},{"name":"_quality","type":"string"},{"name":"_weight","type":"string"},{"name":"_owner","type":"address"}],"name":"createToken","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_owner","type":"address"}],"name":"tokensOfOwner","outputs":[{"name":"ownerTokens","type":"uint256[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getCode","outputs":[{"name":"code","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tokenIndexToApproved","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_tokenId","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getWeight","outputs":[{"name":"weight","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_tokenId","type":"uint256"}],"name":"getQuality","outputs":[{"name":"quality","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_token","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_token","type":"uint256"}],"name":"Approval","type":"event"}]';
//testnet 101
//ERC721 GOLD TOKEN
var tokenaddress="0x66482421046c9fc3999e2d9016bd3b56c99b68cb";

// srcAccount: 0x7312f4b8a4457a36827f185325fd6b66a3f8bb8b
// Contract mined! address: 0xf4d3a1fec69009559c6f669ec47795ea8e468125 
// transactionHash: 0xefb64562a7a7525aba43d4ceda07ae0b044abc2e8aef32c02cd6743b414f0414
//Load the contract
// tokenaddress = "0xf4d3a1fec69009559c6f669ec47795ea8e468125";

//remix deploy erc721 with 123 
tokenaddress = "";

var tokenContract=chain3.mc.contract(JSON.parse(tokenabi));
//Load the contract methods 
var tcalls=tokenContract.at(tokenaddress);

//check the balance
var totalBal = 0;

//test accounts
//Need to add the addr and private key
var taccts = [{
  "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
  "key": ""
},{
  "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
  "key": ""
}];

//Connect the local MOAC node through HTTP 
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

if ( chain3.isConnected() ){

  console.log("RPC connected, check ERC721 token INFO");

  // console.log("code len:", chain3.mc.getCode(tokenaddress));
  var contractCode = chain3.mc.getCode(tokenaddress);

  if (contractCode == '0x') {
    console.log("Contract address has no data!");
    return;
  }

  //Get token Info
  console.log("Token Info\nfull name:", tcalls.name());
  console.log("   symbol:", tcalls.symbol());
  console.log("   supply:", tcalls.INITIAL_SUPPLY());

  // console.log("   supply:", tcalls.totalSupply());
  console.log("   balance:", tcalls.balanceOf(taccts[0]));
  console.log("   owner:", tcalls.ownerOf(1));


    //Display all the token balances in the accounts
    for (var acctNum in chain3.mc.accounts) {
        var acct = chain3.mc.accounts[acctNum];

        //Call the contract to check the balance of the account
        var acctBal = tcalls.balanceOf(acct);
        totalBal += parseFloat(acctBal);
        console.log("  mc.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal);
    }
    console.log("  Total balance: " + totalBal);


    var src = taccts[0].addr;//[chain3.mc.accounts[2];
    var des = "0x5b09f73d3055f1e190101f560750be47d39fa1a4";//Pangu0.8.2 testnet101

    //var strData = '';
    var srcVal = tcalls.balanceOf(src);
    var desVal = tcalls.balanceOf(des);
    var amt = 1.0;//amout in "mc"
    
    console.log(" Transfer from:\n", src, "\n to \n", des);
    var tcalldata = tcalls.transfer.getData(des, 100000);
    console.log(" Tcalldata:", tcalldata);

    let gasEstimate = chain3.mc.estimateGas({data: tcalldata});

    gasEstimate = 4000000;

    //The sign of the transaction requires the correct network id
    var networkid = chain3.version.network;
    console.log(" networ id", networkid);

    //Add some more gas on the estimate to ensure the call can be processed
    callContractMethod(taccts[0], tokenaddress, gasEstimate+100, networkid, tcalldata);


}else
    console.log("RPC not connected!");

/*
 * Call a contract with the input byteCode
 * 
*/
function callContractMethod(src, contractAddress, gasValue, inchainID, inByteCode){

    var txcount = chain3.mc.getTransactionCount(src["addr"]);
    console.log("Get tx account", txcount)
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      to: contractAddress, 
      nonce: chain3.intToHex(txcount),
      gasPrice: chain3.intToHex(400000000),//chain3.intToHex(chain3.mc.gasPrice),//chain3.intToHex(400000000),
      gasLimit: chain3.intToHex(gasValue),
      value: '0x', 
      data: inByteCode,
      chainId: inchainID,
      shardingFlag: 0 //default is global contract
    }

    console.log(rawTx);

var cmd1 = chain3.signTransaction(rawTx, src["key"]);    

console.log("\nSend signed TX:\n", cmd1);

  chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
        if (!err){
            
            console.log("Succeed!: ", hash);
            return hash;
        }else{
            console.log("Chain3 error:", err.message);
            return err.message;
        }
    
      console.log("Get response from MOAC node in the feedback function!")
    // res.send(response);
    });

}


