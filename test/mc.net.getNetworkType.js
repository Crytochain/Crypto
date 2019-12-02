var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeIpcProvider');
var Chain3 = require('../packages/chain3');

var tests = [{
    hash: '0x6b9661646439fab926ffc9bccdf3abb572d5209ae59e3390abf76aee4e2d49cd',
    id: 99,
    result: 'main'
},{
    hash: '0xb44f499ad420fbba3d4a7e05e9485cddc0e70e3e3622919a5d945e9ed4f7699c',
    id: 101,
    result: 'testnet'
},{
    hash: '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'private'
},{
    hash: '0xb44f499ad420fbba3d4a7e05e9485cddc0e70e3e3622919a5d945e9ed4f7699c',
    id: 42,
    result: 'private'
},{
    hash: '0xffe56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    id: 1,
    result: 'private'
},{
    hash: '0x6b9661646439fab926ffc9bccdf3abb572d5209ae59e3390abf76aee4e2d49cd',
    id: 42,
    result: 'private'
}]

describe('getNetworkType', function () {
    tests.forEach(function (test) {
        it('should detect the '+ test.result +' net', function (done) {
            var provider = new FakeHttpProvider();
            var chain3 = new Chain3(provider);

            provider.injectResult(test.id);
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'net_version');
                assert.deepEqual(payload.params, []);
            });

            provider.injectResult({
                hash: test.hash,
                blockNumber: '0x0'
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_getBlockByNumber');
                assert.deepEqual(payload.params, ['0x0', false]);
            });

            chain3.mc.net.getNetworkType()
            .then(function(res) {
                assert.equal(res, test.result);
                done();
            })
            .catch(function (err) {
                throw err;
                done();
            });
        });
    });
});
