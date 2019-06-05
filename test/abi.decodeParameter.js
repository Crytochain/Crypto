var chai = require('chai');
var assert = chai.assert;
// var Abi = require('chain3').abicoder;
var Chain3 = require('../index.js');
var chain3 = new Chain3();
var Abi = chain3.abicoder;

var tests = [{
    params: ['uint256', '0x0000000000000000000000000000000000000000000000000000000000000010'],
    result: "16"
},{
    params: ['string', '0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000848656c6c6f212521000000000000000000000000000000000000000000000000'],
    result: "Hello!%!"
}];

describe('decodeParameter', function () {
    tests.forEach(function (test) {
        it('should convert correctly', function () {
            assert.equal(Abi.decodeParameter.apply(Abi, test.params), test.result);
        });
    });
});
