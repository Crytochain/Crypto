var chai = require('chai');
var assert = chai.assert; 
var Chain3 = require('../index.js');
var chain3 = new Chain3();
var u = require('./helpers/test.utils.js');

describe('chain3.mc', function() {
    describe('methods', function() {
        u.methodExists(chain3.mc, 'getBalance');
        u.methodExists(chain3.mc, 'getStorageAt');
        u.methodExists(chain3.mc, 'getTransactionCount');
        u.methodExists(chain3.mc, 'getCode');
        u.methodExists(chain3.mc, 'sendTransaction');
        u.methodExists(chain3.mc, 'call');
        u.methodExists(chain3.mc, 'getBlock');
        u.methodExists(chain3.mc, 'getTransaction');
        u.methodExists(chain3.mc, 'getUncle');
        u.methodExists(chain3.mc, 'getCompilers');
        u.methodExists(chain3.mc.compile, 'lll');
        u.methodExists(chain3.mc.compile, 'solidity');
        u.methodExists(chain3.mc.compile, 'serpent');
        u.methodExists(chain3.mc, 'getBlockTransactionCount');
        u.methodExists(chain3.mc, 'getBlockUncleCount');
        u.methodExists(chain3.mc, 'filter');
        u.methodExists(chain3.mc, 'contract');
        u.methodExists(chain3, 'encodeParam');
        u.methodExists(chain3, 'fromMoacAddress');

        u.propertyExists(chain3.mc, 'coinbase');
        u.propertyExists(chain3.mc, 'mining');
        u.propertyExists(chain3.mc, 'gasPrice');
        u.propertyExists(chain3.mc, 'accounts');
        u.propertyExists(chain3.mc, 'defaultBlock');
        u.propertyExists(chain3.mc, 'blockNumber');
        u.propertyExists(chain3.mc, 'protocolVersion');

        
    });
});

