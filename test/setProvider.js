var FakeIpcProvider = require('./helpers/FakeIpcProvider');
var FakeHttpProvider = require('./helpers/FakeHttpProvider');

// // set the etheeumProvider
// var provider1 = new FakeHttpProvider();
// var provider2 = new FakeIpcProvider();
// provider1.bzz = 'http://givenProvider:8500';
// provider2.bzz = 'http://swarm-gateways.net';
//
// if (typeof window !== 'undefined') {
//     global.ethereumProvider = provider1;
// }
// if (typeof window !== 'undefined') {
//     window.ethereumProvider = provider1;
// }


var chai = require('chai');
var assert = chai.assert;
var Chain3 = require('../packages/chain3');
var Mc = require('../packages/chain3-mc');
//var Shh = require('../packages/web3-shh');
var Personal = require('web3-eth-personal');
var Accounts = require('../packages/chain3-mc-accounts');
var Contract = require('../packages/chain3-mc-contract');
var Net = require('web3-net');
//var Bzz = require('../packages/web3-bzz');


var tests = [{
    Lib: Chain3
},{
    Lib: Mc
}/*,{
    Lib: Shh
}*/,{
    Lib: Personal
},{
    Lib: Net
},{
    Lib: Accounts
}/*,{
    Lib: Bzz,
    swarm: true
}*/];



describe('lib/chain3/setProvider', function () {
    it('Chain3 submodules should set the provider using constructor', function () {

        var provider1 = new FakeHttpProvider();
        var provider2 = new FakeIpcProvider();
        //provider1.bzz = 'http://localhost:8500';
        //provider2.bzz = 'http://swarm-gateways.net';

        var provider3 = new FakeHttpProvider();
        //provider3.bzz = 'http://localhost2:8500';

        var lib = new Chain3(provider1);
        var lib2 = new Chain3(provider3);

        assert.equal(lib.mc.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.net.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.personal.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.Contract.currentProvider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.accounts.currentProvider.constructor.name, provider1.constructor.name);
        //assert.equal(lib.shh.currentProvider.constructor.name, provider1.constructor.name);
        //assert.equal(lib.bzz.currentProvider, provider1.bzz);

        assert.equal(lib.mc._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.net._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.personal._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.Contract._requestManager.provider.constructor.name, provider1.constructor.name);
        assert.equal(lib.mc.accounts._requestManager.provider.constructor.name, provider1.constructor.name);
        //assert.equal(lib.shh._requestManager.provider.constructor.name, provider1.constructor.name);

        assert.equal(lib2.mc.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.net.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.personal.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.Contract.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.accounts.currentProvider.constructor.name, provider3.constructor.name);
        //assert.equal(lib2.shh.currentProvider.constructor.name, provider3.constructor.name);
        //assert.equal(lib2.bzz.currentProvider, provider3.bzz);

        assert.equal(lib2.mc._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.net._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.personal._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.Contract._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.accounts._requestManager.provider.constructor.name, provider3.constructor.name);
        //assert.equal(lib2.shh._requestManager.provider.constructor.name, provider3.constructor.name);


        lib.setProvider(provider2);

        assert.equal(lib.mc.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.net.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.personal.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.Contract.currentProvider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.accounts.currentProvider.constructor.name, provider2.constructor.name);
        //assert.equal(lib.shh.currentProvider.constructor.name, provider2.constructor.name);
        //assert.equal(lib.bzz.currentProvider, provider2.bzz);

        assert.equal(lib.mc._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.net._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.personal._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.Contract._requestManager.provider.constructor.name, provider2.constructor.name);
        assert.equal(lib.mc.accounts._requestManager.provider.constructor.name, provider2.constructor.name);
        //assert.equal(lib.shh._requestManager.provider.constructor.name, provider2.constructor.name);

        assert.equal(lib2.mc.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.net.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.personal.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.Contract.currentProvider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.accounts.currentProvider.constructor.name, provider3.constructor.name);
        //assert.equal(lib2.shh.currentProvider.constructor.name, provider3.constructor.name);
        //assert.equal(lib2.bzz.currentProvider, provider3.bzz);

        assert.equal(lib2.mc._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.net._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.personal._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.Contract._requestManager.provider.constructor.name, provider3.constructor.name);
        assert.equal(lib2.mc.accounts._requestManager.provider.constructor.name, provider3.constructor.name);
        //assert.equal(lib2.shh._requestManager.provider.constructor.name, provider3.constructor.name);


    });

    it('Bzz should set automatically to ethereumProvider', function () {

        var provider1 = new FakeHttpProvider();
        provider1.bzz = 'http://localhost:8500';
        var provider2 = new FakeIpcProvider();
        provider2.bzz = 'http://focalhost:8500';

        // was set in test/1_givenProvider-ethereumProvider.js
        //var lib = new Bzz(provider1);

        //assert.equal(lib.currentProvider, provider1.bzz);


        //lib.setProvider(provider2);

        //assert.equal(lib.currentProvider, provider2.bzz);


    });

    tests.forEach(function (test) {
        it(test.Lib.name +' should set the provider using constructor', function () {

            var provider1 = new FakeHttpProvider();
            var lib;


            if(test.swarm) {

                lib = new test.Lib('http://localhost:8500');

                assert.equal(lib.currentProvider, 'http://localhost:8500');

            } else {

                lib = new test.Lib(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }

        });
        it(test.Lib.name +' should set the provider using setProvider, after empty init', function () {

            var provider1 = new FakeHttpProvider();
            var lib = new test.Lib();



            if(test.swarm) {

                assert.isNull(lib.currentProvider);

                lib.setProvider('http://localhost:8500');

                assert.equal(lib.currentProvider, 'http://localhost:8500');

            } else {

                assert.isNull(lib.currentProvider);
                assert.isNull(lib._requestManager.provider);

                lib.setProvider(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }

        });
        it(test.Lib.name +' should set the provider using constructor, and change later using setProvider', function () {

            var provider1 = new FakeHttpProvider();
            var provider2 = new FakeIpcProvider();
            var swarmProvider1 = 'http://localhost:8500';
            var swarmProvider2 = 'http://swarm-gateways.net';

            var lib;


            if(test.swarm) {

                lib = new test.Lib(swarmProvider1);

                assert.equal(lib.currentProvider, swarmProvider1);

                lib.setProvider(swarmProvider2);

                assert.equal(lib.currentProvider, swarmProvider2);

                lib.setProvider(swarmProvider1);

                assert.equal(lib.currentProvider, swarmProvider1);

            } else {

                lib = new test.Lib(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);

                lib.setProvider(provider2);

                assert.equal(lib.currentProvider.constructor.name, provider2.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider2.constructor.name);

                lib.setProvider(provider1);

                assert.equal(lib.currentProvider.constructor.name, provider1.constructor.name);
                assert.equal(lib._requestManager.provider.constructor.name, provider1.constructor.name);
            }

        });
    });


});

