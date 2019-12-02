var chai = require('chai');
var assert = chai.assert;
var Mc = require('../packages/chain3-mc');
var Chain3 = require('../packages/chain3');

var mc = new Mc();

var setValue = '0x47D33b27Bb249a2DBab4C0612BF9CaF4C1950855';

describe('chain3.mc', function () {
    describe('defaultAccount', function () {
        it('should check if defaultAccount is set to proper value', function () {
            assert.equal(mc.defaultAccount, null);
            assert.equal(mc.personal.defaultAccount, null);
            assert.equal(mc.Contract.defaultAccount, null);
            assert.equal(mc.getCode.method.defaultAccount, null);
        });
        it('should set defaultAccount for all sub packages is set to proper value, if Eth package is changed', function () {
            mc.defaultAccount = setValue;

            assert.equal(mc.defaultAccount, setValue);
            assert.equal(mc.personal.defaultAccount, setValue);
            assert.equal(mc.Contract.defaultAccount, setValue);
            assert.equal(mc.getCode.method.defaultAccount, setValue);
        });
        it('should fail if address is invalid, wich is to be set to defaultAccount', function () {

            assert.throws(function(){ mc.defaultAccount = '0x17F33b27Bb249a2DBab4C0612BF9CaF4C1950855'; });

        });
        it('should have different values for two Eth instances', function () {

            var mc1 = new Mc();
            mc1.defaultAccount = setValue;
            assert.equal(mc1.defaultAccount, setValue);

            var mc2 = new Mc();
            assert.equal(mc2.defaultAccount, null);

        });
        it('should have different values for two Web3 instances', function () {

            var chain31 = new Chain3();
            chain31.mc.defaultAccount = setValue;
            assert.equal(chain31.mc.defaultAccount, setValue);

            var chain32 = new Chain3();
            assert.equal(chain32.mc.defaultAccount, null);

        });
    });
});

