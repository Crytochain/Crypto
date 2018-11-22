#!/usr/bin/env node

/*
 * Example program to use the Chain3 RPC commands
 * to monitor an address events in the MOAC blockchainb
 * 
*/

var Chain3 = require('../index.js');
var chain3 = new Chain3();

chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));


if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}


console.log("Check block number\n=========================================\n");
var latestBlock = chain3.mc.blockNumber;
console.log("total block:", latestBlock);
var filter = chain3.mc.filter({
  fromBlock: 0,
  toBlock: 'latest',
  address: '0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9'

});

filter.watch(function(error, result){
        if( !error )
        {
            var msg = result.blockNumber;
            console.log( msg + ":" + JSON.stringify(result.TxData))
        }
        else{
            console.log("err:" + error);
        }
  
  
});

