#!/usr/bin/env node
/*
   Test the ERC20 contract interface on MOAC network.
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
var tokenabi='[{"constant":false,"inputs":[{"name":"newSellPrice","type":"uint256"},{"name":"newBuyPrice","type":"uint256"}],"name":"setPrices","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"sellPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"mintedAmount","type":"uint256"}],"name":"mintToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"}],"name":"burnFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"buyPrice","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"buy","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"frozenAccount","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"sell","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"target","type":"address"},{"name":"freeze","type":"bool"}],"name":"freezeAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialSupply","type":"uint256"},{"name":"tokenName","type":"string"},{"name":"tokenSymbol","type":"string"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"target","type":"address"},{"indexed":false,"name":"frozen","type":"bool"}],"name":"FrozenFunds","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}]';

//testnet 101
var tokenaddress="0x1d12aec505caa2b8513cdad9a13e9d4806a1b704";//0xc9909cc2d7850b41d704b668ecaf782f17746d116007a469b16595b09b36b73c

//private net 100
var 0x8725835e7e488db289e79fbce56207d5d988d0f1;//TX HASH:0x967f496fa62078148345aca0e15cd22f4b72d61ef451f0e2cf9ab28faa9fc39a
//Load the contract
var tokenContract=chain3.mc.contract(JSON.parse(tokenabi));

//Load the contract methods 
var tcalls=tokenContract.at(tokenaddress);

//check the balance
var totalBal = 0;

//test accounts
//Need to add the addr and private key
var taccts = [{
  "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
  "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
},{
  "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
  "key": "4d2a8285624bd04c2b4ceaef3a3c122f133f09923f27217bb77de87e54075a16"
}];

//Connect the local MOAC node through HTTP 
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

if ( chain3.isConnected() ){

  console.log("RPC connected, check token balance");

  // console.log("code len:", chain3.mc.getCode(tokenaddress));
  var contractCode = chain3.mc.getCode(tokenaddress);

  if (contractCode == '0x') {
    console.log("Contract address has no data!");
    return;
  }

  //Get token Info
  console.log("Token Info\nfull name:", tcalls.name());

  console.log("   symbol:", tcalls.symbol());
  console.log("   owners:", tcalls.owner());

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
    console.log(" Gas Estimate on contract:", gasEstimate);
    return;
    gasEstimate = 400000;

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
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }
    
    // console.log(response);
    console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
    });

}


