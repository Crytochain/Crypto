var BigNumber = require('bignumber.js');
var Chain3 = require('../index');
var chain3 = new Chain3();
var testMethod = require('./helpers/test.scsmethod.js');

/*
 * Return the Account balance in a MicroChain
*/
var method = 'getBalance';

var tests = [{
    args: ['0x000000000000000000000000000000000000012d', '0x000000000000000000000000000000000000013d'],
    formattedArgs: ['0x000000000000000000000000000000000000012d', '0x000000000000000000000000000000000000013d'],
    result: '0xb',
    formattedResult: '0xb',
    call: 'scs_'+ method
}];

testMethod.runTests('scs', method, tests);

