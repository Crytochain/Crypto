#!/usr/bin/env node

/*
 * Test the Chain3 JSON-RPC with SCS monitors
 * Require a running SCS server with rpc port 
 * open at localhost:8548
 * 
*/

var Chain3 = require('../index.js');
var chain3 = new Chain3();

//Create another chain3 object to link with SCS
console.log("SCS\n=========================================");
//First, test the VNODE communications with JSON 2.0 commands
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));
// Lianwen MicroChain
// http://nodesapi.moac.io/MonitorAddr/0xb178a34071b5037ec762faf1b7a5082a396caba1
// chain3.setScsProvider(new chain3.providers.HttpProvider('http://59.111.104.184:8546'));

// List the SCS server
console.log("SCS ID:", chain3.scs.getSCSId());

// List the microChain running on the SCS server
mlist = chain3.scs.getMicroChainList();
console.log("SCS MicroChain List:", mlist);

//Display the MicroChain info
mcAddress=mlist[0];
console.log("SCS state:", chain3.scs.getDappState(mcAddress));
console.log("MC info:", chain3.scs.getMicroChainInfo(mcAddress));

console.log("SCS blockNumber:", chain3.scs.getBlockNumber(mcAddress));
console.log("SCS block 1:", chain3.scs.getBlock(mcAddress, '0x1'));
console.log("SCS blockList 1 - 3:", chain3.scs.getBlockList(mcAddress, 1, 3));

//The following commands work for MicroChain
tAddress="0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B";
//display the account info
console.log("SCS nonce of:", tAddress, " is ", chain3.scs.getNonce(mcAddress,tAddress));
console.log("SCS state:", chain3.scs.getTransactionByNonce(mcAddress, tAddress, 0));
console.log("SCS nonce of:", tAddress, " is ", chain3.scs.getNonce(mcAddress,tAddress));

// Display the microchain token balance if any, this need to wused with 
// ASM or AST microchains
console.log("SCS balance:", chain3.scs.getBalance(mcAddress,tAddress));

return;


