var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Chain3 = require('../packages/chain3');
var chain3 = new Chain3();


var tests = [{
    methods: [{
        name: 'getGasPrice2',
        call: 'mc_gasPrice',
        outputFormatter: chain3.extend.formatters.outputBigNumberFormatter
    },{
        name: 'getBalance',
        call: 'mc_getBalance',
        params: 2,
        inputFormatter: [chain3.utils.toChecksumAddress, chain3.extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: chain3.extend.formatters.outputBigNumberFormatter
    }]
},{
    property: 'admin',
    methods: [{
        name: 'getGasPrice3',
        call: 'mc_gasPrice',
        outputFormatter: chain3.extend.formatters.outputBigNumberFormatter
    },{
        name: 'getBalance',
        call: 'mc_getBalance',
        params: 2,
        inputFormatter: [chain3.utils.toChecksumAddress, chain3.extend.formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: chain3.extend.formatters.outputBigNumberFormatter
    }]
},{
    error: true,
    methods: [{
        name: 'getGasPrice4',
        outputFormatter: chain3.extend.formatters.outputBigNumberFormatter
    }]
},{
    error: true,
    methods: [{
        call: 'mc_gasPrice',
        outputFormatter: chain3.extend.formatters.outputBigNumberFormatter
    }]
}];

describe('chain3', function () {
    describe('extend', function () {
        tests.forEach(function (test, index) {
            it('test no: ' + index, function (done) {
                var count = 1;

                var provider = new FakeHttpProvider();
                chain3.setProvider(provider);

                if(test.error) {
                    assert.throws(chain3.extend.bind(chain3,test));

                    return done();

                } else {
                    chain3.extend(test);
                }

                if(test.methods) {
                    test.methods.forEach(function(property){


                        provider.injectResult('0x1234');
                        provider.injectValidation(function (payload) {
                            assert.equal(payload.jsonrpc, '2.0');
                            assert.equal(payload.method, property.call);

                            if(test.methods.length === count)
                                done();
                            else
                                count++;
                        });

                        if(test.property) {
                            assert.isFunction(chain3[test.property][property.name]);
                            chain3[test.property][property.name]();
                        } else {
                            assert.isFunction(chain3[property.name]);
                            chain3[property.name]();
                        }
                    });
                }
            });
        });
    });
});

