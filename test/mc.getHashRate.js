var testMethod = require('./helpers/test.method.js');

var method = 'getHashrate';


var tests = [{
    result: '0x788a8',
    formattedResult: 493736,
    call: 'mc_hashrate'
}];


testMethod.runTests('mc', method, tests);

