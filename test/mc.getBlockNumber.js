var testMethod = require('./helpers/test.method.js');

var method = 'getBlockNumber';

var tests = [{
    result: '0xb',
    formattedResult: 11,
    call: 'mc_blockNumber'
}];


testMethod.runTests('mc', method, tests);
