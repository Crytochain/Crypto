/*
   Test MicroChain objects on MOAC network 106.
1. Run a local MOAC node connecting with network 106;
2. Load the contract address and abi.
3. 
Requires: a running MicroChain and SCS server with rpc port open

 chain3.setScsProvider(new chain3.providers.HttpProvider('http://47.107.75.89:8547'));//test server on 101
// Lianwen MicroChain
// http://nodesapi.moac.io/MonitorAddr/0xb178a34071b5037ec762faf1b7a5082a396caba1
// chain3.setScsProvider(new chain3.providers.HttpProvider('http://59.111.104.184:8546'));
*/


var Chain3 = require('../index.js');
var chain3 = new Chain3();

// external file holds MicroChain ABI
var ABIs = require('./mcABIs');

//local debug network
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

// Set the VNODE proxy address
// var scs=["0x1b65cE1A393FFd5960D2ce11E7fd6fDB9e991945",
//          "0xecd1e094ee13d0b47b72f5c940c17bd0c7630326",
//          "0x50C15fafb95968132d1a6ee3617E99cCa1FCF059"
//         ]
        
// Note these addresses should be changed if VNODE and SCS changed
var viaAddress = "0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9";
var microchainAddress='0x57b7b8225bcb5d4c6c5abbe2e44fa67998cfa791';
var dappBaseAddress='0xa6e4e429e48d97a3dd4309d96cabc836f3bb4283';
var srcacct = "0xa8863fc8ce3816411378685223c03daae9770ebb";
var networkid = 106;

// start connecting with VNODE
if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}

// Display MicroChain Info on the SCS server
mclist = chain3.scs.getMicroChainList();
console.log("SCS MicroChain Info List:");
for(var i = 0; i < mclist.length; i++){
      console.log("MicroChain ", mclist[i],",state:", chain3.scs.getDappState(mclist[i])," blockNumber:", chain3.scs.getBlockNumber(mclist[i]));
      console.log("MC balance:", chain3.scs.getMicroChainInfo(mclist[i]).balance);
      console.log("DAPP list:", chain3.scs.getDappAddrList(mclist[i]));
}
//=======================================================
//Create a MicroChain Object and test functions
//Load the contract ABI, must be fixed types, otherwise
var mcabi = ABIs.astABI;//load in the MicroChain ABI from external file
// var mcCode = '';// load the binary code, only to use for deploy the MicroChain


// Create the MicroChain Object with abi
var mcObject = chain3.microchain(JSON.parse(mcabi));

// Need to setup the via address
mcObject.setVnodeAddress(viaAddress);

// This enables the MICROCHAIN objec, which is a Global contract on the MotherChain
var mchain=mcObject.at(microchainAddress);

//Test subchain methods
console.log("============================================\nTest MicroChain functions");
console.log("nodeCount:", mchain.nodeCount().toString());
console.log("Microchain Info:\nBALANCE:", mchain.BALANCE().toString());
console.log("via Reward:", mchain.viaReward().toString());
console.log("flush Info:", mchain.getFlushInfo().toString());
//=======================================================


//Create a DappBase Object and test functions with it
var baseabi = ABIs.dappBaseABI;//load in the MicroChain ABI from external file
// var mcCode = '';// load the binary code, only to use for deploy the MicroChain
var baseAddr = dappBaseAddress;

// Create the MicroChain DappBase Object with abi and address
var dappBase = mcObject.getDapp(microchainAddress, JSON.parse(baseabi), baseAddr);

console.log("============================================\nTest DappBase functions");
console.log("dappBase nodeList:", dappBase.getCurNodeList());


return;

