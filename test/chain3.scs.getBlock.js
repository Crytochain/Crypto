var chai = require('chai');
var chain3 = require('../index');
var BigNumber = require('bignumber.js');
var testMethod = require('./helpers/test.method.js');

var method = 'getBlock';

// Fake result for testing
var blockResult = {
    "hash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "nonce":"0x5",
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": "0x15df",
    "transactionIndex":  "0x1",
    "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    "to":"0x85h43d8a49eeb85d32cf465507dd71d507100c1",
    "value":"0x7f110",
    "gas": "0x7f110",
    "gasPrice":"0x09184e72a000",
    "input":"0x603880600c6000396000f30060"
};
//Expected result from the command
var formattedBlockResult = {
    "hash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
    "nonce":5,
    "blockHash": "0x6fd9e2a26ab",
    "blockNumber": 5599,
    "transactionIndex":  1,
    "from":"0x407d73d8a49eeb85d32cf465507dd71d507100c1",
    "to":"0x85h43d8a49eeb85d32cf465507dd71d507100c1",
    "value": new BigNumber(520464),
    "gas": 520464,
    "gasPrice": new BigNumber(10000000000000),
    "input":"0x603880600c6000396000f30060"
};

//"extraData":"0x","hash":"0x10524b2f730b014cf080e6bd3e98218c5acf15addb1cccb00963cfa0201f4614","number":"0x1","parentHash":"0x0000000000000000000000000000000000000000000000000000000000000000","receiptsRoot":"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421","stateRoot":"0x5a5d1b1f61eb711eded3bcd30dad3e53f8bfbe66ca135af3e02af24dcbaa0e91","timestamp":"0x0","transactions":[],"transactionsRoot":"0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421"}}

var tests = [{
    args: ['0x2dbab4c0612bf9caf4c195085547dc0612bf9caf4c1950855'],
    formattedArgs: ['0x2dbab4c0612bf9caf4c195085547dc0612bf9caf4c1950855'],
    result: blockResult,
    formattedResult: formattedBlockResult,
    call: 'scs_'+ method
}];

testMethod.runTests('scs', method, tests);

