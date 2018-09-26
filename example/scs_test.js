#!/usr/bin/env node

/*
 * Test the Chain3 RPC commands
 * to use with SCS monitors
 * 
*/

var Chain3 = require('../index.js');
var chain3 = new Chain3();
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
//Create another chain3 object to link with SCS
console.log("SCS\n=========================================");
var scsChain3 = new Chain3()
//First, test the VNODE communications with JSON 2.0 commands
scsChain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8548'));

console.log("SCS ID:", scsChain3.scs.getSCSId());
// console.log("SCS ID:", chain3.scs.getDappState('0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9'));


return;

console.log("getDatadir:", chain3.scs.getDatadir());
console.log("protocolVersion:", chain3.scs.protocolVersion());
return;
if (!chain3.isConnected()){
    console.log("Chain3 RPC is not connected!");
    return;
}

//Try to send out the RPC command
// curl -X POST --data '{"jsonrpc":"2.0","method":"mc_gasPrice","params":[],"id":101}' localhost:8545
var rawTx = {"from":"0x460420a40a694e2efbc5defdb8a0a76f3134ecfb","to":"0x3de4c3b9add4f95c74adeb538537f68b7c6dccb4","value":"0x0","nonce":"0x19","gasPrice":"0x17d7840","gasLimit":"0x9c40","data":"0xa9059cbb000000000000000000000000dbc02f7819d8f88dd473974ca516afc78700d3bf00000000000000000000000000000000000000000000000564d702d38f5e0000","chainId":"101"};

var errorTx = "0xf8ac198084017d7840829c40943de4c3b9add4f95c74adeb538537f68b7c6dccb480b844a9059cbb000000000000000000000000dbc02f7819d8f88dd473974ca516afc78700d3bf00000000000000000000000000000000000000000000000564d702d38f5e0000808081eea000e66f458bf1bab4d691f1f500c5a5d884de6a9c05a0f3fa0a523e6c6dbb83afa001719cf7dcbd31d71cef6fcfb2491059194042b602fb154803749f1ac1754e97";

errorTx="0xf86f0380829c408203e894b55a404b860be17fcb5623bb4dd24e904a674b448a0110000000000000000000808081eba0ffd349f8be59a2e6d508d2715a571397a2a841f98f98b980b3957c779f5bccefa0556930a6269e4f9619859e863737d7dbf51cc2c7e6ec51c9f1a89d710bb0ea34";

var cmd1 = chain3.decodeTx(errorTx);

return;

var i = chain3.mc.iban.fromAddress('0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9');
var address = i.address();
console.log(address);
console.log(i.toString());
return;
var address = i.address();
console.log(address);
var institution = i.institution();
console.log(institution); // 'XREG'
var client = i.client();
console.log(client); // 'GAVOFYORK'
return;
var direct = i.isDirect();
console.log("direct?",direct); // false
var indirect = i.isIndirect();
console.log(indirect); // true
var checksum = i.checksum();
console.log(checksum); // "81"
return;
var valid = chain3.mc.iban.isValid("XE66MOACXREGGAVOFYORK");
console.log(valid); // true

var valid2 = chain3.mc.iban.isValid("XE76MOACXREGGAVOFYORK");
console.log(valid2); // false, cause checksum is incorrect

var i = new chain3.mc.iban("XE66MOACXREGGAVOFYORK");
var valid3 = i.isValid();
console.log(valid3); // true
return;
var i = chain3.mc.iban.createIndirect({
  institution: "XREG",
  identifier: "GAVOFYORK"
});
console.log(i.toString()); // "XE81ETHXREGGAVOFYORK"
console.log("==========");
// var i = chain3.mc.iban.fromAddress('0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9');
var i = new chain3.mc.iban("XE72P8O19KRSWXUGDY294PZ66T4ZGF89INT");
console.log(i.toString()); // 'XE72P8O19KRSWXUGDY294PZ66T4ZGF89INT

var i = chain3.mc.iban.fromBban('XE66MOACXREGGAVOFYORK');
console.log(i.toString()); // "XE71XE66MOACXREGGAVOFYORK"

return;
var txHash = chain3.mc.sendIBANTransaction('0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9', 'XE66MOACXREGGAVOFYORK', 0x100);
console.log("IBAN:",txHash);
return;
// Test with list of parameters
var types = ['int','string'];
var args = [100, '4000'];

var dataHex = '0x' + chain3.encodeParams(types, args);
console.log("encoded params:", dataHex);
return;
var result = chain3.mc.estimateGas({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "20465"
return;

var txhash = "0x7f846575f1dc0d1921028ccf122ffdaea1e7150b2b90330086fe167624bc6209";

var transaction = chain3.mc.getTransaction(txhash);
console.log(transaction);
return;
console.log("Check block number\n=========================================\n");
// console.log(chain3.mc.getBlock(104180));
var number = chain3.mc.getUncle("0xddfb8508bff841242099e640efe59f5e5252be1a60fa701d333e1a8bfdee6263");
console.log(number); 
return;
console.log(chain3.mc.getBlockTransactionCount('earliest'));
return;
console.log("current block:",chain3.mc.blockNumber);
var balance = chain3.mc.getBalance("0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9");
console.log("bal",balance); // instanceof BigNumber
console.log(balance.toString(10)); // '1000000000000'
console.log(balance.toNumber()); // 1000000000000
var state = chain3.mc.getStorageAt("0x1d12aec505caa2b8513cdad9a13e9d4806a1b704", 104180);

console.log("state:",state); // "0x03"
var add="0x1d12aec505caa2b8513cdad9a13e9d4806a1b704";
var code = chain3.mc.getCode("0x1d12aec505caa2b8513cdad9a13e9d4806a1b704");
return;
console.log("code:", code); 
return;



console.log(number); // 2744
var defaultBlock = chain3.mc.defaultBlock;
console.log(defaultBlock); // 'latest'
var mining = chain3.mc.mining;
console.log("Is mining?", mining); // true or false
var gasPrice = chain3.mc.gasPrice;
console.log(gasPrice.toString(10)); // "10000000000000"
return;
var balance = chain3.mc.getBalance("0xd814f2ac2c4ca49b33066582e4e97ebae02f2ab9");
console.log("Bal:", balance);
console.log(balance.plus(21).toString(10)); // toString(10) converts it to a number string
// "131242344353464564564574574567477"

// set the default block
chain3.mc.defaultBlock = 1000;
console.log(chain3.mc.defaultBlock);
var sync = chain3.mc.syncing;
console.log(sync);
chain3.mc.isSyncing(function(error, sync){
    if(!error) {
        console.log("No error");
        // stop all app activity
        if(sync === true) {
           // we use `true`, so it stops all filters, but not the chain3.mc.syncing polling
           chain3.reset(true);
        
        // show sync info
        } else if(sync) {
           console.log(sync.currentBlock);
        
        // re-gain app operation
        } else {
            // run your app init function...
            console.log("not synce!");
            return;
        }
    }
});
return;
var latestBlock = chain3.mc.blockNumber;
console.log("total block:", latestBlock);
console.log(chain3.net.listening);
console.log(chain3.net.peerCount);
var defaultAccount = chain3.mc.defaultAccount;
console.log(defaultAccount); // ''

// set the default block
chain3.mc.defaultAccount = '0x8888f1f195afa192cfee860698584c030f4c9db1';
console.log(chain3.mc.defaultAccount);

return;
//Unit conversions
var value = chain3.fromSha('21000000000000', 'Xiao');
console.log(value); // "21000"
var value = chain3.toSha('1', 'mc');
console.log(value); // "1000000000000000000" = 1e18
var value = chain3.toBigNumber('200000000000000000000001');
console.log(value); // instanceOf BigNumber
console.log(value.toNumber()); // 2.0000000000000002e+23
console.log(value.toString(10)); // '200000000000000000000001'

//Following are the chain3 tools
var str = chain3.sha3("Some ASCII string to be hashed in MOAC");
console.log(str); 
var str = chain3.toHex("moac network");
console.log(str); // '0x6d6f6163206e6574776f726b'
console.log(chain3.toHex({moac: 'test'}));
var str = chain3.toAscii("0x0x6d6f6163206e6574776f726b");
console.log(str); // "moac network"
var str = chain3.fromAscii('moac network');
console.log(str); // "0x0x6d6f6163206e6574776f726b"
var myAddress = chain3.toChecksumAddress('0xa0c876ec9f2d817c4304a727536f36363840c02c');
console.log(myAddress); // '0xA0C876eC9F2d817c4304A727536f36363840c02c'
var number = chain3.toDecimal('0x15');
console.log(number); // 21
var value = chain3.fromDecimal('21');
console.log(value); // "0x15"
return;

var batch = chain3.createBatch();
batch.add(chain3.mc.getBalance.request('0x05a729a0b7965dbaaad6e4ef9566ca96de1e0d27', 'latest', function(err, res) {
        if (!err){
            
            console.log("Succeed!: ", res);
            return res;
        }else{
            console.log("Chain3 error:", err.message);
            // response.success = false;
            // response.error = err.message;
            return err.message;
        }}));
// batch.add(chain3.mc.contract(abi).at(address).balance.request(address, callback2));
batch.execute();
return;
// var coinbase = chain3.mc.getBlock(0).difficulty.toString();//coinbase;661081
// console.log(coinbase);

for(var i = 57220; i < 57245; i++){
    var blockinfo = chain3.mc.getBlock(i);
    // console.log(blockinfo);
    var outstr = i.toString() + "," + blockinfo.difficulty.toString() + ','+blockinfo.totalDifficulty.toString()+','+blockinfo.transactions.length+','+blockinfo.timestamp;
      // console.log(i, ",difficulty,",blockinfo.difficulty.toString(),",", blockinfo.totalDifficulty.toString(),",",blockinfo.transactions.length);//
      console.log(outstr);
  }

return;

stream.once('open', function(fd) {
for(var i = 0; i < latestBlock; i=i+360){
    var blockinfo = chain3.mc.getBlock(i);
    var outstr = i.toString() + "," + blockinfo.difficulty.toString() + ','+blockinfo.totalDifficulty.toString()+','+blockinfo.transactions.length+','+blockinfo.timestamp;
      // console.log(i, ",difficulty,",blockinfo.difficulty.toString(),",", blockinfo.totalDifficulty.toString(),",",blockinfo.transactions.length);//
      console.log(outstr);
      stream.write(outstr+"\n");
  }
stream.end();
});
return;
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

