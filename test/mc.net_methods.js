var chai = require('chai');
var assert = chai.assert;
var u = require('./helpers/test.utils.js');
var Mc = require('../packages/chain3-mc');
var mc = new Mc();

describe('chain3.net', function() {
    describe('methods', function() {
        u.methodExists(mc.net, 'getId');
        u.methodExists(mc.net, 'getNetworkType');
        u.methodExists(mc.net, 'isListening');
        u.methodExists(mc.net, 'getPeerCount');
    });
});
