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

//Load the contract ABI
var tokenContract=chain3.mc.contract(JSON.parse(tokenabi));

//Testnetwork token, networkid = 101
var tokenaddress='0xf2f4eec6c2adfcf780aae828de0b25f86506ffae';

//Load the contract methods 
var tcalls=tokenContract.at(tokenaddress);

//check the balance
var totalBal = 0;

//test accounts
//Need to add the addr and private key for your own ERC20 tokens
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
    for (var acctNum =0; acctNum < 3; acctNum ++){
        var acct = chain3.mc.accounts[acctNum];

        //Call the contract to check the balance of the account
        var acctBal = tcalls.balanceOf(acct);
        totalBal += parseFloat(acctBal);
        console.log("  mc.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal);
    }
    console.log("  Total balance: " + totalBal);

    var src = taccts[0].addr;
    var des = taccts[1].addr;

    //var strData = '';
    var srcVal = tcalls.balanceOf(src);
    var desVal = tcalls.balanceOf(des);
    var amt = 100000000000000000000;//amout in erc20 token "m02"
    
    console.log(" Transfer from:\n", src, "\n to \n", des);
    var tcalldata = tcalls.transfer.getData(des, 100000);
    console.log("\n Tcalldata:", tcalldata);

    let gasEstimate = chain3.mc.estimateGas({data: tcalldata});

    gasEstimate = 400000;

    //The sign of the transaction requires the correct network id
    var networkid = chain3.version.network;
    console.log("On network:", networkid);

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
      gasPrice: chain3.intToHex(400000000),
      gasLimit: chain3.intToHex(gasValue),
      value: '0x', 
      data: inByteCode,
      chainId: chain3.intToHex(inchainID)
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

    console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
    });

}


