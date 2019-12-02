var _ = require('underscore');
var chai = require('chai');
var assert = chai.assert;
var FakeIpcProvider = require('./FakeIpcProvider');
var Chain3 = require('../../packages/chain3');

var clone = function (object) { return object ? JSON.parse(JSON.stringify(object)) : []; };

var useLocalWallet = function (test, provider, chain3) {

    test.useLocalWallet(chain3);

    provider.injectResult(1);
    provider.injectValidation(function (payload) {
 
        assert.equal(payload.jsonrpc, '2.0');
        assert.equal(payload.method, 'net_version');
        assert.deepEqual(payload.params, []);
    });

    provider.injectResult('0xa');
    provider.injectValidation(function (payload) {
        assert.equal(payload.jsonrpc, '2.0');
        assert.equal(payload.method, 'mc_getTransactionCount');
        assert.deepEqual(payload.params, [test.walletFrom, "latest"]);
    });
};



var runTests = function (obj, method, tests) {
    var objName;

    if(_.isArray(obj)) {
        objName = obj.join('.');
    } else {
        objName = obj;
    }

    var testName = objName ? 'chain3.' + objName : 'chain3';

    describe(testName, function () {
        describe(method, function () {
            tests.forEach(function (test, index) {
                it('promise test: ' + index, function (done) {

		    // given
                    var w3;
                    var result;
                    var provider = new FakeIpcProvider();
                    var chain3 = new Chain3(provider);
		    
		    // add a wallet
                    if(test.useLocalWallet) {
                        useLocalWallet(test, provider, chain3);
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
      

                    // if notification its sendTransaction, which needs two more results, subscription and receipt
                    if(test.notification) {
                        provider.injectResult(null);
                        provider.injectValidation(function (payload) {
                            assert.equal(payload.method, 'mc_getTransactionReceipt');
                        });

                        provider.injectResult(clone(test.result));
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
                        // fake newBlock
                        provider.injectNotification(test.notification);
                    }

                    var args = clone(test.args);

                    if(test.error) {
                        if (obj) {
                            if(_.isArray(obj)) {
			    	w3 = chain3[obj[0]][obj[1]];
                            } else {
                                w3 = chain3[obj];
                            }

                            assert.throws(function(){ w3[method].apply(w3, args); });
                        } else {
                            assert.throws(function(){ chain3[method].apply(chain3, args); });
                        }

                        done();

                    } else {

                        if (obj) {
                            if(_.isArray(obj)) {
                                w3 = chain3[obj[0]][obj[1]];
                            } else {
                                w3 = chain3[obj];
                            }
                            result = w3[method].apply(w3, args);
                        } else {
                            result = chain3[method].apply(chain3, args);
                        }
			

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
                    var provider = new FakeIpcProvider();
                    var chain3 = new Chain3(provider);

                    // add a wallet
                    if(test.useLocalWallet) {
                        useLocalWallet(test, provider, chain3);
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


                    var args = clone(test.args);

                    if(test.error) {
                        if (obj) {
                            if(_.isArray(obj)) {
                                w3 = chain3[obj[0]][obj[1]];
                            } else {
                                w3 = chain3[obj];
                            }

                            assert.throws(function(){ w3[method].apply(w3, args); });
                        } else {
                            assert.throws(function(){ chain3[method].apply(chain3, args); });
                        }

                       done();

                    } else {
                        // add callback
                        args.push(function (err, result) {
                            assert.deepEqual(result, test.formattedResult);
			
                           done();
                        });

			// when
                        if (obj) {
                            if(_.isArray(obj)) {
                               w3 = chain3[obj[0]][obj[1]];
                            } else {
                                w3 = chain3[obj];
                            }

                            w3[method].apply(w3, args);
                        } else {
                            chain3[method].apply(chain3, args);
                       }
                    }
                });
            });
        });
    });

};

module.exports = {
    runTests: runTests
};
