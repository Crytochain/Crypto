var chai = require('chai');
var assert = chai.assert;
var Chain3 = require('../index');
var chain3 = new Chain3();
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

var method = 'getNonce';

// Test object
var tests = [{
    result: '0xb',
    formattedResult: 11,
    call: 'scs_'+ method
}];

describe('chain3.scs', function () {
    describe(method, function () {
        tests.forEach(function (test, index) {
            it('getNonce test: ' + index, function () {
                
                // given the result to the FakeProvider
                var provider = new FakeHttpProvider();
                chain3.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, []);
                });

                // when 
                var result = chain3.scs.getNonce();//chain3.scs[method];
                // console.log("getNonde:", chain3.scs[method]);
               // then
                assert.strictEqual(test.formattedResult, result);
            });
            
            it('async get getNonce test: ' + index, function (done) {
                
                // given
                var provider = new FakeHttpProvider();
                chain3.setProvider(provider);
                provider.injectResult(test.result);
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call);
                    assert.deepEqual(payload.params, []);
                });

                // when 
                chain3.scs.getNonce(function (err, result) {
                    assert.strictEqual(test.formattedResult, result);
                    done();
                });
                
            });
        });
    });
});

