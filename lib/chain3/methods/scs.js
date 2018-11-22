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
/** @file scs.js
 * process RPC commands to SCS monitors
 * @authors:
 * @MOAC lab
 * @date 2018
 * Methods supported by SCSserver:
 * getScsId
 * getMicroChainList
 * getNonce
 * getBlockNumber
 * getBlock
 * getBalance
 * setDappAbi
 */

var formatters = require('../formatters');
var Method = require('../method');
var utils = require('../../utils/utils');
var Property = require('../property');
// var Dapp = require('../dapp');
var c = require('../../utils/config');//for MicroChain address

// SCS object
var Scs = function (chain3) {
    this._requestManager = chain3._scsRequestManager;

    var self = this;

    properties().forEach(function(p) { 
        p.attachToObject(self);
        p.setRequestManager(chain3._scsRequestManager);
    });

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(chain3._scsRequestManager);
    });

};

// SCSID
// 
/// @returns an objects describing chain3.scs properties
var properties = function () {
    return [
        new Property({
            name: 'listening',
            getter: 'scs_listening'
        })
    ];
};

Object.defineProperty(Scs.prototype, 'defaultAddress', {
    get: function () {
        return c.defaultSCSId;
    },
    set: function (val) {
        c.defaultSCSId = val;
        return val;
    }
});

var methods = function() {

    // Return the nonce of the account in the MicroChain.
    var getNonce = new Method({
        name: 'getNonce',
        call: 'scs_getNonce',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputAddressFormatter],
        outputFormatter: utils.toDecimal
    });

    // Return the SCS id, this is not the beneficial address, but the add to identify the SCS
    // in the MOAC network.
    var getSCSId = new Method({
        name: 'getSCSId',
        call: 'scs_getSCSId',
        params: 0
    });

    //check the data dir of the SCS storage
    var getDatadir = new Method({
        name: 'getDatadir',
        call: 'scs_datadir',
        params: 0
    });

    //display the protocol version info
    var protocolVersion = new Method({
        name: 'protocolVersion',
        call: 'scs_protocolVersion',
        params: 0
    });

    // Display the microChain list on the SCS
    var getMicroChainList = new Method({
        name: 'getMicroChainList',
        call: 'scs_getMicroChainList',
        params: 0
    });

    // Display the microChain list on the SCS
    var getMicroChainInfo = new Method({
        name: 'getMicroChainInfo',
        call: 'scs_getMicroChainInfo',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter]
    });

    // call the DAPP function and return the data
    var getDappState = new Method({
        name: 'getDappState',
        call: 'scs_getDappState',
        params: 1
        // inputFormatter: formatters.inputAddressFormatter
    });


    // Get the block number of the MicroChain
    var getBlockNumber = new Method({
        name: 'getBlockNumber',
        call: 'scs_getBlockNumber',
        params: 1,
        inputFormatter: [formatters.inputAddressFormatter],
        outputFormatter: utils.toDecimal
    });

    // call the DAPP function and return the data
    var getBlock = new Method({
        name: 'getBlock',
        call: 'scs_getBlock',
        params: 2,
        inputFormatter: [formatters.inputAddressFormatter, formatters.inputDefaultBlockNumberFormatter],
        outputFormatter: formatters.outputBlockFormatter
    });

    // get the balance of the MicroChain token
    // for the account.
    // If the MicroChain is a non-token chain,
    // this always returns 0
    var getBalance = new Method({
        name: 'getBalance',
        call: 'scs_getBalance',
        params: 2
    });

    // call the DAPP function using input data 
    // This only returns the constant views
    // TODO
    var directCall = new Method({
        name: 'directCall',
        call: 'scs_directCall',
        params: 1,
        inputFormatter: [formatters.inputTransactionFormatter]
    });

    // Return the transaction info from the MicroChain
    var getTransaction = new Method({
        name: 'getTransaction',
        call: 'scs_getTransaction',
        params: 2,
        outputFormatter: formatters.outputTransactionFormatter 
    });

    // Return the transaction Receipt 

    var getTransactionReceipt = new Method({
    name: 'getTransactionReceipt',
    call: 'scs_getTransactionReceipt',
    params: 2,
    outputFormatter: formatters.outputTransactionFormatter
    });

    return [
    getNonce,
    getSCSId,
    getDatadir,
    protocolVersion,
    getDappState,
    getMicroChainList,
    getMicroChainInfo,
    getBlockNumber,
    getBlock,
    getBalance,
    getTransaction,
    getTransactionReceipt,
    directCall
    ];
}

/*
 * Init the MicroChain Dapp 
*/
// Scs.prototype.dapp = function (abi) {
//     var factory = new Dapp(this, abi);
//     return factory;
// };

//TODO, not working, need to add watches.scs package
// Scs.prototype.filter = function (options, callback, filterCreationErrorCallback) {
//     return new Filter(options, 'scs', this._requestManager, watches.mc(), formatters.outputLogFormatter, callback, filterCreationErrorCallback);
// };

module.exports = Scs;
