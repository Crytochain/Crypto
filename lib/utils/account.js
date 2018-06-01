"use strict";

var _ = require("underscore");
var Account = require("eth-lib/lib/account");
var Hash = require("eth-lib/lib/hash");
var RLP = require("eth-lib/lib/rlp");
var Nat = require("eth-lib/lib/nat");
var Bytes = require("eth-lib/lib/bytes");
var cryp = (typeof global === 'undefined') ? require('crypto-browserify') : require('crypto');
var utils = require('./utils.js');
var secp256k1 = require('secp256k1');
var Buffer = require('safe-buffer').Buffer;


var isNot = function(value) {
    return (_.isUndefined(value) || _.isNull(value));
};

//To fix an error of 2 leading 0s
var trimLeadingZero = function (hex) {
    while (hex && hex.startsWith('0x00')) {
        hex = '0x' + hex.slice(4);
    }
    return hex;
};

/*
 * This function is to resolve the issue 
 * https://github.com/ethereum/web3.js/issues/1170
 * 
*/
var makeEven = function (hex) {
    if(hex.length % 2 === 1) {
        hex = hex.replace('0x', '0x0');
    }
    return hex;
};

/**
 * Is the string a hex string.
 *
 * @method check if string is hex string of specific length
 * @param {String} value
 * @param {Number} length
 * @returns {Boolean} output the string is a hex string
 */
function isHexString(value, length) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  if (length && value.length !== 2 + 2 * length) {
    return false;
  }

  return true;
}

function isHexPrefixed (str) {
  return str.slice(0, 2) === '0x';
}

// Removes 0x from a given String
function stripHexPrefix (str) {
  if (typeof str !== 'string') {
    return str;
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
}

/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param {*} v the value
 */
function toBuffer (v) {
  if (!Buffer.isBuffer(v)) {
    if (Array.isArray(v)) {
      v = Buffer.from(v)
    } else if (typeof v === 'string') {
      if (isHexString(v)) {
        v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex')
      } else {
        v = Buffer.from(v)
      }
    } else if (typeof v === 'number') {
      v = intToBuffer(v)
      console.log("number")
    } else if (v === null || v === undefined) {
        console.log("Empty")
      v = Buffer.allocUnsafe(0)
    } else if (v.toArray) {
      // converts a BN to a Buffer
      v = Buffer.from(v.toArray())
    } else {
      throw new Error('invalid type')
    }
  }
  return v
}

/**
 * Converts a `Buffer` into a hex `String`
 * @param {Buffer} buf
 * @return {String}
 */
function bufferToHex (buf) {
  buf = toBuffer(buf)
  return '0x' + buf.toString('hex')
}


/*
 * RLP usage, the i 
*/
function intToHex (i) {
  var hex = i.toString(16)
  if (hex.length % 2) {
    hex = '0' + hex
  }

  return hex
}

/*
 * Transfer
*/
function intToBuffer (i) {
  var hex = intToHex(i)
  return new Buffer(hex, 'hex')
}

/**
 * ECDSA sign
 * @param {Buffer} msgHash
 * @param {Buffer} privateKey
 * @return {Object}
 */
function ecsign (msgHash, privateKeyStr) {

  //Convert the input string to Buffer
  if (typeof msgHash === 'string') {
      if (isHexString(msgHash)) {
        console.log("msgHash", msgHash);
        msgHash = Buffer.from(makeEven(stripHexPrefix(msgHash)), 'hex')
      } 
  }

console.log("Sign str:", privateKeyStr);
  var privateKey = new Buffer(privateKeyStr, 'hex');

console.log("Sign with:", privateKey.length);

  var sig = secp256k1.sign(msgHash, privateKey)

  var ret = {}
  ret.r = sig.signature.slice(0, 32)
  ret.s = sig.signature.slice(32, 64)
  ret.v = sig.recovery + 27

  return ret
}

//A simple Transaction class handling the 
//transaction.
//
// var Transaction = function Transaction() {
//     var _this = this;
// };

/* Input:
 * tx - a JSON format object contains the input TX info
 * privateKey - a string 
 * 
*/
var signTransaction = function (tx, privateKey) {

  //Check the input fiels of the tx
        if (tx.chainId < 1) {
            return new Error('"Chain ID" is invalid');
        }

        if (!tx.gas && !tx.gasLimit) {
           return new Error('"gas" is missing');
        }

        if (tx.nonce  < 0 ||
            tx.gasLimit  < 0 ||
            tx.gasPrice  < 0 ||
            tx.chainId  < 0) {
            return new Error('Gas, gasPrice, nonce or chainId is lower than 0');
        }


        //Sharding Flag only accept the 
        //If input has not sharding flag, set it to 0 as global TX.
        if (tx.shardingFlag == undefined){
            // console.log("Set default sharding to 0");
            tx.shardingFlag = 0;
        }

        // if (tx.shardingFlag != 0 && tx.shardingFlag != 1){
        //     return new Error('"Sharding Flag" is invalid');
        // }

        try {
            //Make sure all the number fields are in HEX format

            var transaction = tx;
            transaction.to = tx.to || '0x';//Can be zero, for contract creation
            transaction.data = tx.data || '0x';//can be zero for general TXs
            transaction.value = tx.value || '0x';//can be zero for contract call
            transaction.chainId = utils.numberToHex(tx.chainId);
            transaction.shardingFlag = utils.numberToHex(tx.shardingFlag);
            transaction.systemContract = '0x';//System contract flag, always = 0
            transaction.via = tx.via || '0x'; //Sharding subchain address
console.log("TX to sign:", transaction);

console.log("1:",Bytes.fromNat(transaction.nonce).length);
console.log("2:",Bytes.fromNat(transaction.systemContract).length);
console.log("3:",Bytes.fromNat(transaction.gasPrice).length);
console.log("4:",Bytes.fromNat(transaction.gasLimit).length);
console.log("5:",Bytes.fromNat(transaction.value).length);
console.log("6:",Bytes.fromNat(transaction.shardingFlag).length);
console.log("7:",Bytes.fromNat(transaction.chainId).length);
            //Encode the TX for signature
            //   type txdata struct {
            // AccountNonce uint64          `json:"nonce"    gencodec:"required"`
            // SystemContract uint64          `json:"syscnt" gencodec:"required"`
            // Price        *big.Int        `json:"gasPrice" gencodec:"required"`
            // GasLimit     *big.Int        `json:"gas"      gencodec:"required"`
            // Recipient    *common.Address `json:"to"       rlp:"nil"` // nil means contract creation
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
                Bytes.fromNat(transaction.gasLimit),
                transaction.to.toLowerCase(),
                Bytes.fromNat(transaction.value),
                transaction.data,
                Bytes.fromNat(transaction.shardingFlag),
                transaction.via.toLowerCase(),
                Bytes.fromNat(transaction.chainId),
                "0x",
                "0x"]);

console.log("Hashing......")
            var hash = Hash.keccak256(rlpEncoded);

            // for MOAC, keep 9 fields instead of 6
            var vPos = 9;
            //Sign the hash with the private key to produce the
            //V, R, S
            var newsign = ecsign(hash, privateKey);
            var rawTx = RLP.decode(rlpEncoded).slice(0,vPos+3);

            //Replace the V field with chainID info
            var newV = newsign.v + 8 + transaction.chainId *2;

            // Add trimLeadingZero to avoid '0x00' after makeEven
            //
            rawTx[vPos] = trimLeadingZero(makeEven(bufferToHex(newV)));
            rawTx[vPos+1] = trimLeadingZero(makeEven(bufferToHex(newsign.r)));
            rawTx[vPos+2] = trimLeadingZero(makeEven(bufferToHex(newsign.s)));

console.log("After sign:", rawTx);

            var rawTransaction = RLP.encode(rawTx);


        } catch(e) {

            return e;
        }

console.log("Raw:", rawTransaction);
console.log("Decoded:\n", decodeTx(rawTransaction));

        return rawTransaction;
};

//Debugging program to check the input TX 
var decodeTx = function (inTransaction) {
var values = RLP.decode(inTransaction);
return values;
}

module.exports = {
    signTransaction: signTransaction,
    decodeTx: decodeTx
};
