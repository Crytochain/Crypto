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

// external file holds test data
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
// console.log(chain3.vnode.address);
//Create another chain3 object to link with SCS

// var taccts = [{
//   "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
//   "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
//   // "key": "0xb8a9c05beeedb25df85f8d641538cbffedf67216048de9c678ee26260eb91952"
// },{
//   "addr": "0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9", 
//   "key": ""
// }];

// Display MicroChain Info on the SCS server
// mclist = chain3.scs.getMicroChainList();
// console.log("SCS MicroChain Info List:");
// for(var i = 0; i < mclist.length; i++){
//       console.log("MicroChain ", mclist[i],",state:", chain3.scs.getDappState(mclist[i])," blockNumber:", chain3.scs.getBlockNumber(mclist[i]));
//       console.log("MC balance:", chain3.scs.getMicroChainInfo(mclist[i]).balance);
//       console.log("DAPP list:", chain3.scs.getDappAddrList(mclist[i]));
// }
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
var dappBase = mcObject.getDappBase(baseabi, baseAddr);

console.log("============================================\nTest DappBase functions");
console.log("dappBase nodeList:", dappBase.getCurNodeList());


//Create a Dapp Object and test functions with it

return;
// Test public view functions


// console.log("MicroChain address:", mchain.address);

return;

// mchain.call()
var acctBal = mchain.balanceOf(acct);

// Need to load in the DappBase.sol abi and byte codes

// console.log("microchain:", mcObject);
// console.log("microchain state:",mcObject.getDappBase(microchainAddress));
var dbase = mcObject.getDappBase(microchainAddress);
// console.log("dappBase:", dbase);
console.log("enterPos:", dbase.enterPos());
console.log("===========Call DAppbase function================");
// console.log("getDappABI:", dbase.getDappABI("0xa6e4e429e48d97a3dd4309d96cabc836f3bb4283"));//Cannot handle the tuple format type
console.log("dappList:", dbase.getDappList());//Cannot handle the tuple format type
// console.log("dappState:", dbase.getDappState("0xa6e4e429e48d97a3dd4309d96cabc836f3bb4283"));
return;
console.log("===========Call DApp function================");
var dappAddr = "0x766a66cfab87270440f4287f111254483c37ebf8";
var dappAbi = '[{"constant":true,"inputs":[],"name":"getUint","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"uint2","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"addr2","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"string4","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"u1","type":"uint256"},{"name":"s1","type":"string"},{"name":"h1","type":"bytes32"},{"name":"a1","type":"address"}],"name":"addbaseValue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getHash2","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAddress","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getString2","outputs":[{"name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"string2","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"hash2","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAddress2","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"addrTups","outputs":[{"name":"uint3","type":"uint256"},{"name":"string3","type":"string"},{"name":"hash3","type":"bytes32"},{"name":"addr3","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"uint1","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"tups","outputs":[{"name":"uint3","type":"uint256"},{"name":"string3","type":"string"},{"name":"hash3","type":"bytes32"},{"name":"addr3","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getString","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getUint2","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"string1","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"addrTup","outputs":[{"name":"uint3","type":"uint256"},{"name":"string3","type":"string"},{"name":"hash3","type":"bytes32"},{"name":"addr3","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"uint4","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"hash1","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"index","type":"uint256"}],"name":"getTup","outputs":[{"components":[{"name":"uint3","type":"uint256"},{"name":"string3","type":"string"},{"name":"hash3","type":"bytes32"},{"name":"addr3","type":"address"},{"name":"uintA3","type":"uint256[]"},{"name":"stringA3","type":"string[]"},{"name":"hashA3","type":"bytes32[]"},{"name":"addrA3","type":"address[]"}],"name":"","type":"tuple"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"addr1","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTup2","outputs":[{"components":[{"name":"uint3","type":"uint256"},{"name":"string3","type":"string"},{"name":"hash3","type":"bytes32"},{"name":"addr3","type":"address"},{"name":"uintA3","type":"uint256[]"},{"name":"stringA3","type":"string[]"},{"name":"hashA3","type":"bytes32[]"},{"name":"addrA3","type":"address[]"}],"name":"","type":"tuple[]"}],"payable":false,"stateMutability":"view","type":"function"}]';

//Set the contract ABI and address to use
//The ABI info can be obtained using REMIX
//The address is the contract HASH after deploying the contract. 
//Load the contract ABI
var dappContract=chain3.mc.contract(JSON.parse(dappAbi));
//Load the contract methods 
var tcalls=dappContract.at(dappAddr);
console.log("dappAnyCall: getUint", tcalls.getUint());
return;

console.log("add FUND:", mchain.addFund(1));
return;
// var dappbase = mcObject.getDappBase();//return the dappbase object for operations
//Load the contract methods 


// Get the right nonce for the MicroChain
var nonce = chain3.scs.getNonce(microchainAddress,taccts[0].addr)
console.log("SCS nonce:", nonce);
console.log("SCS block:", chain3.scs.getBlockNumber(microchainAddress));

console.log("Contract Count Info\nget count", tcalls.getCount().toString());
return;
    var tcalldata = tcalls.incrementBy.getData(3);
    // var tcalldata = tcalls.incrementCounter.getData();
    console.log("\n Tcalldata:", tcalldata);
    // var tcalldata = tcalls.incrementCounter.getData();
    // console.log("\n Tcalldata:", tcalldata);
    // let gasEstimate = chain3.mc.estimateGas({data: tcalldata});//No need for MicroChain calls

callDappMethod(taccts[0], microchainAddress, nonce, networkid, tcalldata, viaAddress);

return;

/*
 * Call a MicroChain contract with the input byteCode
 * note the txcount should be the one from MicroChain.
 * The shardingFlag should be 1.
 * 
*/
function callChainMethod(src, microchainAddress, txcount, inchainID, inByteCode, viaAddress){

    console.log("SCS nonce", txcount)
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      to: contractAddress, 
      nonce: chain3.intToHex(txcount),
      gasPrice: chain3.intToHex(0),//30000000000
      gasLimit: chain3.intToHex(0),
      value: '0x', 
      data: inByteCode,
      chainId: chain3.intToHex(inchainID),
      shardingFlag: 1,
      via: viaAddress
    }

    console.log(rawTx);

  var cmd1 = chain3.signTransaction(rawTx, src["key"]);    

  console.log("\nSend signed TX:\n", cmd1);

  chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
        if (!err){
            
            console.log("Succeed!: ", hash);
            return hash;
        }else{
            console.log("Chain3 error:", err.message);
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }

    console.log("Get response from microChain in the feedback function!")
        // res.send(response);
    });

}
