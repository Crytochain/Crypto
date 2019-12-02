var Accounts = require("./../packages/chain3-mc-accounts");
var ethers = require('ethers');
var chai = require('chai');
var assert = chai.assert;
var Chain3 = require('../packages/chain3');
var chain3 = new Chain3();

var tests = [];

// MOAC used the same algorithom as Ethereum in account creation
// So compare and make sure the two methods generate the same results

for (var i = 0; i < 100; i++) {
    tests.push(i);
}


describe("mc", function () {
    describe("accounts", function () {

        tests.forEach(function (test, i) {
            it("create mc.account, and compare to ethers wallet", function() {
                var mcAccounts = new Accounts();

                // create account
                var acc = mcAccounts.create();

                // create ethers wallet
                var ethWall = new ethers.Wallet(acc.privateKey);

                // compare addresses and private keys
                assert.equal(acc.address, ethWall.address);
                assert.equal(acc.privateKey, ethWall.privateKey);
            });

        });
    });
});
