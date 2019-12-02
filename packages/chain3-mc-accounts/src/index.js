/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file accounts.js
 * @author Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2017
 */

"use strict";

var _ = require("underscore");
var core = require('web3-core'); 
var Method = require('../../chain3-core-method');
var Promise = require('any-promise');
var cryp = (typeof global === 'undefined') ? require('crypto-browserify') : require('crypto');
var scrypt = require('./scrypt');
var uuid = require('uuid');

var utils = require('../../chain3-utils');
var helpers = require('web3-core-helpers');
//
var Account = require("./account");
var Hash = require("./hash");
var RLP = require("./rlp");
var Bytes = require("./bytes");
var Nat = require("./nat");

var isNot = function(value) {
    return (_.isUndefined(value) || _.isNull(value));
};

var trimLeadingZero = function (hex) {
    while (hex && hex.startsWith('0x0')) {
        hex = '0x' + hex.slice(3);
    }
    return hex;
};

var makeEven = function (hex) {
    if(hex.length % 2 === 1) {
        hex = hex.replace('0x', '0x0');
    }
    return hex;
};


var Accounts = function Accounts() {
    var _this = this;

    // sets _requestmanager
    core.packageInit(this, arguments);

    // remove unecessary core functions
    delete this.BatchRequest;
    delete this.extend;

    var _moacCall = [
        new Method({
            name: 'getId',
            call: 'net_version',
            params: 0,
            outputFormatter: utils.hexToNumber
        }),
        new Method({
            name: 'getGasPrice',
            call: 'mc_gasPrice',
            params: 0
        }),
        new Method({
            name: 'getTransactionCount',
            call: 'mc_getTransactionCount',
            params: 2,
            inputFormatter: [function (address) {
                if (utils.isAddress(address)) {
                    return address;
                } else {
                    throw new Error('Address '+ address +' is not a valid address to get the "transactionCount".');
                }
            }, function () { return 'latest'; }]
        })
    ];
    // attach methods to this._moacCall
    this._moacCall = {};
    _.each(_moacCall, function (method) {
        method.attachToObject(_this._moacCall);
        method.setRequestManager(_this._requestManager);
    });


    this.wallet = new Wallet(this);
};

Accounts.prototype._addAccountFunctions = function (account) {
    var _this = this;

    // add sign functions
    account.signTransaction = function signTransaction(tx, callback) {
        return _this.signTransaction(tx, account.privateKey, callback);
    };
    account.sign = function sign(data) {
        return _this.sign(data, account.privateKey);
    };

    account.encrypt = function encrypt(password, options) {
        return _this.encrypt(account.privateKey, password, options);
    };


    return account;
};

Accounts.prototype.create = function create(entropy) {
    return this._addAccountFunctions(Account.create(entropy || utils.randomHex(32)));
};

Accounts.prototype.privateKeyToAccount = function privateKeyToAccount(privateKey) {
    return this._addAccountFunctions(Account.fromPrivate(privateKey));
};

/* 
 * A simple signTransaction function to sign
 * the input TX with private key.
 * Input:
 * tx - a JSON format object contains the input TX info
 * privateKey - a string format of the private key
 * Output:
 * rawTransaction - HEX String, can be used with 
 *                  mc.sendRawTransaction
 * 
 * 
 */
Accounts.prototype.signTransaction = function signTransaction(tx, privateKey, callback) {
    var _this = this,
        error = false,
        result;

    callback = callback || function () {};

    if (!tx) {
        error = new Error('No transaction object given!');

        callback(error);
        return Promise.reject(error);
    }

    function signed (tx) {

    // To be compatable with ethereum users, we check and 
    // make sure the gas can be used as gasLimit
        if (!tx.gas){
            //
            if (!tx.gasLimit){
                error = new Error('"gas" is missing');
            }else{
                if (tx.gasLimit > 0){
                tx.gas = tx.gasLimit
            }else{
                error = new Error('Gas or GasLimit is lower than 0');
            }

            }
            
        }

        if (tx.nonce  < 0 ||
            tx.gas  < 0 ||
            tx.gasPrice  < 0 ||
            tx.chainId  < 0) {
            error = new Error('Gas, gasPrice, nonce or chainId is lower than 0');
        }

        if (error) {
            callback(error);
            return Promise.reject(error);
        }

        //Sharding Flag can be 0, 1, 2
        //If input has not sharding flag, set it to 0 as global TX.
        if (tx.shardingFlag == undefined) {
            tx.shardingFlag = 0;
        }

        try {
            // note the MOAC tx object is different from Ethereum tx object
            // with extra fields
            // console.log("==========================================");
            // console.log("Before:", tx);
            tx = helpers.formatters.inputCallFormatter(tx);
// console.log("before:", tx);
// console.log("==========================================");
            var transaction = tx;
            transaction.to = tx.to || '0x';
            transaction.data = tx.data || '0x';
            transaction.value = tx.value || '0x';
            transaction.chainId = utils.numberToHex(tx.chainId);
            transaction.shardingFlag = utils.numberToHex(tx.shardingFlag);
            transaction.systemContract = '0x0'; //System contract flag, always = 0
            transaction.via = tx.via || '0x'; //vnode subchain address
// console.log("After:", transaction);
            //Encode the TX for signature
            //   type txdata struct {
            // AccountNonce uint64          `json:"nonce"    gencodec:"required"`
            // SystemContract uint64          `json:"syscnt" gencodec:"required"`
            // Price        *big.Int        `json:"gasPrice" gencodec:"required"`
            // GasLimit     *big.Int        `json:"gas"      gencodec:"required"`
            //   // nil means contract creation
            // Amount       *big.Int        `json:"value"    gencodec:"required"`
            // Payload      []byte          `json:"input"    gencodec:"required"`
            // ShardingFlag uint64 `json:"shardingFlag" gencodec:"required"`
            // Via            *common.Address `json:"to"       rlp:"nil"`

            // // Signature values
            // V *big.Int `json:"v" gencodec:"required"`
            // R *big.Int `json:"r" gencodec:"required"`
            // S *big.Int `json:"s" gencodec:"required"`

            var rlpEncoded = RLP.encode([
                Bytes.fromNat(transaction.nonce),
                Bytes.fromNat(transaction.systemContract),
                Bytes.fromNat(transaction.gasPrice),
                Bytes.fromNat(transaction.gas),
                transaction.to.toLowerCase(),
                Bytes.fromNat(transaction.value),
                Bytes.fromNat(transaction.data),
                Bytes.fromNat(transaction.shardingFlag),
                transaction.via.toLowerCase(),
                Bytes.fromNat(transaction.chainId || "0x1"), 
                "0x",
                "0x"]);

            var hash = Hash.keccak256(rlpEncoded);
    // for MOAC, keep 9 fields instead of 6
    var vPos = 9;

    //Sign the hash with the private key to produce the
    //V, R, S
    // var newsign = ecsign(hash, stripHexPrefix(privateKey));
    // var rawTx = RLP.decode(rlpEncoded).slice(0, vPos + 3);

    if (error) {
            callback(error);
            return Promise.reject(error);
    }

    var newsign = Account.makeSigner(Nat.toNumber(transaction.chainId || "0x1") * 2 + 35)(Hash.keccak256(rlpEncoded), privateKey);
// console.log("direct decode:", RLP.decode(rlpEncoded));
// console.log("==========================================");
    var rawTx = RLP.decode(rlpEncoded).slice(0, vPos).concat(Account.decodeSignature(newsign));    
// console.log("After RLP.DECODE:", rawTx);
// console.log("==========================================");
    //Replace the V field with chainID info
    var newV = newsign.v + 8 + transaction.chainId * 2;

    // // dont allow uneven r,s,v values
    // // there could be 0 when convert the buffer to HEX.
    // // In the RLP encoding/decoding rules, 
    // rawTx[vPos] = (makeEven(trimLeadingZero(bufferToHex(newV))));
    // rawTx[vPos + 1] = (makeEven(trimLeadingZero(bufferToHex(newsign.r))));
    // rawTx[vPos + 2] = (makeEven(trimLeadingZero(bufferToHex(newsign.s))));
    // note that the required sig needs certain length,
    // 
    console.log("rawTx[vPos+1]:", rawTx[vPos+1]);
    rawTx[vPos]  = makeEven(trimLeadingZero(rawTx[vPos]));                 
    rawTx[vPos+1]  = makeEven(trimLeadingZero(rawTx[vPos+1]));
    rawTx[vPos+2]  = makeEven(trimLeadingZero(rawTx[vPos+2]));


    var rawTransaction = RLP.encode(rawTx);

            var values = RLP.decode(rawTransaction);
            result = {
                messageHash: hash,
                v: trimLeadingZero(values[vPos]),
                r: trimLeadingZero(values[vPos+1]),
                s: trimLeadingZero(values[vPos+2]),
                rawTransaction: rawTransaction
            };

        } catch(e) {
            callback(e);
            return Promise.reject(e);
        }

        callback(null, result);
        return result;
    }

    // Resolve immediately if nonce, chainId and price are provided
    if (tx.nonce !== undefined && tx.chainId !== undefined && tx.gasPrice !== undefined) {
        console.log("Sign tx:", tx);
        return Promise.resolve(signed(tx));
    }

	//console.log('accounts,tx.gasLimit 5:'+tx.gasLimit);

    // Otherwise, get the missing info from the MOAC Vnode
    return Promise.all([
        isNot(tx.chainId) ? _this._moacCall.getId() : tx.chainId,
        isNot(tx.gasPrice) ? _this._moacCall.getGasPrice() : tx.gasPrice,
        isNot(tx.nonce) ? _this._moacCall.getTransactionCount(_this.privateKeyToAccount(privateKey).address) : tx.nonce
    ]).then(function (args) {
        if (isNot(args[0]) || isNot(args[1]) || isNot(args[2])) {
            throw new Error('One of the values "chainId", "gasPrice", or "nonce" couldn\'t be fetched: '+ JSON.stringify(args));
        }
        return signed(_.extend(tx, {chainId: args[0], gasPrice: args[1], nonce: args[2]}));
    });
};

/* jshint ignore:start */
Accounts.prototype.recoverTransaction = function recoverTransaction(rawTx) {
    var values = RLP.decode(rawTx);
    //Note the rawTx in MOAC has three more fields than Ethereum
    // for MOAC, keep 9 fields instead of 6
    var vPos = 9;
    var signature = Account.encodeSignature(values.slice(vPos,vPos+3));
    var recovery = Bytes.toNumber(values[vPos]);
    var extraData = recovery < 35 ? [] : [Bytes.fromNumber((recovery - 35) >> 1), "0x", "0x"];
    var signingData = values.slice(0,vPos).concat(extraData);
    var signingDataHex = RLP.encode(signingData);
    return Account.recover(Hash.keccak256(signingDataHex), signature);
};
/* jshint ignore:end */

Accounts.prototype.hashMessage = function hashMessage(data) {
    var message = utils.isHexStrict(data) ? utils.hexToBytes(data) : data;
    var messageBuffer = Buffer.from(message);

    var preamble = "\x19MoacNode Signed Message:\n" + message.length;
    var preambleBuffer = Buffer.from(preamble);
    var moacMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    return Hash.keccak256s(moacMessage);
};

// Use MOAC prefix to sign a message
Accounts.prototype.sign = function sign(data, privateKey) {
    var hash = this.hashMessage(data);
    var signature = Account.sign(hash, privateKey);
    var vrs = Account.decodeSignature(signature);
    return {
        message: data,
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
};

Accounts.prototype.recover = function recover(message, signature, preFixed) {
    var args = [].slice.apply(arguments);


    if (_.isObject(message)) {
        return this.recover(message.messageHash, Account.encodeSignature([message.v, message.r, message.s]), true);
    }

    if (!preFixed) {
        message = this.hashMessage(message);
    }

    if (args.length >= 4) {
        preFixed = args.slice(-1)[0];
        preFixed = _.isBoolean(preFixed) ? !!preFixed : false;

        return this.recover(message, Account.encodeSignature(args.slice(1, 4)), preFixed); // v, r, s
    }
    return Account.recover(message, signature);
};

// Taken from https://github.com/ethereumjs/ethereumjs-wallet
Accounts.prototype.decrypt = function (v3Keystore, password, nonStrict) {
    /* jshint maxcomplexity: 10 */

    if(!_.isString(password)) {
        throw new Error('No password given.');
    }

    var json = (_.isObject(v3Keystore)) ? v3Keystore : JSON.parse(nonStrict ? v3Keystore.toLowerCase() : v3Keystore);

    if (json.version !== 3) {
        throw new Error('Not a valid V3 wallet');
    }

    var derivedKey;
    var kdfparams;
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams;

        // FIXME: support progress reporting callback
        derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams;

        if (kdfparams.prf !== 'hmac-sha256') {
            throw new Error('Unsupported parameters to PBKDF2');
        }

        derivedKey = cryp.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else {
        throw new Error('Unsupported key derivation scheme');
    }

    var ciphertext = Buffer.from(json.crypto.ciphertext, 'hex');

    var mac = utils.sha3(Buffer.concat([ derivedKey.slice(16, 32), ciphertext ])).replace('0x','');
    if (mac !== json.crypto.mac) {
        throw new Error('Key derivation failed - possibly wrong password');
    }

    var decipher = cryp.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), Buffer.from(json.crypto.cipherparams.iv, 'hex'));
    var seed = '0x'+ Buffer.concat([ decipher.update(ciphertext), decipher.final() ]).toString('hex');

    return this.privateKeyToAccount(seed);
};

Accounts.prototype.encrypt = function (privateKey, password, options) {
    /* jshint maxcomplexity: 20 */
    var account = this.privateKeyToAccount(privateKey);

    options = options || {};
    var salt = options.salt || cryp.randomBytes(32);
    var iv = options.iv || cryp.randomBytes(16);

    var derivedKey;
    var kdf = options.kdf || 'scrypt';
    var kdfparams = {
        dklen: options.dklen || 32,
        salt: salt.toString('hex')
    };

    if (kdf === 'pbkdf2') {
        kdfparams.c = options.c || 262144;
        kdfparams.prf = 'hmac-sha256';
        derivedKey = cryp.pbkdf2Sync(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256');
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = options.n || 8192; // 2048 4096 8192 16384
        kdfparams.r = options.r || 8;
        kdfparams.p = options.p || 1;
        derivedKey = scrypt(Buffer.from(password), Buffer.from(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen);
    } else {
        throw new Error('Unsupported kdf');
    }

    var cipher = cryp.createCipheriv(options.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv);
    if (!cipher) {
        throw new Error('Unsupported cipher');
    }

    var ciphertext = Buffer.concat([ cipher.update(Buffer.from(account.privateKey.replace('0x',''), 'hex')), cipher.final() ]);

    var mac = utils.sha3(Buffer.concat([ derivedKey.slice(16, 32), Buffer.from(ciphertext, 'hex') ])).replace('0x','');

    return {
        version: 3,
        id: uuid.v4({ random: options.uuid || cryp.randomBytes(16) }),
        address: account.address.toLowerCase().replace('0x',''),
        crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: options.cipher || 'aes-128-ctr',
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString('hex')
        }
    };
};


// Note: this is trying to follow closely the specs on
// http://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html

function Wallet(accounts) {
    this._accounts = accounts;
    this.length = 0;
    this.defaultKeyName = "web3js_wallet";
}

Wallet.prototype._findSafeIndex = function (pointer) {
    pointer = pointer || 0;
    if (_.has(this, pointer)) {
        return this._findSafeIndex(pointer + 1);
    } else {
        return pointer;
    }
};

Wallet.prototype._currentIndexes = function () {
    var keys = Object.keys(this);
    var indexes = keys
        .map(function(key) { return parseInt(key); })
        .filter(function(n) { return (n < 9e20); });

    return indexes;
};

Wallet.prototype.create = function (numberOfAccounts, entropy) {
    for (var i = 0; i < numberOfAccounts; ++i) {
        this.add(this._accounts.create(entropy).privateKey);
    }
    return this;
};

Wallet.prototype.add = function (account) {

    if (_.isString(account)) {
        account = this._accounts.privateKeyToAccount(account);
    }
    if (!this[account.address]) {
        account = this._accounts.privateKeyToAccount(account.privateKey);
        account.index = this._findSafeIndex();

        this[account.index] = account;
        this[account.address] = account;
        this[account.address.toLowerCase()] = account;

        this.length++;

        return account;
    } else {
        return this[account.address];
    }
};

Wallet.prototype.remove = function (addressOrIndex) {
    var account = this[addressOrIndex];

    if (account && account.address) {
        // address
        this[account.address].privateKey = null;
        delete this[account.address];
        // address lowercase
        this[account.address.toLowerCase()].privateKey = null;
        delete this[account.address.toLowerCase()];
        // index
        this[account.index].privateKey = null;
        delete this[account.index];

        this.length--;

        return true;
    } else {
        return false;
    }
};

Wallet.prototype.clear = function () {
    var _this = this;
    var indexes = this._currentIndexes();

    indexes.forEach(function(index) {
        _this.remove(index);
    });

    return this;
};

Wallet.prototype.encrypt = function (password, options) {
    var _this = this;
    var indexes = this._currentIndexes();

    var accounts = indexes.map(function(index) {
        return _this[index].encrypt(password, options);
    });

    return accounts;
};


Wallet.prototype.decrypt = function (encryptedWallet, password) {
    var _this = this;

    encryptedWallet.forEach(function (keystore) {
        var account = _this._accounts.decrypt(keystore, password);

        if (account) {
            _this.add(account);
        } else {
            throw new Error('Couldn\'t decrypt accounts. Password wrong?');
        }
    });

    return this;
};

Wallet.prototype.save = function (password, keyName) {
    localStorage.setItem(keyName || this.defaultKeyName, JSON.stringify(this.encrypt(password)));

    return true;
};

Wallet.prototype.load = function (password, keyName) {
    var keystore = localStorage.getItem(keyName || this.defaultKeyName);

    if (keystore) {
        try {
            keystore = JSON.parse(keystore);
        } catch(e) {

        }
    }

    return this.decrypt(keystore || [], password);
};

if (typeof localStorage === 'undefined') {
    delete Wallet.prototype.save;
    delete Wallet.prototype.load;
}


module.exports = Accounts;
