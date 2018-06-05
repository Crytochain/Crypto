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

//Display block 0 info
var info = chain3.mc.getBlock(0);
console.log(info);


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

