var chai = require('chai');
var assert = chai.assert;
var BigNumber = require('bignumber.js');
var Chain3 = require('../index');
var chain3 = new Chain3();
// var testMethod = require('./helpers/test.scsMethod.js');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
/*
 * Return the list of MicroChains on the connected SCS
 *  
 * Parameters
 * None
 * Returns
 * `Array` - A list of MicroChain addresses on the SCS.
 */
var method = 'getMicroChainList';

var tests = [{
    result: ['0x000000000000000000000000000000000000012d', '0x000000000000000000000000000000000000013d'],
    formattedResult: ['0x000000000000000000000000000000000000012d', '0x000000000000000000000000000000000000013d'],
    call: 'scs_' + method
}];

// testMethod.runTests('scs', method, tests);

describe('chain3.scs', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('getMicroChainList test: ' + index, function () {
                
                // given the result to the FakeProvider
                var provider = new FakeHttpProvider();
                chain3.setScsProvider(provider);
                provider.injectResult(test.result);

                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    // assert.deepEqual(payload.params, test.formattedArgs);
                });

                // when the input args more than 1 item, need to input separately
                var result = chain3.scs.getMicroChainList();
               // then
                assert.strictEqual(test.formattedResult[0], result[0]);
            });
            
            it('async getMicroChainList test: ' + index, function (done) {
                
                // given
                var provider = new FakeHttpProvider();
                chain3.setScsProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');

                    assert.equal(payload.method, test.call);
                    // assert.deepEqual(payload.params, test.formattedArgs);
                });

                // when 
                chain3.scs.getMicroChainList(function (err, result) {
                    // assert.strictEqual(test.formattedResult, result);
                    assert.strictEqual(test.formattedResult[0], result[0]);
                    done();
                });
                
            });
        });
    });
});