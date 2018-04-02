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
var tokenaddress="0x2258355e41be8435408c57fbb4976cab8a0b16ca";//'0x0a674edac2ccd47ae2a3197ea3163aa81087fbd1';

//Load the contract
var tokenContract=chain3.mc.contract(JSON.parse(tokenabi));

//Load the contract methods 
var tcalls=tokenContract.at(tokenaddress);

//check the balance
var totalBal = 0;



//Connect the local MOAC node through HTTP 
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

if ( chain3.isConnected() ){
    console.log("Chain3 net:", chain3.net);
    return;
    console.log("RPC connected, check token balance");

  //Get token Info
  console.log("Token Info\nfull name:", tcalls.name());
  console.log("   symbol:", tcalls.symbol());
  console.log("   owners:", tcalls.owner());

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
//    var tacct = {
//   "addr": "0xa8863fc8Ce3816411378685223C03DAae9770ebB", 
//   "key": "262aaacc326812a19cf006b3de9c50345d7b321c6b6fa36fd0317c2b38970c3e"
// }; 

var erc20owner = {
  "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
  "key": "4d2a8285624bd04c2b4ceaef3a3c122f133f09923f27217bb77de87e54075a16"
};

    var src = erc20owner["addr"];//[chain3.mc.accounts[2];
    var des = "0x7312f4b8a4457a36827f185325fd6b66a3f8bb8b";//Pangu0.8
    //var amt = leftPad(chain3.toHex(chain3.toSha(amount)).slice(2).toString(16),64,0);
    //var strData = '';
    var srcVal = tcalls.balanceOf(src);
    var desVal = tcalls.balanceOf(des);
    var amt = 1.0;//amout in "mc"
    
    console.log("Transfer from:\n", src, "\n to \n", des);
    // console.log("\nBalance:", parseFloat(srcVal), " => ", amt, " to ", parseFloat(desVal));
    var tcalldata = tcalls.transfer.getData(des, 10000);
    console.log("Tcalldata:", tcalldata);
let gasEstimate = chain3.mc.estimateGas({data: tcalldata});
console.log("Gas Estimate on contract:", gasEstimate);

//Add some more gas on the estimate to ensure the call can be processed
callContractMethod(erc20owner, gasEstimate+100, tcalldata);
    //build a raw TX with this info

    //To transfer the balance, need to build the TX object
    //and conver it 

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
 * Call a contract with the input byteCode
*/
function callContractMethod(src, gasValue, inByteCode){

    var txcount = chain3.mc.getTransactionCount(src["addr"]);
    console.log("Get tx account", txcount)
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      nonce: chain3.intToHex(txcount),
      gasPrice: chain3.intToHex(400000000),//chain3.intToHex(chain3.mc.gasPrice),//chain3.intToHex(400000000),
      gasLimit: chain3.intToHex(gasValue),
      value: '0x00', 
      data: inByteCode,
      shardingFlag: 0 //default is global contract
    }

    console.log(rawTx);
    var moactx = new chain3.transaction(rawTx);
    // moactx.setChainId(chain3.intToHex(1));
    // console.log(chain3.version.network);
    moactx.setChainId(chain3.version.network);
    moactx.setChainId(3);//for test net 
    console.log("moactx chainID:", moactx.getChainId())

    //Get the account TX list to set the raw TX command nonce value
    //Requires the private key

    var privateKey = new Buffer(src["key"], 'hex');
 console.log(moactx.toJSON());
    moactx.sign(privateKey);
console.log("=======After sign===ToJSON=====================");
 console.log(moactx.toJSON());

    var cmd2 = '0x' + moactx.serialize().toString('hex');
console.log("Send cmd:", cmd2);
console.log("len", cmd2.length);

moactx.verifySignature();
var recover = '0x'+moactx.getSenderAddress().toString('hex');
console.log("Recovered address:", recover);

chain3.mc.sendRawTransaction(cmd2, function(err, hash) {
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

/*
 * A simple function to send a contract ERC20 token 
*/
function sendtoken(src, passwd, tgtaddr, amount) {

    chain3.personal.unlockAccount(src, passwd, 0);
    tcalls.transfer(tgtaddr, amount)
    console.log('sending from:' +   src + ' to:' + tgtaddr  + ' amount:' + amount + ' '+tcalls.name());

}

return;

