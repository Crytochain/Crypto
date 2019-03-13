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
 * @file microbase.js
 * @MOAC tech 
 * @date 2019
 * @provide access to MOAC microChain dappBase constant to deploy the 
 *  dapp contractsfunctions and variables.
 * @ Used with MOAC v1.0.8 with multiChain support 
*/

var ABIs = require('./microconstants');

/**
 * For microChain only, 
 * @method Contract
 * @param {obj} mc, VNODE manager
 * @param {Array} abi, interface
 * @param {Address} microChain address
 */
var MicrochainBase = function (mc, abi, address) {
    this._mc = mc;
    this.transactionHash = null;
    this.address = address;
    this.abi = abi;
};

/**
 * Should be called to create new Dapp on the MicroChain
 * contract instance, 
 * 
 *
 * @method DappBase
 * @param {Array} abi
 * @param {Address} contract address
 */
var DappBase = function (mc, scs, inAbi, inAddress, viaAddress) {
    this._mc = mc; //vnode server to sendTransaction
    this._scs = scs;  //SCS server to sendCall
    this.transactionHash = null;// This is needed to check if the Dapp is deploy or not, note this is different from MicroChain HASH
    this.address = inAddress; //MicroChain address
    this.baseAddress = null;// dappbase address, this need to be extracted using MicroChain address
    this.dappAddress = null;// dapp address, need to be registered with dappbase
    this.abi = inAbi;
    this.via = viaAddress;
};


/**
 * Should be called to create new Dapp 
 * contract instance, 
 * only support two internal abi structures
 * 
 * @method Contract
 * @param {Array} abi
 * @param {Address} contract address
 */
var MicroDapp = function (mc, scs, inABI, inAddress, viaAddress) {

    this.abi = inABI;

    this._mc = mc; //vnode server to sendTransaction
    this._scs = scs;  //SCS server to sendCall
    this.transactionHash = null;// This is needed to check if the Dapp is deploy or not, note this is different from MicroChain HASH
    this.address = inAddress; //MicroChain address
    this.baseAddress = null;// dappbase address, this need to be extracted using MicroChain address
    this.dappAddress = null;// dapp address, need to be registered with dappbase
    this.baseAbi = ABIs.dappBaseABI;
    this.via = viaAddress;
};

module.exports = {
    MicroDapp: MicroDapp,
    DappBase: DappBase,
    MicrochainBase:MicrochainBase
}