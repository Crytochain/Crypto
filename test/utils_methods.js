var u = require('./helpers/test.utils.js');
var utils = require('../packages/chain3-utils');

describe('utils', function() {
    describe('methods', function () {
        u.methodExists(utils, 'sha3');
        u.methodExists(utils, 'hexToAscii');
        u.methodExists(utils, 'asciiToHex');
        u.methodExists(utils, 'hexToNumberString');
        u.methodExists(utils, 'numberToHex');
        u.methodExists(utils, 'fromSha');
        u.methodExists(utils, 'toSha');
        u.methodExists(utils, 'toBN');
        u.methodExists(utils, 'isAddress');
    });
});

