var chai = require('chai');
var assert = chai.assert;
var u = require('./helpers/test.utils.js');

var Mc = require('../packages/chain3-mc');
var mc = new Mc();

describe('mc', function() {
    describe('methods', function() {
        u.methodExists(mc, 'getBalance');
        u.methodExists(mc, 'getStorageAt');
        u.methodExists(mc, 'getTransactionCount');
        u.methodExists(mc, 'getCode');
        u.methodExists(mc, 'isSyncing');
        u.methodExists(mc, 'sendTransaction');
        u.methodExists(mc, 'call');
        u.methodExists(mc, 'getBlock');
        u.methodExists(mc, 'getTransaction');
        u.methodExists(mc, 'getUncle');
        u.methodExists(mc, 'getBlockTransactionCount');
        u.methodExists(mc, 'getBlockUncleCount');
        u.methodExists(mc, 'subscribe');
        u.methodExists(mc, 'Contract');
        u.methodExists(mc, 'Iban');


        u.methodExists(mc, 'isMining');
        u.methodExists(mc, 'getCoinbase');
        u.methodExists(mc, 'getGasPrice');
        u.methodExists(mc, 'getHashrate');
        u.methodExists(mc, 'getAccounts');
        u.methodExists(mc, 'getBlockNumber');

        u.methodExists(mc, 'getProtocolVersion');

        u.methodExists(mc, 'setProvider');
        u.propertyExists(mc, 'givenProvider');
        u.propertyExists(mc, 'defaultBlock');
        u.propertyExists(mc, 'defaultAccount');

        u.propertyExists(mc, 'net');
        u.methodExists(mc.net, 'getId');
        u.methodExists(mc.net, 'isListening');
        u.methodExists(mc.net, 'getPeerCount');

        u.propertyExists(mc, 'personal');
        u.methodExists(mc.personal, 'sendTransaction');
        u.methodExists(mc.personal, 'newAccount');
        u.methodExists(mc.personal, 'unlockAccount');
    });
});

