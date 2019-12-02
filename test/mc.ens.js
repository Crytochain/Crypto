var chai = require('chai');
var assert = chai.assert;
var FakeHttpProvider = require('./helpers/FakeHttpProvider');
var Chain3 = require('../packages/chain3');
var sha3 = require('../packages/chain3-utils').sha3;
//var sha3 = require('web3-utils').sha3;
var asciiToHex = require('../packages/chain3-utils').asciiToHex;
//var asciiToHex = require('web3-utils').asciiToHex;

describe('ens', function () {
    var provider;
    var chain3;

    describe('in normal operation', function () {
        beforeEach(function () {
            provider = new FakeHttpProvider();
            chain3 = new Chain3(provider);

            provider.injectResult({
                timestamp: Math.floor(new Date() / 1000) - 60,
            });
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_getBlockByNumber');
                assert.deepEqual(payload.params, ['latest', false]);
            });

            provider.injectResult(99);
            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'net_version');
                assert.deepEqual(payload.params, []);
            });

            provider.injectResult({
                hash: '0x6b9661646439fab926ffc9bccdf3abb572d5209ae59e3390abf76aee4e2d49cd',
                blockNumber: '0x0'
            });

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_getBlockByNumber');
                assert.deepEqual(payload.params, ['0x0', false]);
            });
        });

        it('should return the owner record for a name', function (done) {
            var signature = 'owner(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            chain3.mc.ens.registry.owner('foobar.mc').then(function (owner) {
                assert.equal(owner, '0x0123456701234567012345670123456701234567');
                done();
            }).catch(function (err) {
                throw err;
            });

        });

        it('should fetch the resolver for a name', function (done) {
            var signature = 'resolver(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(signature).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            chain3.mc.ens.registry.resolver('foobar.mc').then(function (resolver) {
                assert.equal(resolver.options.address, '0x0123456701234567012345670123456701234567');
                done();
            }).catch(function (err) {
                throw err;
            });
        });

        it('should return the addr record for a name', function (done) {
            var resolverSig = 'resolver(bytes32)';
            var addrSig = 'addr(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(resolverSig).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(addrSig).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000001234567012345670123456701234567012345670');

            chain3.mc.ens.getAddress('foobar.mc').then(function (addr) {
                assert.equal(addr, '0x1234567012345670123456701234567012345670');
                done();
            }).catch(function (err) {
                throw err;
            });
        });

        it('should return x and y from an public key for en specific ens name', function (done) {
            var resolverSignature = 'resolver(bytes32)';
            var pubkeySignature = 'pubkey(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(resolverSignature).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(pubkeySignature).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });

            var pubkeyCoordinateAsHex = asciiToHex('0x0000000000000000000000000000000000000000000000000000000000000000');
            provider.injectResult([
                pubkeyCoordinateAsHex,
                pubkeyCoordinateAsHex
            ]);

            chain3.mc.ens.getPubkey('foobar.mc').then(function (result) {
                assert.equal(result[0][0], '0x3078303030303030303030303030303030303030303030303030303030303030');
                assert.equal(result[0][1], '0x3030303030303030303030303030303030303030303030303030303030303030');
                done();
            });
        });

        it('should get the content of an resolver', function (done) {
            var resolverSignature = 'resolver(bytes32)';
            var contentSignature = 'content(bytes32)';

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(resolverSignature).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x314159265dd8dbb310642f98f50c066173c1259b',
                }, 'latest']);
            });
            provider.injectResult('0x0000000000000000000000000123456701234567012345670123456701234567');

            provider.injectValidation(function (payload) {
                assert.equal(payload.jsonrpc, '2.0');
                assert.equal(payload.method, 'mc_call');
                assert.deepEqual(payload.params, [{
                    data: sha3(contentSignature).slice(0, 10) + 'dd41feaba9cdd5a731c64d3b1220af5c963a2824de0018475995d1f5b7527cac',
                    to: '0x0123456701234567012345670123456701234567',
                }, 'latest']);
            });

            provider.injectResult('0x0000000000000000000000000000000000000000000000000000000000000000');

            chain3.mc.ens.getContent('foobar.mc').then(function (result) {
                assert.equal(result, '0x0000000000000000000000000000000000000000000000000000000000000000');
                done();
            });
        });
    });


    it("won't resolve on an unknown network", function (done) {
        provider = new FakeHttpProvider();
        chain3 = new Chain3(provider);

        provider.injectResult({
            timestamp: Math.floor(new Date() / 1000) - 60,
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'mc_getBlockByNumber');
            assert.deepEqual(payload.params, ['latest', false]);
        });

        provider.injectResult(1);
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'net_version');
            assert.deepEqual(payload.params, []);
        });

        provider.injectResult({
            hash: '0x0123456701234567012345670123456701234567012345670123456701234567',
            blockNumber: '0x0'
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'mc_getBlockByNumber');
            assert.deepEqual(payload.params, ['0x0', false]);
        });

        chain3.mc.ens.getAddress('foobar.mc').then(function () {
            assert.isTrue(false, 'Should throw error');
            done();
        }).catch(function (e) {
            assert.isTrue(e instanceof Error, 'Should throw error');
            done();
        });
    });

    it("won't resolve when out of date", function (done) {
        provider = new FakeHttpProvider();
        chain3 = new Chain3(provider);

        provider.injectResult({
            timestamp: Math.floor(new Date() / 1000) - 3660,
        });
        provider.injectValidation(function (payload) {
            assert.equal(payload.jsonrpc, '2.0');
            assert.equal(payload.method, 'mc_getBlockByNumber');
            assert.deepEqual(payload.params, ['latest', false]);
        });

        chain3.mc.ens.getAddress('foobar.mc').then(function () {
            assert.isTrue(false, 'Should throw error');
            done();
        }).catch(function (e) {
            assert.isTrue(e instanceof Error, 'Should throw error');
            done();
        });
    });
});
