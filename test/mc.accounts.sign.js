var Accounts = require("./../packages/chain3-mc-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/chain3');
var web3 = new Web3();

var tests = [
    {
        address: '0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B',
        privateKey: '0xc75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b',
        data: '0xa4810c35f20a04bc9e3f642e33531ff0b42f146f8b757523ab5ef6ede54fae39',
        // signature done with personal_sign
        signature: "0x1cc637476de5fd01e119bb7215d9b5bfe486c80871f949a61cc2ee6fc95d16b1166d15012c4b93d5be9eb1f6d0fc1dba835c235868d5fab76f83313cc4c8f6821c"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data',
        // signature done with personal_sign
        signature: '0x3a83000807a29ca6df2849dbedf849093f80477acdef294173fac93e2541faf25a9fb1b0fffc345166995aeb1f932c15130d8aa026c31a7a74e1102f652ef40a1b'
    }, {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data!%$$%&@*',
        // signature done with personal_sign
        signature: '0x62384be7819aec54a8b93da5d690ec11cbc4da3836bf03bdb13a5ee2e96fd24818bbe96708c1806fd681d1092e04a2d72bb5b9ec8a7d7b2eaa3240b74c6111001c'
    }, 
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
        // signature done with personal_sign
        signature: '0x36bdbca99ea29d49b2ba1dfece60244fc5236215ad82a982537af8411cc7629b189670ba0855442e4819ab108ab6f3184494e5f3be759b2e58478174edaf8f391b'
    }
];


describe("moac", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("sign data using a string", function() {
                var ethAccounts = new Accounts();

                var data = ethAccounts.sign(test.data, test.privateKey);

                assert.equal(data.signature, test.signature);
            });

            it("sign data using a utf8 encoded hex string", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.data) ? test.data : web3.utils.utf8ToHex(test.data);
                var data = ethAccounts.sign(data, test.privateKey);

                assert.equal(data.signature, test.signature);
            });


            it("recover signature using a string", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(test.data, test.signature);

                assert.equal(address, test.address);
            });

            it("recover signature using a string and preFixed", function() {
                var ethAccounts = new Accounts();

                var address = ethAccounts.recover(ethAccounts.hashMessage(test.data), test.signature, true);

                assert.equal(address, test.address);
            });

            it("recover signature using a hash and r s v values and preFixed", function() {
                var ethAccounts = new Accounts();

                var sig = ethAccounts.sign(test.data, test.privateKey);
                var address = ethAccounts.recover(ethAccounts.hashMessage(test.data), sig.v, sig.r, sig.s, true);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using a signature object", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.data) ? test.data : web3.utils.utf8ToHex(test.data);
                var sig = ethAccounts.sign(data, test.privateKey);
                var address = ethAccounts.recover(sig);

                assert.equal(address, test.address);
            });

            it("recover signature using a signature object", function() {
                var ethAccounts = new Accounts();

                var sig = ethAccounts.sign(test.data, test.privateKey);
                var address = ethAccounts.recover(sig);

                assert.equal(address, test.address);
            });

            it("recover signature (pre encoded) using a hash and r s v values", function() {
                var ethAccounts = new Accounts();

                var data = web3.utils.isHexStrict(test.data) ? test.data : web3.utils.utf8ToHex(test.data);
                var sig = ethAccounts.sign(data, test.privateKey);
                var address = ethAccounts.recover(test.data, sig.v, sig.r, sig.s);

                assert.equal(address, test.address);
            });

            it("recover signature using a hash and r s v values", function() {
                var ethAccounts = new Accounts();

                var sig = ethAccounts.sign(test.data, test.privateKey);
                var address = ethAccounts.recover(test.data, sig.v, sig.r, sig.s);

                assert.equal(address, test.address);
            });
        });
    });
});
