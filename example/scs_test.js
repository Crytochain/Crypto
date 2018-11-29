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


// This JSON list the microChain running on the SCS server
// and the info
mlist = chain3.scs.getMicroChainList();
console.log("SCS MicroChain List:", mlist);
mcAddress=mlist[0];
console.log("SCS state:", chain3.scs.getDappState(mcAddress));
console.log("MC info:", chain3.scs.getMicroChainInfo(mcAddress));

console.log("SCS blockNumber:", chain3.scs.getBlockNumber(mcAddress));
console.log("SCS block 1:", chain3.scs.getBlock(mcAddress, '0x1'));
console.log("SCS blockList 1 - 3:", chain3.scs.getBlockList(mcAddress, 1, 3));

return;

//The following commands work for MicroChain
rec="0x953cd436f2838b74492b6e926dec4fe2196c8b14b1529017506979649723f35e";
tAddress="0xAC99cC5b00f41FC772AA0ebE33Ac03D94Bc31444";
console.log("SCS nonce of:", tAddress, " is ", chain3.scs.getNonce(mcAddress,tAddress));
console.log("SCS state:", chain3.scs.getTransactionReceipt(mcAddress, rec));

mcAddress="0xd548915495778d4e5db352fe7ed53069ba95fb80";//MicroChain address
tAddress = "0xa8863fc8ce3816411378685223c03daae9770ebb";//test account address

console.log("SCS state:", chain3.scs.getDappState(mcAddress));

console.log("SCS blockNumber:", chain3.scs.getBlockNumber(mcAddress));
console.log("SCS nonce of:", tAddress, " is ", chain3.scs.getNonce(mcAddress,tAddress));


console.log("SCS ID:", chain3.scs.getSCSId());

console.log("SCS MicroChain List:", chain3.scs.getMicroChainList());
return;
console.log("SCS balance:", chain3.scs.getBalance(mcAddress,tAddress));

return;


