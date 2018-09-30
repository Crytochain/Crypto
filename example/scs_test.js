#!/usr/bin/env node

/*
 * Test the Chain3 RPC commands
 * to use with SCS monitors
 * 
*/

var Chain3 = require('../index.js');
var chain3 = new Chain3();
/*
var fs = require('fs');
var stream = fs.createWriteStream("test.csv");
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));


if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}

console.log("Check VNODE account balance\n=========================================");
var coinbase = chain3.mc.accounts[0];//coinbase;
console.log(coinbase);
var balance = chain3.mc.getBalance(coinbase);
console.log(balance.toString(10));
*/
//Create another chain3 object to link with SCS
console.log("SCS\n=========================================");
var scsChain3 = new Chain3()
//First, test the VNODE communications with JSON 2.0 commands
// scsChain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8548'));
scsChain3.setProvider(new chain3.providers.HttpProvider('http://localhost:9000'));
mcAddress="0xa2168dfcae4efba6b8d6076942f7419e2045d08f";//MicroChain address

console.log("SCS MicroChain List:", scsChain3.scs.getMicroChainList());
tAddress="0x1b65cE1A393FFd5960D2ce11E7fd6fDB9e991945";//scs1 id address
console.log("SCS state:", scsChain3.scs.getDappState(mcAddress));
console.log("SCS blockNumber:", scsChain3.scs.getBlockNumber(mcAddress));
console.log("SCS nonce:", scsChain3.scs.getNonce(mcAddress,"0xa8863fc8ce3816411378685223c03daae9770ebb"));
return;
console.log("SCS ID:", scsChain3.scs.getSCSId());

console.log("SCS MicroChain List:", scsChain3.scs.getMicroChainList());

console.log("SCS balance:", scsChain3.scs.getBalance(mcAddress,tAddress));
console.log("SCS state:", scsChain3.scs.getDappState(mcAddress));
return;

console.log("SCS block:", scsChain3.scs.getBlock(mcAddress,4));

return;


