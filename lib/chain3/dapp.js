/*
    This file is part of chain3.js.

    chain3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    chain3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with chain3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file dapp.js
 * @author zhengpeng li <zhengpeng.li@moac.io>
 * @date 2018
 * @provide access to MOAC microChain dapps public functions and variables.
 */

var utils = require('../utils/utils');
var coder = require('../solidity/coder');
var SolidityEvent = require('./event');
var DappFunction = require('./dappfunction');
var AllEvents = require('./allevents');

/**
 * Should be called to encode constructor params
 *
 * @method encodeConstructorParams
 * @param {Array} abi
 * @param {Array} constructor params
 */
var encodeConstructorParams = function (abi, params) {
    return abi.filter(function (json) {
        return json.type === 'constructor' && json.inputs.length === params.length;
    }).map(function (json) {
        return json.inputs.map(function (input) {
            return input.type;
        });
    }).map(function (types) {
        return coder.encodeParams(types, params);
    })[0] || '';
};

/**
 * Should be called to add functions to Dapp object
 *
 * @method addDappFunctions
 * @param {Contract} contract
 * @param {Array} abi
 */
var addDappFunctions = function (mcdapp) {
    // contract.abi.filter(function (json) {
    mcdapp.abi.filter(function (json) {    
        return json.type === 'function';
    }).map(function (json) {
        return new DappFunction(mcdapp._mc, mcdapp._scs, json, mcdapp.address);
    }).forEach(function (f) {
        f.attachToDapp(mcdapp);
    });
};

/**
 * Should be called to add events to Dapp object
 *
 * @method addDappEvents
 * @param {Contract} contract
 * @param {Array} abi
 */
var addDappEvents = function (contract) {
    var events = contract.abi.filter(function (json) {
        return json.type === 'event';
    });

    var All = new AllEvents(contract._scs._requestManager, events, contract.address);
    All.attachToContract(contract);

    events.map(function (json) {
        return new SolidityEvent(contract._scs._requestManager, json, contract.address);
    }).forEach(function (e) {
        e.attachToContract(contract);
    });
};


/**
 * Should be called to check if the Dapp gets properly deployed.
 * This  on the MicroChain.
 *
 * @method checkForContractAddress
 * @param {Object} contract
 * @param {Function} callback
 * @returns {Undefined}
 */
var checkForMicroChainAddress = function(contract, callback){
    var count = 0,
        callbackFired = false;

    // wait for receipt
    var filter = contract._mc.filter('latest', function(e){
        if (!e && !callbackFired) {
            count++;

            // stop watching after 50 blocks (timeout)
            if (count > 50) {

                filter.stopWatching(function() {});
                callbackFired = true;

                if (callback)
                    callback(new Error('Dapp transaction couldn\'t be found after 50 blocks'));
                else
                    throw new Error('Dapp transaction couldn\'t be found after 50 blocks');


            } else {

                contract._mc.getTransactionReceipt(contract.transactionHash, function(e, receipt){
                    if(receipt && !callbackFired) {

                        contract._mc.getCode(receipt.contractAddress, function(e, code){
                            /*jshint maxcomplexity: 6 */

                            if(callbackFired || !code)
                                return;

                            filter.stopWatching(function() {});
                            callbackFired = true;

                            if(code.length > 3) {

                                // console.log('Contract code deployed!');

                                contract.address = receipt.contractAddress;

                                // attach events and methods again after we have
                                addDappFunctions(contract);
                                addDappEvents(contract);

                                // call callback for the second time
                                if(callback)
                                    callback(null, contract);

                            } else {
                                if(callback)
                                    callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));
                                else
                                    throw new Error('The contract code couldn\'t be stored, please check your gas amount.');
                            }
                        });
                    }
                });
            }
        }
    });
};

/**
 * Should be called to create new Dapp instance
 * on the MicroChain
 * This is similar to the ContractFactory
 * object for mc, but only keeps the call, 
 * no sendTransaction.
 * 
 * @method MicroChainDapp
 * @param {Array} abi
 */
var MicroChainDapp = function (mc, scs, abi) {
    this._mc = mc;
    this._scs = scs;
    this.abi = abi;

    /**
     * Should be called to create new Dapp on the MicroChain blockchain
     * Still need to test on the callback
     * 
     * @method new
     * @param {Any} contract constructor param1 (optional)
     * @param {Any} contract constructor param2 (optional)
     * @param {Object} contract transaction object (required)
     * @param {Function} callback
     * @returns {microchainDapp} returns microchain instance
     */
    this.new = function () {
        
        var mcDapp = new Dapp(this.mc, this.scs, this.abi);

        // parse arguments
        var options = {}; // required!
        var callback;

        var args = Array.prototype.slice.call(arguments);
        if (utils.isFunction(args[args.length - 1])) {
            callback = args.pop();
        }

        var last = args[args.length - 1];
        if (utils.isObject(last) && !utils.isArray(last)) {
            options = args.pop();
        }

        if (options.value > 0) {
            var constructorAbi = abi.filter(function (json) {
                return json.type === 'constructor' && json.inputs.length === args.length;
            })[0] || {};

            if (!constructorAbi.payable) {
                throw new Error('Cannot send value to non-payable constructor');
            }
        }

        var bytes = encodeConstructorParams(this.abi, args);
        options.data += bytes;

//TODO remove for MicroChain DAPPs, 
//All transaction should send to VNODE
        if (callback) {

            // wait for the mcDapp address adn check if the code was deployed
            this._mc.sendTransaction(options, function (err, hash) {
                if (err) {
                    callback(err);
                } else {
                    // add the transaction hash
                    mcDapp.transactionHash = hash;

                    // call callback for the first time
                    callback(null, mcDapp);

                    checkForMicroChainAddress(mcDapp, callback);
                }
            });
        } else {
            var hash = this._mc.sendTransaction(options);
            // add the transaction hash
            mcDapp.transactionHash = hash;
            checkForMicroChainAddress(mcDapp);
        }

        return mcDapp;
    };

    this.new.getData = this.getData.bind(this);
};


/**
 * Should be called to get access to existing Dapp on the MicroChain
 *
 * @method at
 * @param {Address} MicroChain address (required)
 * @param {Function} callback {optional)
 * @returns {mcDapp} returns mcirochain Dapp if no callback was passed,
 * otherwise calls callback function (err, mcDapp)
 * Possible errors:
 * 
 */
MicroChainDapp.prototype.at = function (address, callback) {
    var mcDapp = new Dapp(this._mc, this._scs, this.abi, address);

    // this functions are not part of prototype,
    // because we dont want to spoil the interface
    addDappFunctions(mcDapp);
    addDappEvents(mcDapp);

    if (callback) {
        callback(null, mcDapp);
    }
    return mcDapp;
};

/**
 * Gets the data, which is data to deploy plus constructor params
 *
 * @method getData
 */
MicroChainDapp.prototype.getData = function () {
    var options = {}; // required!
    var args = Array.prototype.slice.call(arguments);

    var last = args[args.length - 1];
    if (utils.isObject(last) && !utils.isArray(last)) {
        options = args.pop();
    }

    var bytes = encodeConstructorParams(this.abi, args);
    options.data += bytes;

    return options.data;
};

/**
 * Should be called to create new Dapp on the MicroChaib
 * contract instance
 *
 * @method Contract
 * @param {Array} abi
 * @param {Address} contract address
 */
var Dapp = function (mc, scs, abi, address) {
    this._mc = mc; //vnode server to sendTransaction
    this._scs = scs;  //SCS server to sendCall
    this.transactionHash = null;//???May not be needed, be the hash for mcirochain deploy
    this.address = address; //MicroChain address
    this.abi = abi;
};

module.exports = MicroChainDapp;
