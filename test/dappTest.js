/*
 * TEST program for microchain DAPP object
 * this need to connect with SCS RPC port
 * and receive the contract status.
 * 
*/
var chai = require('chai');
var assert = chai.assert;
var Chain3 = require('../index');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var FakeHttpProvider2 = require('./helpers/FakeHttpProvider2');
var utils = require('../lib/utils/utils');
var errors = require('../lib/chain3/errors');
var BigNumber = require('bignumber.js');
var sha3 = require('../lib/utils/sha3');


/*
 * MicroChain Dapp contract test 
*/
var desc = [{
    "name": "balance(address)",
    "type": "function",
    "inputs": [{
        "name": "who",
        "type": "address"
    }],
    "constant": true,
    "outputs": [{
        "name": "value",
        "type": "uint256"
    }]
}, {
    "name": "send(address,uint256)",
    "type": "function",
    "inputs": [{
        "name": "to",
        "type": "address"
    }, {
        "name": "value",
        "type": "uint256"
    }],
    "outputs": [],
    "payable": true
}, {
    "name": "testArr(int[])",
    "type": "function",
    "inputs": [{
        "name": "value",
        "type": "int[]"
    }],
    "constant": true,
    "outputs": [{
        "name": "d",
        "type": "int"
    }]
}, {
    "name":"Changed",
    "type":"event",
    "inputs": [
        {"name":"from","type":"address","indexed":true},
        {"name":"amount","type":"uint256","indexed":true},
        {"name":"t1","type":"uint256","indexed":false},
        {"name":"t2","type":"uint256","indexed":false}
    ],
}];

var address = '0x1234567890123456789012345678901234567891';

describe('dapp', function () {
    describe('event', function () {
        
        it('should call testArr method and properly parse result', function () {
            var provider = new FakeHttpProvider2();
            var chain3 = new Chain3(provider);
            var signature = 'testArr(int[])';
            var address = '0x1234567890123456789012345678901234567891';
            provider.injectResultList([{
                result: '0x0000000000000000000000000000000000000000000000000000000000000005'
            }]);

            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'scs_getAnyCallReq');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000000000000000000000000000000000000000000020' +
                        '0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000003',
                    to: address
                },
                    'latest'
                    ]);
            });

            var dapp = chain3.scs.dapp(desc).at(address);
            var result = dapp.testArr([3]);

            assert.deepEqual(new BigNumber(5), result);
        });

        it('should call testArr method, properly parse result and return the result async', function (done) {
            var provider = new FakeHttpProvider2();
            var chain3 = new Chain3(provider);
            var signature = 'testArr(int[])';
            var address = '0x1234567890123456789012345678901234567891';
            provider.injectResultList([{
                result: '0x0000000000000000000000000000000000000000000000000000000000000005'
            }]);
            provider.injectValidation(function (payload) {
                assert.equal(payload.method, 'scs_getAnyCallReq');
                assert.deepEqual(payload.params, [{
                    data: '0x' + sha3(signature).slice(0, 8) +
                        '0000000000000000000000000000000000000000000000000000000000000020' +
                        '0000000000000000000000000000000000000000000000000000000000000001' +
                        '0000000000000000000000000000000000000000000000000000000000000003',
                    to: address
                },
                    'latest'
                ]);
            });

            var contract = chain3.scs.dapp(desc).at(address);

            contract.testArr([3], function (err, result) {
                assert.deepEqual(new BigNumber(5), result);
                done();
            });

        });
    });

});
