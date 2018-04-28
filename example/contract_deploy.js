var fs = require('fs');
var solc = require('solc');
var Chain3 = require('../index.js'); //require('chain3');

/*
 * Example program to compile a demo contract
*/
var cmds = process.argv;
if(cmds != null && cmds.length == 3){
  var file = cmds[2];
  // var name = cmds[3];
}else
{
  console.log("Input should have contract file and contract name:\neg: node deploy.js add.sol add");
  return;
}
  var content = fs.readFileSync(file).toString();

  var input = {
    file: content
  };


var tacct = {
  "addr": "0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B", 
  "key": "c75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b"
};
// console.log("Balance:", chain3.mc.getBalance(tacct["addr"]));
// return;

  var output = solc.compile({sources: input}, 1);
  console.log('contracts', Object.keys(output.contracts));

  var key = Object.keys(output.contracts);
  //this is the 
  var ctt = output.contracts[key];
   // for(var key in output.contracts){
   //    console.log("Key:", key);
   //    console.log(output.contracts[key].bytecode);
   // }
  // console.log("ctt:", output.contracts['file:addab']);
  if(ctt == null){
      console.log("Contract CTT is empty1");
      return;
  }

  var bytecode = "0x"+ctt.bytecode;
  var abi = JSON.parse(ctt.interface);

  console.log('bytecode', bytecode);
  // console.log('abi', ctt.interface);

  // chain3 = new Chain3(new Chain3.providers.HttpProvider("http://192.168.10.204:8545"));
  var chain3 = new Chain3();
  chain3.setProvider(new chain3.providers.HttpProvider('http://localhost:8545'));
let gasEstimate = chain3.mc.estimateGas({data: bytecode});
console.log("Gas Estimate on contract:", gasEstimate);

//Build the raw transaction



createContract(tacct,gasEstimate,bytecode);
console.log("done!========");

/*
 * 
*/
function createContract(src, gasValue, inByteCode){

    var txcount = chain3.mc.getTransactionCount(src["addr"]);
    console.log("Get tx account", txcount)
    //Build the raw tx obj
    //note the transaction
    var rawTx = {
      from: src.addr,
      nonce: chain3.intToHex(txcount),
      gasPrice: chain3.intToHex(420000000000),//chain3.intToHex(chain3.mc.gasPrice),//
      gasLimit: chain3.intToHex(4200000),//chain3.intToHex(gasValue),
      to: '0x',
      value: '0x', 
      data: inByteCode,
      shardingFlag: 0, //default is global contract
      chainId: chain3.version.network
    }
    // var rawTx = {
    //   from: src.addr,
    //   nonce: chain3.intToHex(txcount),
    //   // 1 gwei
    //   gasPrice: chain3.intToHex(40000000000),//chain3.intToHex(chain3.mc.gasPrice),//chain3.intToHex(400000000),
    //   gasLimit: chain3.intToHex(4200000),
    //   to: '0x',//des.addr, 
    //   value: chain3.intToHex(chain3.toSha(value, 'mc')), 
    //   data: bytecode,// contract compiled code
    //   chainId: 99
    // }

    console.log(rawTx);

    //Get the account TX list to set the raw TX command nonce value
    //Requires the private key
//Sign the transaction

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
    
    // console.log(response);
    console.log("Get response from MOAC node in the feedback function!")
        // res.send(response);
    });

}

return;

