var Chain3 = require('../index.js');
var chain3 = new Chain3();// external file holds test data
var ABIs = require('./mcABIs');

//local debug network
chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

var viaAddress = "0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9";
var microchainAddress='0x57b7b8225bcb5d4c6c5abbe2e44fa67998cfa791';
var srcacct = "0xa8863fc8ce3816411378685223c03daae9770ebb";
var networkid = 106;

if(!chain3.isConnected()){
    console.log("Chain3 RPC is not connected");
    return;
}

//Load the contract ABI, must be fixed types, otherwise
var mcabi = ABIs.astABI;//load in the MicroChain ABI from external file
//var mcCode = '';// load the binary code, only to use for deploy the dappbase

// Create the MicroChain Object with abi
var mctest = chain3.microchain(JSON.parse(mcabi));

// Need to setup the mctest.setVnodeAddress(viaAddress);
// This enables the MICROCHAIN objec, which is a Global contract on the MotherChain

var mchain=mctest.at(microchainAddress);

//Test subchain methods
console.log("nodeCount:", mchain.nodeCount().toString());
console.log("nodePerformance:", mchain.nodePerformance(scs[0]));