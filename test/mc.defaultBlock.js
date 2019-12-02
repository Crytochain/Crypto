var chai = require('chai');
var assert = chai.assert;
var Mc = require('../packages/chain3-mc');

var mc = new Mc();

var setValue = 123;

describe('chain3.mc', function () {
    describe('defaultBlock', function () {
        it('should check if defaultBlock is set to proper value', function () {
            assert.equal(mc.defaultBlock, 'latest');
            assert.equal(mc.personal.defaultBlock, 'latest');
            assert.equal(mc.Contract.defaultBlock, 'latest');
            assert.equal(mc.getCode.method.defaultBlock, 'latest');
        });
        it('should set defaultBlock for all sub packages is set to proper value, if Mc package is changed', function () {
            mc.defaultBlock = setValue;

            assert.equal(mc.defaultBlock, setValue);
            assert.equal(mc.personal.defaultBlock, setValue);
            assert.equal(mc.Contract.defaultBlock, setValue);
            assert.equal(mc.getCode.method.defaultBlock, setValue);
        });
    });
});

