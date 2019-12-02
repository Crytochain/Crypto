var chai = require('chai');
var utils = require('../packages/chain3-utils');

var assert = chai.assert;

describe('lib/utils/utils', function () {
    describe('toSha', function () {
        it('should return the correct value', function () {

            assert.equal(utils.toSha('1', 'sha'),    '1');
            assert.equal(utils.toSha('1', 'ksha'),   '1000');
            assert.equal(utils.toSha('1', 'Ksha'),   '1000');
            assert.equal(utils.toSha('1', 'femtomc'),   '1000');
            assert.equal(utils.toSha('1', 'msha'),   '1000000');
            assert.equal(utils.toSha('1', 'Msha'),   '1000000');
            assert.equal(utils.toSha('1', 'picomc'),   '1000000');
            assert.equal(utils.toSha('1', 'gsha'),   '1000000000');
            assert.equal(utils.toSha('1', 'Gsha'),   '1000000000');
            assert.equal(utils.toSha('1', 'nanomc'),   '1000000000');
            assert.equal(utils.toSha('1', 'micro'),  '1000000000000');
            assert.equal(utils.toSha('1', 'millimc'), '1000000000000000');
            assert.equal(utils.toSha('1', 'mc'),  '1000000000000000000');
            assert.equal(utils.toSha('1', 'kmc'), '1000000000000000000000');
            assert.equal(utils.toSha('1', 'grand'),  '1000000000000000000000');
            assert.equal(utils.toSha('1', 'mmc'), '1000000000000000000000000');
            assert.equal(utils.toSha('1', 'gmc'), '1000000000000000000000000000');
            assert.equal(utils.toSha('1', 'tmc'), '1000000000000000000000000000000');

            assert.equal(utils.toSha('1', 'ksha'),    utils.toSha('1', 'femtomc'));
            assert.equal(utils.toSha('1', 'sand'),   utils.toSha('1', 'micromc'));
            assert.equal(utils.toSha('1', 'milli'),  utils.toSha('1', 'millimc'));
            //assert.equal(utils.toSha('1', 'milli'),    utils.toSha('1', 'millimc'));
            assert.equal(utils.toSha('1', 'milli'),    utils.toSha('1000', 'sand'));

            assert.throws(function () {utils.toSha(1, 'sha1');}, Error);
        });
    });
});
