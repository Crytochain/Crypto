#!/usr/bin/env node

/*
 * Example program to use the Chain3 RPC commands
 * to display the information about the MOAC node
 * This example requires a local running MOAC node.
 * 
*/

var Chain3 = require('../index.js');
var chain3 = new Chain3();

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));


if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}

console.log(chain3.mc.getTransactionReceipt("0xe4f09f7e1281b7919818247fb7b09f28b5beec1032ce4430131a562715475f69"));
return;
var result = chain3.mc.estimateGas({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "20465"

var txhash = "0xf1c1771204431c1c584e793b49d41586a923c370be93673aac42d66252bc8d0a";

var transaction = chain3.mc.getTransaction(txhash);
console.log(transaction);

var receipt = chain3.mc.getTransactionReceipt(txhash);
console.log(receipt);

return;
var info = chain3.mc.getBlock(0);
console.log(info);
return;
console.log("Check account balance\n=========================================\n");
var coinbase = chain3.mc.accounts[0];//coinbase;
console.log(coinbase);

var balance = chain3.mc.getBalance(coinbase);
console.log(balance.toString(10));
console.log(chain3.fromSha(balance.toString(),'mc'), 'mc');
console.log(chain3.fromSha(balance.toString(),'Gsha'), 'Gsha');

var value = chain3.fromSha('21000000000000', 'Gsha');
console.log(value);

console.log("Display network info\n=========================================\n");
console.log(chain3.version.network);
console.log(chain3.version.moac);
console.log(chain3.version.api);
console.log(chain3.version.node);

chain3.version.getMoac(function(err, res) {
        if (!err){
            
            console.log("Succeed!: ", res);
            return res;
        }else{
            console.log("Chain3 error:", err.message);
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }
    
    // console.log("Get response from MOAC node in the feedback function!")
 res.send(response);
});

chain3.version.getNode(function(err, res) {
        if (!err){
            
            console.log("Succeed!: ", res);
            return res;
        }else{
            console.log("Chain3 error:", err.message);
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }
    
    // console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
});

chain3.version.getMoac(function(err, res) {
        if (!err){
            
            console.log("Succeed!: ", res);
            return res;
        }else{
            console.log("Chain3 error:", err.message);
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }
    
    // console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
});

chain3.version.getNetwork(function(err, res) {
        if (!err){
            
            console.log("Succeed!: ", res);
            return res;
        }else{
            console.log("Chain3 error:", err.message);
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }
    
    // console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
});


console.log("is mining?", chain3.mc.mining);


var accts = chain3.mc.accounts;
console.log("Total accounts:", accts.length);

return;

