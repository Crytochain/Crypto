var chai = require('chai');
var chain3 = require('../index');
var testMethod = require('./helpers/test.method.js');

var method = 'getCompilers';


var tests = [{
    args: [],
    formattedArgs: [],
    result: ['solidity'],
    formattedResult: ['solidity'],
    call: 'mc_'+ method
},{
    args: [],
    formattedArgs: [],
    result: ['solidity'],
    formattedResult: ['solidity'],
    call: 'mc_'+ method
}];

testMethod.runTests('mc', method, tests);

