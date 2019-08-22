var chai = require('chai');
var assert = chai.assert;
var coder = require('../lib/solidity/coder');
var BigNumber = require('bignumber.js');
var bn = BigNumber;

/*
 * Test the tuple decoder functions
 * 
 * The following table shows on the left column Solidity types 
 * that are not part of the ABI, and on the right column the ABI types that represent them.
 * ========================================================================
 * Solidity  |  ABI
 * address   |  payable address
 * struct    |  tuple
 * ========================================================================
*/


describe('lib/solidity/coder', function () {
    describe('decodeParam', function () {
        var test = function (t) {
            it('should turn ' + t.value + ' to ' + t.expected, function () {
                assert.deepEqual(coder.decodeParam(t.type, t.value), t.expected);
            });
        };

        // Test the tuple inputs as object
        const tupleinputs = {
        "name": "s",
        "type": "tuple",
        "components": [
          {
            "name": "a",
            "type": "uint256"
          },
          {
            "name": "b",
            "type": "uint256[]"
          },
          {
            "name": "c",
            "type": "tuple[]",
            "components": [
              {
                "name": "x",
                "type": "uint256"
              },
              {
                "name": "y",
                "type": "uint256"
              }
            ]
          }
        ]
      };

        // Should return as obj 
        const tupleoutputs = {
            '0': '0',
            first: '0',
            '1': ['', '', '0'],
            second: ['', '', '0'],
            '2': '0',
            third: '0',
            '3': '0',
            fourth: '0'
        };
        test({ type: tupleinputs, expected: [['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x407d73d8a49eeb85d32cf465507dd71d507100c2'],
                                               ['0x407d73d8a49eeb85d32cf465507dd71d507100c3', '0x407d73d8a49eeb85d32cf465507dd71d507100c4']],
                                                            value: '0000000000000000000000000000000000000000000000000000000000000040' +
                                                                   '00000000000000000000000000000000000000000000000000000000000000a0' +
                                                                   '0000000000000000000000000000000000000000000000000000000000000002' + /* 40 */
                                                                   '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c1' + /* 60 */
                                                                   '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c2' +
                                                                   '0000000000000000000000000000000000000000000000000000000000000002' + /* a0 */
                                                                   '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c3' +
                                                                   '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c4' });
        // test({ type: 'address[2][]', expected: [['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x407d73d8a49eeb85d32cf465507dd71d507100c2'],
        //                                        ['0x407d73d8a49eeb85d32cf465507dd71d507100c3', '0x407d73d8a49eeb85d32cf465507dd71d507100c4']],
        //                                                     value: '0000000000000000000000000000000000000000000000000000000000000020' +
        //                                                            '0000000000000000000000000000000000000000000000000000000000000002' + /* 20 */
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c1' +
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c2' +
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c3' +
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c4' });
        // test({ type: 'address[][]', expected: [['0x407d73d8a49eeb85d32cf465507dd71d507100c1', '0x407d73d8a49eeb85d32cf465507dd71d507100c2'],
        //                                        ['0x407d73d8a49eeb85d32cf465507dd71d507100c3', '0x407d73d8a49eeb85d32cf465507dd71d507100c4']],
        //                                                     value: '0000000000000000000000000000000000000000000000000000000000000020' +
        //                                                            '0000000000000000000000000000000000000000000000000000000000000002' + /* 20 */
        //                                                            '0000000000000000000000000000000000000000000000000000000000000080' +
        //                                                            '00000000000000000000000000000000000000000000000000000000000000e0' +
        //                                                            '0000000000000000000000000000000000000000000000000000000000000002' + /* 80 */
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c1' + /* a0 */
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c2' +
        //                                                            '0000000000000000000000000000000000000000000000000000000000000002' + /* e0 */
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c3' +
        //                                                            '000000000000000000000000407d73d8a49eeb85d32cf465507dd71d507100c4' });

    });
});

