var chai = require('chai');
var assert = chai.assert;
var Chain3 = require('../packages/chain3');
var FakeIpcProvider = require('./helpers/FakeIpcProvider');



describe('lib/chain3/batch', function () {
    describe('execute', function () {
        it('should execute batch request', function (done) {

            var provider = new FakeIpcProvider();
            var chain3 = new Chain3(provider);

            var result = '0x126';
            var resultVal = '294';
            var result2 = '0x127';
            var result2Val = '295';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.deepEqual(r, result2Val);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'mc_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'mc_getBalance');
                assert.deepEqual(second.params, ['0x0000000000000000000000000000000000000005', 'latest']);
            });

            var batch = new chain3.BatchRequest();
            batch.add(chain3.mc.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(chain3.mc.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
            batch.execute();
        });

        it('should execute batch request for async properties', function (done) {

            var provider = new FakeIpcProvider();
            var chain3 = new Chain3(provider);

            var result = [];
            var result2 = '0xb';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.isArray(result, r);
		done();
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.equal(r, 11);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'mc_accounts');
                assert.deepEqual(first.params, []);
                //assert.equal(second.method, 'shh_post');
                //assert.deepEqual(second.params, [{}]);
            });

            var batch = new chain3.BatchRequest();
            batch.add(chain3.mc.getAccounts.request(callback));
            //batch.add(chain3.shh.post.request({}, callback2));
            batch.execute();
        });

        it('should execute batch request with contract', function (done) {

            var provider = new FakeIpcProvider();
            var chain3 = new Chain3(provider);

            var abi = [{
                "name": "balance",
                "type": "function",
                "inputs": [{
                    "name": "who",
                    "type": "address"
                }],
                "constant": true,
                "outputs": [{
                    "name": "value",
                    "type": "uint256"
                }]
            }];


            var address = '0x1000000000000000000000000000000000000001';
            var result = '0x126';
            var resultVal = '294';
            var result2 = '0x0000000000000000000000000000000000000000000000000000000000000123';
            var result2Val = '291';

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.deepEqual(r, result2Val);
            };

            var callback3 = function (err, r) {
                counter++;
                assert.equal(counter, 2);
                assert.deepEqual(r, result2Val);
                done();
            };

            provider.injectValidation(function (payload) {


                assert.equal(payload[0].method, 'mc_getBalance');
                assert.deepEqual(payload[0].params, ['0x0000000000000000000000000000000000000022', 'latest']);

                assert.equal(payload[1].method, 'mc_call');
                assert.deepEqual(payload[1].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    'latest' // default block
                ]);

                assert.equal(payload[2].method, 'mc_call');
                assert.deepEqual(payload[2].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'from': '0x1000000000000000000000000000000000000002',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    'latest' // default block
                ]);

                assert.equal(payload[3].method, 'mc_call');
                assert.deepEqual(payload[3].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'from': '0x1000000000000000000000000000000000000003',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    '0xa' // default block
                ]);

                assert.equal(payload[4].method, 'mc_call');
                assert.deepEqual(payload[4].params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                    '0xa' // default block
                ]);
            });


            var batch = new chain3.BatchRequest();
            batch.add(chain3.mc.getBalance.request('0x0000000000000000000000000000000000000022', 'latest', callback));
            batch.add(new chain3.mc.Contract(abi, address).methods.balance(address).call.request(callback2));
            batch.add(new chain3.mc.Contract(abi, address).methods.balance(address).call.request({from: '0x1000000000000000000000000000000000000002'}, callback2));
            batch.add(new chain3.mc.Contract(abi, address).methods.balance(address).call.request({from: '0x1000000000000000000000000000000000000003'}, 10, callback2));
            batch.add(new chain3.mc.Contract(abi, address).methods.balance(address).call.request(10, callback3));
            provider.injectBatchResults([result, result2, result2, result2, result2]);
            batch.execute();
        });

        it('should execute batch requests and receive errors', function (done) {

            var provider = new FakeIpcProvider();
            var chain3 = new Chain3(provider);

            var abi = [{
                "name": "balance",
                "type": "function",
                "inputs": [{
                    "name": "who",
                    "type": "address"
                }],
                "constant": true,
                "outputs": [{
                    "name": "value",
                    "type": "uint256"
                }]
            }];


            var address = '0x1000000000000000000000000000000000000001';
            var result = 'Something went wrong';
            var result2 = 'Something went wrong 2';


            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.isNotNull(err);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
                assert.isNotNull(err);
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'mc_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'mc_call');
                assert.deepEqual(second.params, [{
                    'to': '0x1000000000000000000000000000000000000001',
                    'from': '0x0000000000000000000000000000000000000000',
                    'data': '0xe3d670d70000000000000000000000001000000000000000000000000000000000000001'
                },
                '0xa']);
            });

            var batch = new chain3.BatchRequest();
            batch.add(chain3.mc.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(new chain3.mc.Contract(abi, address).methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}, 10, callback2));
            provider.injectBatchResults([result, result2], true); // injects error
            batch.execute();
        });

        it('should propagate output formatter error to callback', function(done) {
            const provider = new FakeIpcProvider();
            const chain3 = new Chain3(provider);

            const abi = [{
                name: 'symbol',
                type: 'function',
                inputs: [],
                constant: true,
                outputs: [{
                    name: 'symbol',
                    type: 'string'
                }]
            }];

            const address = '0x1000000000000000000000000000000000000001';
            const result = '0x0000000000000000000000000000000000000000000000000000000000000123';

            const callback = (err, _r) => {
                assert.isNotNull(err);
                done();
            };

            provider.injectValidation((payload) => {
                assert.equal(payload[0].method, 'mc_call');
                assert.deepEqual(payload[0].params, [{
                    to: '0x1000000000000000000000000000000000000001',
                    data: '0x95d89b41'
                },
                'latest']);
            });
            const batch = new chain3.BatchRequest();
            batch.add(new chain3.mc.Contract(abi, address)
                .methods.symbol()
                .call.request(callback));
            provider.injectBatchResults([result]); // no explicit error, it'll be thrown when formatting
            batch.execute();
        });

        it('should execute batch request with provider that supports sendAsync', function (done) {

            var provider = new FakeIpcProvider();
            var chain3 = new Chain3(provider);

            provider.sendAsync = provider.send
            provider.send = () => { throw new Error('send was called instead of sendAsync') }
            var result = '0x126';
            var resultVal = '294';
            var result2 = '0x127';
            var result2Val = '295';
            provider.injectBatchResults([result, result2]);

            var counter = 0;
            var callback = function (err, r) {
                counter++;
                assert.deepEqual(r, resultVal);
            };

            var callback2 = function (err, r) {
                assert.equal(counter, 1);
		console.log('test batch,callback2,counter:'+counter+',r:'+r);
                assert.deepEqual(r, result2Val);
		console.log('test batch ,will done');
                done();
            };

            provider.injectValidation(function (payload) {
                var first = payload[0];
                var second = payload[1];

                assert.equal(first.method, 'mc_getBalance');
                assert.deepEqual(first.params, ['0x0000000000000000000000000000000000000000', 'latest']);
                assert.equal(second.method, 'mc_getBalance');
                assert.deepEqual(second.params, ['0x0000000000000000000000000000000000000005', 'latest']);
            });

            var batch = new chain3.BatchRequest();	    
            batch.add(chain3.mc.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
            batch.add(chain3.mc.getBalance.request('0x0000000000000000000000000000000000000005', 'latest', callback2));
            batch.execute();
        });

    });
});
