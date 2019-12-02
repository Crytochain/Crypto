var testMethod = require('./helpers/test.method.js');

var method = 'isMining';
var call = 'mc_mining';

var tests = [{
    result: true,
    formattedResult: true,
    call: call
}];


testMethod.runTests('mc', method, tests);
