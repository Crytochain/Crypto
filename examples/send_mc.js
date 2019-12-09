/*
 * Generate a transaction for mc transfer
 * in the MOAC test network
 * for testing MOAC wallet server
 * Test conditions:
 * 1. a pair of address/private key for testing, address need to have some balances.
 *    need to update the transaction nonce after each TX.
 * 2. an address to send to.
 * 
*/
//library used to compare two results.
var chai = require('chai');
var assert = chai.assert;

//libraries to generate the Tx

//MOAC chain3 lib
var Chain3 = require('../packages/chain3');

var chain3 = new Chain3();


//Set up the server to the MOAC node
//https://gateway.moac.io/
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
// chain3.setProvider(new chain3.providers.HttpProvider('Http://gateway.moac.io/testnet'));//use Testnet
// chain3.setProvider(new chain3.providers.HttpProvider('Http://gateway.moac.io/mainnet'));//use Mainnet

//The sign of the transaction requires the correct network id
var networkid = chain3.mc.net.getId();//version.network;
chain3.mc.net.getId().then(function(inId){
console.log("Network id:", inId);});

chain3.mc.net.isListening()

//test accounts
//Need to add the addr and private key
var taccts = [{
  "addr": "", 
  "key": ""//put the private key here
},{
  "addr": "", 
  "key": ""
}];


/*
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function sendTx(src, des, chainid, value){

// Get the src account count to generate the transaction
chain3.mc.getTransactionCount(src["addr"]).then(
  txcount => {

    var rawTx = {
      from: src.addr,
      nonce: chain3.utils.numberToHex(txcount),
      // 1 gwei
      gasPrice: chain3.utils.numberToHex(400000000),
      gas: chain3.utils.numberToHex(5000000),
      to: des.addr, 
      value: chain3.utils.numberToHex(15000000000), 
      shardingFlag: 0,
      data: '0x00',
      chainId: chainid
    }

    
    // chain3.mc.accounts.signTransaction(src["key"]).then(
    chain3.mc.accounts.signTransaction(rawTx, src["key"]).then( 
      value => {
        
        console.log("signed:", value);
        chain3.mc.sendSignedTransaction(value.rawTransaction)
        .once('transactionHash', function(hash){ console.log("Get returned:",hash); });
      }, 
      reason => { console.error("Error with:", reason);});

  },
  reason => { console.error("Error with:", reason);});

}


//Call the function, note the input value is in 'mc'
var src = taccts[0];
var des = taccts[1];

//Send the vaue in mc
//1 mc = 1e+18 Sha
//1 xiao = 1e+9 Xiao

//The sign of the transaction requires the correct network id
// var networkid = chain3.version.network;
// console.log("This TX is on network ", networkid);

var networkid = chain3.mc.net.getId();//version.network;
chain3.mc.net.getId().then(function(inId){
console.log("This TX is on network:", inId);
sendTx(src, des, inId, 0.001);
});


return;



