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
 * ScsRPCMethod
 * GetScsId
 * GetNonce
 * GetData(abandon)
 * GetContractInfo
 * GetBlockNumber
 * GetBlock
 * PublicCall
 * GetBalance
 */

var formatters = require('../formatters');
var Method = require('../method');
var utils = require('../../utils/utils');
var Property = require('../property');
var c = require('../../utils/config');//for MicroChain address

var Scs = function (chain3) {
    this._requestManager = chain3._requestManager;

    var self = this;

    properties().forEach(function(p) { 
        p.attachToObject(self);
        p.setRequestManager(chain3._requestManager);
    });

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(chain3._requestManager);
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
        return c.defaultMicroChainAddress;
    },
    set: function (val) {
        c.defaultMicroChainAddress = val;
        return val;
    }
});

var methods = function() {
    var getScsId = new Method({
        name: 'getScsId',
        call: 'scs_getScsId',
        params: 0,
        outputFormatter: formatters.outputVnodesFormatter
    });

    var getNonce = new Method({
        name: 'getNonce',
        call: 'scs_getNonce',
        params: 0,
        outputFormatter: utils.toDecimal
    });

    // call the DAPP function and return the data
    // abandon
    // var getData = new Method({
    //     name: 'getData',
    //     call: 'scs_getData',
    //     params: 0
    // });

    var getSCSId = new Method({
        name: 'getSCSId',
        call: 'scs_getSCSId',
        params: 0
    });

    var getDatadir = new Method({
        name: 'getDatadir',
        call: 'scs_datadir',
        params: 0
    });

    var protocolVersion = new Method({
        name: 'protocolVersion',
        call: 'scs_protocolVersion',
        params: 0
    });

    // call the DAPP function and return the data
    var getDappState = new Method({
        name: 'getDappState',
        call: 'scs_getDappState',
        params: 0
    });

    // call the DAPP function and return the data
    var getContractInfo = new Method({
        name: 'getContractInfo',
        call: 'scs_getContractInfo',
        params: 0
    });

    // Get the 
    var getBlockNumber = new Method({
        name: 'getBlockNumber',
        call: 'scs_getBlockNumber',
        params: 0,
        outputFormatter: utils.toDecimal
    });

    // call the DAPP function and return the data
    var getBlock = new Method({
        name: 'getBlock',
        call: 'scs_getBlock',
        params: 2,
        inputFormatter: [formatters.inputBlockNumberFormatter, function (val) { return !!val; }],
        outputFormatter: formatters.outputBlockFormatter
    });

    return [
    getScsId,
    getNonce,
    getSCSId,
    getDatadir,
    protocolVersion,
    getDappState,
    getContractInfo,
    getBlockNumber,
    getBlock
    ];
}

module.exports = Scs;
