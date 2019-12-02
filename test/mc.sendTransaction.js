var testMethod = require('./helpers/test.method.js');
var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Chain3 = require('../packages/chain3');

var clone = function (object) { return object ? JSON.parse(JSON.stringify(object)) : []; };


var method = 'sendTransaction';


var tests = [{
    args: [{
        from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        value: '1234567654321',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x4b7dddc97a"
    }],
    result: '0x1234567',
    formattedResult: '0x1234567',
    notification: {
        method: 'mc_subscription',
        params: {
            subscription: '0x1234567',
            result: {
               blockNumber: '0x10'
            }
        }
    },
    call: 'mc_'+ method
},
// test with gasPrice missing
{
    args: [{
        from: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        to: '0xdbdbdB2cBD23b783741e8d7fcF51e459b497e4a6', // checksum address
        value: '1234567654321'
    }],
    notification: {
        method: 'mc_subscription',
        params: {
            subscription: '0x1234567',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'mc_gasPrice',
    formattedArgs: [],
    result: '0x1234567',
    formattedResult: '0x1234567',

    call2: 'mc_'+ method,
    formattedArgs2: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x1234567"
    }],
    result2: '0x1234567'
},{    
    args: [{
        from: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
        to: '0XDBDBDB2CBD23B783741E8D7FCF51E459B497E4A6',
        value: '1234567654321',
        data: '0x213453ffffff',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        data: '0x213453ffffff',
        gasPrice: "0x4b7dddc97a"
    }],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'mc_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'mc_'+ method
},{
    args: [{
        from: 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS', // iban address
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234'
    }],
    formattedArgs: [{
        from: "0x00c5496aee77c1ba1f0854206a26dda82a81d6d8",
        to: "0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6",
        value: "0x11f71f76bb1",
        gasPrice: "0x4b7dddc97a"
    }],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'mc_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'mc_'+ method

// using local wallet
},{                 
    useLocalWallet: function (chain3) {
        chain3.mc.accounts.wallet.add('0xd7d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
    },
    walletFrom: '0x5af0838657202f865A4547b5eD28a64f799960DC',
    args: [{
        from: '0x5af0838657202f865A4547b5eD28a64f799960DC',
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234',
        gas: 500000
    }],
    formattedArgs:['0xf86e0a80854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb180808026a08b5c63324e4073ea4d6570e1a8d42591ec37bb349822808a9014848cfcedbda6a0727dbf72ca25277dab5fdce24e36755856aebd20b008e1111f335b5430790cdc'],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'mc_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
   },
    call: 'mc_sendRawTransaction'
},{
    useLocalWallet: function (chain3) {
        chain3.mc.accounts.wallet.add('0xf7d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
    },
    walletFrom: '0xE2873A6bE9Bc50E70dE4295d968459d4aCF515C0',
    args: [{
        from: 0,
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234',
        gas: 500000
    }],
    formattedArgs:['0xf86e0a80854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb180808026a04f47404f176b7af2cfaf7ed091d9bd8a092fa54441e78d32151247be33bc22d8a01ca6e46ff23c6b94c5fad71e50b928138237c992583c125c9b2f97fb194d4c2b'],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'mc_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
            result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'mc_sendRawTransaction'
},{
    useLocalWallet: function (chain3) {
        chain3.mc.accounts.wallet.add('0xa1d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142');
    },
    walletFrom: '0xF65a29341Fd9F8357e060f2e21Bf3407062f2A46',
    args: [{
        from: {
            address: '0xF65a29341Fd9F8357e060f2e21Bf3407062f2A46',
            privateKey: '0xa1d364e720c129acb940439a84a99185dd55af6f6d105018a8acfb7f8c008142'
        },
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321',
        gasPrice: '324234234234',
        gas: 500000
    }],
    formattedArgs: ['0xf86e0a80854b7dddc97a8307a12094dbdbdb2cbd23b783741e8d7fcf51e459b497e4a686011f71f76bb180808025a03bd1700de44a0fc4a6e083fbeabe73d70c6cb2e414801c22262af3e5b73ad030a034ff66210817cbcfc55e890d3264336d6287f1c82cd4801bafc0fcacbdee7e9a'],
    result: '0x12345678976543213456786543212345675432',
    formattedResult: '0x12345678976543213456786543212345675432',
    notification: {
        method: 'mc_subscription',
        params: {
            subscription: '0x12345678976543213456786543212345675432',
          result: {
                blockNumber: '0x10'
            }
        }
    },
    call: 'mc_sendRawTransaction'
},{
    error: true, // only for testing
    args: [{
        from: 'XE81ETHXREGGAVOFYORK', // iban address
        to: '0xdbdbdb2cbd23b783741e8d7fcf51e459b497e4a6',
        value: '1234567654321'
    }],
    call: 'mc_'+ method
}];

testMethod.runTests('mc', method, tests);


// Test HTTPProvider with interval
describe(method, function () {
    tests.forEach(function (test, index) {
        it('promise test: ' + index, function (done) {

            // given
            var w3;
            var result;
            var provider = new FakeHttpProvider();
            var chain3 = new Chain3(provider);

            // skipp wallet tests
            if(test.useLocalWallet) {
                return done();
            }


            provider.injectResult(clone(test.result));
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedArgs || []);
            });

            if (test.call2) {
                provider.injectResult(clone(test.result2));
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call2);
                    assert.deepEqual(payload.params, test.formattedArgs2 || []);
                });
            }

            provider.injectResult(null);
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'mc_getTransactionReceipt');
            });


            // if notification its sendTransaction, which needs two more results, subscription and receipt
            if(test.notification) {
                // inject receipt
                provider.injectResult({
                    "blockHash": "0x6fd9e2a26ab",
                    "blockNumber": "0x15df",
                    "transactionHash": "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
                    "transactionIndex": "0x1",
                    "contractAddress": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
                    "cumulativeGasUsed": "0x7f110",
                    "gasUsed": "0x7f110"
                });
            }

            var args = clone(test.args);

            if(test.error) {

                assert.throws(function(){ chain3.mc[method].apply(chain3, args); });
                done();


            } else {


                result = chain3.mc[method].apply(chain3, args);

                result.then(function(result){
                    if(test.notification) {
                        // test receipt
                        assert.deepEqual(result, {
                            "blockHash": "0x6fd9e2a26ab",
                            "blockNumber": 5599,
                            "transactionHash":"0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
                            "transactionIndex":  1,
                            "contractAddress":"0x407D73d8a49eeb85D32Cf465507dd71d507100c1", // checksum address
                            "cumulativeGasUsed": 520464,
                            "gasUsed": 520464
                        });
                    } else {
                        assert.deepEqual(result, test.formattedResult);
                    }

                    done();
                });
            }

        });

        it('callback test: ' + index, function (done) {

            // given
            var w3;
            var provider = new FakeHttpProvider();
            var chain3 = new Chain3(provider);

            // add a wallet
            if(test.useLocalWallet) {
                return done();
            }

            provider.injectResult(clone(test.result));
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, test.call);
                assert.deepEqual(payload.params, test.formattedArgs || []);
            });

            if (test.call2) {
                provider.injectResult(clone(test.result2));
                provider.injectValidation(function (payload) {
                    assert.equal(payload.jsonrpc, '2.0');
                    assert.equal(payload.method, test.call2);
                    assert.deepEqual(payload.params, test.formattedArgs2 || []);
                });
            }


            provider.injectResult(null);
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'mc_getTransactionReceipt');
            });


            // if notification its sendTransaction, which needs two more results, subscription and receipt
            if(test.notification) {
                // inject receipt
                provider.injectResult({
                    "blockHash": "0x6fd9e2a26ab",
                    "blockNumber": "0x15df",
                    "transactionHash": "0xc6ef2fc5426d6ad6fd9e2a26abeab0aa2411b7ab17f30a99d3cb96aed1d1055b",
                    "transactionIndex": "0x1",
                    "contractAddress": "0x407d73d8a49eeb85d32cf465507dd71d507100c1",
                    "cumulativeGasUsed": "0x7f110",
                    "gasUsed": "0x7f110"
                });
            }

            var args = clone(test.args);
            if(test.error) {
                assert.throws(function(){ chain3.mc[method].apply(chain3, args); });

                done();

            } else {
                // add callback
                args.push(function (err, result) {
                    assert.deepEqual(result, test.formattedResult);

                    done();
                });

                chain3.mc[method].apply(chain3, args);
            }
        });
    });
});