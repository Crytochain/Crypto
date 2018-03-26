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
var tokenaddress='0x0a674edac2ccd47ae2a3197ea3163aa81087fbd1';

//Load the contract
var tokenContract=chain3.mc.contract(JSON.parse(tokenabi));

//Load the contract methods 
var tcalls=tokenContract.at(tokenaddress);

//check the balance
var totalBal = 0;

//Connect the local MOAC node through HTTP 
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

if ( chain3.isConnected() ){
    console.log("RPC connected, check token balance");

    //Check all the balances in the node
    for (var acctNum in chain3.mc.accounts) {
        var acct = chain3.mc.accounts[acctNum];

        //Call the contract to check the balance of the account
        var acctBal = tcalls.balanceOf(acct);
        totalBal += parseFloat(acctBal);
        console.log("  mc.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal);
    }
    console.log("  Total balance: " + totalBal);

  
    //Test the transfer to the ERC20 token
    var src = chain3.mc.accounts[0];
    var des = chain3.mc.accounts[1];
    //var amt = leftPad(chain3.toHex(chain3.toSha(amount)).slice(2).toString(16),64,0);
    //var strData = '';
    var srcVal = tcalls.balanceOf(src);
    var desVal = tcalls.balanceOf(des);
    var amt = 1.0;//amout in "mc"
    
    console.log("Transfer from:]\n", src, "\n to \n", des);
    console.log("\nBalance:", parseFloat(srcVal), " => ", amt, " to ", parseFloat(desVal));

    //To transfer the balance, need to build the TX object
    //and conver it 
//Need to wait for the function to return a value
    // sendtoken(src, 'test', des, 1.0);




    // console.log("Balance:", chain3.mc.getBalance(inadd));

    // var tokenContract = chain3.mc.contract(tokenabi);
    // tokenbal = {
    //     token: "MOAC",
    //     address: tokenaddress,
    //     value: tokenContract.at(tokenaddress).balanceOf(query.address)
    // };
    // response.balance = tokenbal;
    // console.log("token bal:", tokenbal);
    // var tokenContract = chain3.mc.contract(mctokenAbi);
//console.log("Contract:", tokenContract);
//Check the input address
// console.log("Balance:", tokenContract.at(mctokenAddress).balanceOf(hexadd));
// console.log("Balance:", tokenContract.at(mctokenAddress).balanceOf(inadd));
//test on the contract;

}else
    console.log("RPC not connected!");
return;
/*
 * A simple function to send a contract ERC20 token 
*/
function sendtoken(src, passwd, tgtaddr, amount) {

    chain3.personal.unlockAccount(src, passwd, 0);
    tcalls.transfer(tgtaddr, amount)
    console.log('sending from:' +   src + ' to:' + tgtaddr  + ' amount:' + amount + ' '+tcalls.name());

}

return;

