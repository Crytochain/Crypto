/*
 * Generate a transaction for mc transfer
 * in the MOAC network
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
// var Chain3 = require('chain3');
var Chain3 = require('../index.js');
var chain3 = new Chain3();


//test accounts
var taccts = [{
  "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
  "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
},{
  "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
  "key": "4d2a8285624bd04c2b4ceaef3a3c122f133f09923f27217bb77de87e54075a16"
}];

/*
 * value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function sendTx(src, des, value){
  // console.log("Send from ", src, "to ", des);
    var txcount = chain3.mc.getTransactionCount(src["addr"]);
    // console.log(chain3.toSha(value, 'mc'))
    // return chain3.toSha(value, 'mc')
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      nonce: chain3.intToHex(txcount),
      // 1 gwei
      gasPrice: chain3.intToHex(400000000),//chain3.intToHex(chain3.mc.gasPrice),//chain3.intToHex(400000000),
      gasLimit: chain3.intToHex(2000),
      to: des.addr, 
      value: chain3.intToHex(chain3.toSha(value, 'mc')), 
      data: '0x00',
      shardingFlag: 1
    }

    // console.log(rawTx);
    var moactx = new chain3.transaction(rawTx);

    //Should set the right network
    // console.log(chain3.version.network);
    moactx.setChainId(chain3.version.network);

    //Get the account TX list to set the raw TX command nonce value
    //Requires the private key
    var privateKey = new Buffer(src["key"], 'hex');
    moactx.sign(privateKey);

    var cmd2 = '0x' + moactx.serialize().toString('hex');

    // console.log("Send cmd:", cmd2);
    // console.log("len", cmd2.length);

    // Functions to check the signature
    // moactx.verifySignature();
    // var recover = '0x'+moactx.getSenderAddress().toString('hex');
    // console.log("Recovered address:", recover);

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
    
    console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
    });

}

/*
 * display the balance value - default is in MC, 
 * in Sha, 1 mc = 1e+18 Sha
*/
function checkBal(inadd){
  var outval = chain3.mc.getBalance(inadd);
  //check input address
  return chain3.fromSha(outval.toString(),'mc');
}


//Set up the server to the MOAC node
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));

// for (i = 0; i < taccts.length; i ++)
//   console.log("Acct[",i,"]:",taccts[i].addr, chain3.mc.getTransactionCount(taccts[i].addr), checkBal(taccts[i].addr));

//Call the function, note the input value is in 'mc'
var src = taccts[0];
var des = taccts[1];

//Send the vaue in mc
//1 mc = 1e+18 Sha
sendTx(src, des, 0.0000000000000000001);


return;



