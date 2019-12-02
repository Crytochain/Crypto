var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Chain3 = require('../packages/chain3');
var Accounts = require("./../packages/chain3-mc-accounts");
var chai = require('chai');
var assert = chai.assert;

var clone = function (object) { return object ? JSON.parse(JSON.stringify(object)) : []; };

/*
Rawtx: { from: '0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B',
  nonce: '0xe6',
  gasPrice: '0xba43b7400',
  gas: '0x4c4b40',
  to: '0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9',
  value: '0x9184e72a000',
  shardingFlag: 0,
  data: '0x00',
  chainId: '101' }
Sending raw tx to......
cmd: 0xf87081e680850ba43b7400834c4b4094d814f2ac2c4ca49b33066582e4e97ebae02f2ab98609184e72a00000808081eea03553e9fb4739788ffd0979a0326289055159f66c418cfa09abe9eeadef089518a03cac6dd894b7e7e470cecceaaa7b12aa91bd0dc20b0e1a64e1f31306c80f7e8c
Succeed!:  0xce4953fe461b6d9e7d680690f01d177e9e72865515494e2f088cfe2be0bfc332
*/
var tests = [ 
    {
        address: '0x7312F4B8A4457a36827f185325Fd6B66a3f8BB8B',
        iban: 'XE41DFWQSJRBYW18J96OW3HBYBYHK48540B',
        privateKey: '0xc75a5f85ef779dcf95c651612efb3c3b9a6dfafb1bb5375905454d9fc8be8a6b',
        transaction: {
            chainId: 101,
            nonce: '0xe6',
            gasPrice: "0xba43b7400",
            gas: '0x4c4b40',
            to: '0xD814F2ac2c4cA49b33066582E4e97EBae02F2aB9',
            toIban: 'XE72P8O19KRSWXUGDY294PZ66T4ZGF89INT',
            value: "0x9184e72a000",
            shardingFlag: 0,
            input: "0x00"
        },
        // signature from mc_signTransaction
        rawTransaction: "0xf87081e680850ba43b7400834c4b4094d814f2ac2c4ca49b33066582e4e97ebae02f2ab98609184e72a00000808081eea03553e9fb4739788ffd0979a0326289055159f66c418cfa09abe9eeadef089518a03cac6dd894b7e7e470cecceaaa7b12aa91bd0dc20b0e1a64e1f31306c80f7e8c",
        oldSignature: "0xf87081e680850ba43b7400834c4b4094d814f2ac2c4ca49b33066582e4e97ebae02f2ab98609184e72a00000808081eea03553e9fb4739788ffd0979a0326289055159f66c418cfa09abe9eeadef089518a03cac6dd894b7e7e470cecceaaa7b12aa91bd0dc20b0e1a64e1f31306c80f7e8c"
    },
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        transaction: {
            chainId: 1,
            nonce: 0,
            gasPrice: "230000000000",
            gas: -50000,
            to: '0xFCAd0B19bB29D4674531d6f115237E16AfCE377c',
            toIban: 'XE63TIJX31ZHSLZ6F601ZPKVDKKYHMIK03G', // will be switched to "to" in the test
            value: "1000000000000000000",
            data: "0x0123abcd"
        },
        error: true
    },
];

describe("moac", function () {
    describe("accounts", function () {

        // For each test
        tests.forEach(function (test, i) {
            if (test.error) {

                it("signTransaction must error", function(done) {
                    var mcAccounts = new Accounts();

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    testAccount.signTransaction(test.transaction).catch(function (err) {
                        assert.instanceOf(err, Error);
                        done();
                    });
                });

            } else {

                it("signTransaction must compare to mc_signTransaction", function(done) {
                    var mcAccounts = new Accounts();

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    testAccount.signTransaction(test.transaction).then(function (tx) {
                        assert.equal(tx.rawTransaction, test.rawTransaction);
                        done();
                    });
                });


                it("signTransaction using the iban as \"to\" must compare to mc_signTransaction", function(done) {
                    var mcAccounts = new Accounts();

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    transaction.to = transaction.toIban;
                    delete transaction.toIban;
                    testAccount.signTransaction(transaction).then(function (tx) {
                        assert.equal(tx.rawTransaction, test.rawTransaction);
                        done();
                    });
                });
	    
                it("signTransaction will call for nonce", function(done) {
                    var provider = new FakeHttpProvider();
                    var chain3 = new Chain3(provider);

                    provider.injectResult('0xa');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'mc_getTransactionCount');
                        assert.deepEqual(payload.params, [test.address, "latest"]);
                    });

                    var mcAccounts = new Accounts(chain3);

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.nonce;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("signTransaction will call for gasPrice", function(done) {
                    var provider = new FakeHttpProvider();
                    var chain3 = new Chain3(provider);

                    provider.injectResult('0x5022');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'mc_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });

                    var mcAccounts = new Accounts(chain3);

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.gasPrice;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("signTransaction will call for chainId", function(done) {
                    var provider = new FakeHttpProvider();
                    var chain3 = new Chain3(provider);

                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'net_version');
                        assert.deepEqual(payload.params, []);
                    });

                    var mcAccounts = new Accounts(chain3);

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.chainId;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("signTransaction will call for nonce, gasPrice and chainId", function(done) {
                    var provider = new FakeHttpProvider();
                    var chain3 = new Chain3(provider);

                    provider.injectResult(1);
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'net_version');
                        assert.deepEqual(payload.params, []);
                    });
		            provider.injectResult('1');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'mc_gasPrice');
                        assert.deepEqual(payload.params, []);
                    });

                    provider.injectResult('1');
                    provider.injectValidation(function (payload) {
                        assert.equal(payload.jsonrpc, '2.0');
                        assert.equal(payload.method, 'mc_getTransactionCount');
                        assert.deepEqual(payload.params, [test.address, "latest"]);
                    });

                    var mcAccounts = new Accounts(chain3);

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    var transaction = clone(test.transaction);
                    delete transaction.chainId;
                    delete transaction.gasPrice;
                    delete transaction.nonce;
                    testAccount.signTransaction(transaction)
                    .then(function (tx) {
                        assert.isObject(tx);
                        assert.isString(tx.rawTransaction);

                        done();
                    });
                });

                it("recoverTransaction, must recover signature", function() {
                    var mcAccounts = new Accounts();

                    var testAccount = mcAccounts.privateKeyToAccount(test.privateKey);
                    assert.equal(testAccount.address, test.address);

                    testAccount.signTransaction(test.transaction).then(function (tx) {
                        assert.equal(mcAccounts.recoverTransaction(tx.rawTransaction), test.address);
                    });
                });

          }  
        });
    });
});
