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
 
  Adopt from eth-lib with some minor modifications and pruning. 
  eth-lib is licensed under MIT:
  https://github.com/maiavictor/eth-lib
  
  Part of the code is adopt from eth-sig-util with some minor modifications
  to use on MOAC platform.
  eth-sig-util is licensed under ISC.
  https://github.com/MetaMask/eth-sig-util.git
*/

"use strict";

var Account = require("./account");
var Hash = require("./hash");
var RLP = require("./rlp");
var Bytes = require("./bytes");
var utils = require('../utils/utils.js');
var secp256k1 = require('secp256k1');
var Buffer = require('safe-buffer').Buffer;
var assert = require('assert');
var BN = require('bn.js')

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
  if (hex.length % 2 === 1) {
    hex = hex.replace('0x', '0x0');
  }
  return hex;
};

/**
 * Pads a `String` to have an even length
 * @method padToEven
 * @param {String} a
 * @return {String}
 */
var padToEven = function padToEven (a) {
  if (a.length % 2) a = '0' + a
  return a
}

/**
 * Is the string a hex string.
 *
 * @method check if string is hex string of specific length
 * @param {String} value
 * @param {Number} length
 * @returns {Boolean} output the string is a hex string
 */
var isHexString = function isHexString(value, length) {
  if (typeof value !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false;
  }

  if (length && value.length !== 2 + 2 * length) {
    return false;
  }

  return true;
}

var isHexPrefixed = function isHexPrefixed(str) {
  return str.slice(0, 2) === '0x';
}

/**
 * Removes 0x from a given String
 * @param {String} value
 * @return {String} output
 */
var stripHexPrefix =function stripHexPrefix(str) {
  if (typeof str !== 'string') {
    return str;
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
}

/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param {*} v the value
 */
var toBuffer = function toBuffer(v) {
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
    } else if (v === null || v === undefined) {
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
var bufferToHex = function bufferToHex(buf) {
  buf = toBuffer(buf)
  return '0x' + buf.toString('hex')
}

/**
 * Converts a `Buffer` to a `Number`
 * @method bufferToInt
 * @param {Buffer} buf
 * @return {Number}
 */
var bufferToInt = function bufferToInt (buf) {
  return parseInt(bufferToHex(buf), 16)
}

/*
 * RLP usage, conver the input integer to HEX value.
 */
var intToHex = function intToHex(i) {
  var hex = i.toString(16)
  if (hex.length % 2) {
    hex = '0' + hex
  }

  return hex
}

/*
 * Transfer an integer to buffer
 */
var intToBuffer = function intToBuffer(i) {
  var hex = intToHex(i)
  return new Buffer(hex, 'hex')
}

/**
 * ECDSA sign
 * @param {Buffer} msgHash
 * @param {Buffer} privateKey
 * @return {Object}
 */
var ecsign = function ecsign(msgHash, privateKeyStr) {

  //Convert the input string to Buffer
  if (typeof msgHash === 'string') {
    if (isHexString(msgHash)) {
      msgHash = Buffer.from(makeEven(stripHexPrefix(msgHash)), 'hex')
    }
  }

  var privateKey = new Buffer(privateKeyStr, 'hex');

  var sig = secp256k1.sign(msgHash, privateKey)

  var ret = {}
  ret.r = sig.signature.slice(0, 32)
  ret.s = sig.signature.slice(32, 64)
  ret.v = sig.recovery + 27

  return ret
}

/**
 * Returns a buffer filled with 0s
 * @method zeros
 * @param {Number} bytes  the number of bytes the buffer should be
 * @return {Buffer}
 */
var zeros = function zeros(bytes) {
  return Buffer.allocUnsafe(bytes).fill(0);
};

/**
 * Left Pads an `Array` or `Buffer` with leading zeros till it has `length` bytes.
 * Or it truncates the beginning if it exceeds.
 * @method setLength
 * @param {Buffer|Array} msg the value to pad
 * @param {Number} length the number of bytes the output should be
 * @param {Boolean} [right=false] whether to start padding form the left or right
 * @return {Buffer|Array}
 */
var setLength = function setLength(msg, length, right) {
  var buf = zeros(length);
  msg = toBuffer(msg);
  if (right) {
    if (msg.length < length) {
      msg.copy(buf);
      return buf;
    }
    return msg.slice(0, length);
  } else {
    if (msg.length < length) {
      msg.copy(buf, length - msg.length);
      return buf;
    }
    return msg.slice(-length);
  }
};

/**
 * ECDSA public key recovery from signature
 * @param {Buffer} msgHash
 * @param {Number} v
 * @param {Buffer} r
 * @param {Buffer} s
 * @return {Buffer} publicKey
 */
var ecrecover = function ecrecover (msgHash, v, r, s) {
  var signature = Buffer.concat([setLength(r, 32), setLength(s, 32)], 64);
  var recovery = v - 27;
  if (recovery !== 0 && recovery !== 1) {
    throw new Error('Invalid signature v value');
  }
  var senderPubKey = secp256k1.recover(msgHash, signature, recovery);
  return secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
};

/**
 * Determines if the signature is valid from MOAC sign
 * Input should be convertableto 
 * message    -  original message
 * signedData - signature with account private key and chain3.mc.sign
 * srcAddr.   -  account public address
 * @param {String} msgHash
 * @param {String} signedData
 * @param {String} srcAddr
 * @return {Boolean}
 */
var verifyMcSignature = function verifyMcSignature(message, signedData, srcAddr) {

  var prefixMsg = addPrefixToMessage(toBuffer(message));

  // do Hash
  var msgHash = Hash.keccak256(prefixMsg);

  try {

    var recoverAddr = Account.recover(msgHash, signedData).toLowerCase();
    assert.equal(recoverAddr, srcAddr.toLowerCase());
    if (recoverAddr == srcAddr.toLowerCase()) {
      return true;
    } else {
      return false;

    }
  } catch (e) {
    console.log(e);
    return false
  }
}

/**
 * Add the prefix to the message as identification from MOAC system
 * if the signature is valid from MOAC sign
 * Inputs are byte array or Buffer, the coding of header is as the follows
 * e.g.
 * message = 't' = 0X74 = 116,
 * HEX STRING: 194d6f61634e6f6465205369676e6564204d6573736167653a0a3174
 * BYTE ARRAY: [25 77 111 97 99 78 111 100 101 32 83 105 103 110 101 100 32 77 101 115 115 97 103 101 58 10 49 116]
 * 
 * Byte index: HEX value: Comments
 * 0: 0x19: length of the header Strings
 * 1-24: 'MoacNode Signed Message:' : actual header string
 * 25: 0x10 = '\n' : newline ASCII
 * 26: 0x31 = 49 = '1' : length of the input byte array, shown as ASCII code,1 
 * 27: 0x74 = 116 = 't' : actual inpu byte array;
 * @param {message} should be a Buffer data type
 * @return {Buffer} 
 */
var addPrefixToMessage = function addPrefixToMessage(message) {
  //Header: \x19MoacNode Signed Message:\n
  //25 77 111 97 99 78 111 100 101 32 83 105 103 110 101 100 32 77 101 115 115 97 103 101 58 10
  var prefix = toBuffer('0x194d6f61634e6f6465205369676e6564204d6573736167653a0a');
  var msgLen = message.length.toString();

  var lenBuf = new Buffer(msgLen.length);

  // Convert the string length to ASCII string array
  for (var i = 0; i < msgLen.length; i++) {
    lenBuf[i] = msgLen.charCodeAt(i);
  }

  return Buffer.concat([prefix, lenBuf, toBuffer(message)]);
}

/**
 * Returns the keccak-256 hash of `message`, prefixed with the header used by the `mc_sign` RPC call, 
 * then use `ecsign` to produce the same signature as the `mc_sign` from MOAC nodes.
 * call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
 * For non-HEX string, to comply with MOAC node sign process.
 * used to produce the signature.
 * @param {String} message
 * @param {String} privateKey
 * @return {Object}
 */
var signMcMessage = function signMcMessage(message, privateKey) {

  // add moac sign header as MOAC vnode before the 
  // "\x19MoacNode Signed Message:\n"
  var prefixMsg = addPrefixToMessage(toBuffer(message));

  var inHash = Hash.keccak256(prefixMsg); 

  var sig = ecsign(inHash, stripHexPrefix(privateKey));

  return concatSig(sig.v, sig.r, sig.s);
}

/**
 * Recover the account address from input signed message
 * msgParams should have a `data` key that is hex-encoded data unsigned, and a `sig` key that is hex-encoded and already signed.
 * @method recoverPersonalSignature
 * @param {msgParams} signed message, must follow
 * @return {senderAddr} a hex-encoded sender address.
 */
var recoverPersonalSignature = function (indata, insig) {

  var prefixMsg = addPrefixToMessage(toBuffer(indata));
  // do Hash
  var msgHash = Hash.keccak256(prefixMsg);
  return Account.recover(msgHash, insig).toLowerCase();

  }

/**
 * Interprets a `Buffer` as a signed integer and returns a `BN`. Assumes 256-bit numbers.
 * @method fromSigned
 * @param {Buffer} num
 * @return {BN}
 */
var fromSigned = function fromSigned (num) {
  return new BN(num).fromTwos(256)
}

/**
 * Converts a `BN` to an unsigned integer and returns it as a `Buffer`. Assumes 256-bit numbers.
 * @method toUnsigned
 * @param {BN} num
 * @return {Buffer}
 */
var toUnsigned = function (num) {
  return new Buffer(num.toTwos(256).toArray())
}

/**
 * Combine all three fields of the signature
 *
 * @param {Number} v
 * @param {Buffer} r
 * @param {Buffer} s
 * @return {Buffer} publicKey
 */
var concatSig = function concatSig (v, r, s) {

    var rSig = fromSigned(r)
    var sSig = fromSigned(s)
    var vSig = bufferToInt(v)
    var rStr = padWithZeroes(toUnsigned(rSig).toString('hex'), 64)
    var sStr = padWithZeroes(toUnsigned(sSig).toString('hex'), 64)
    var vStr = stripHexPrefix(intToHex(vSig))

    return addHexPrefix(rStr.concat(sStr, vStr)).toString('hex')
}

/**
 * Adds "0x" to a given `String` if it does not already start with "0x"
 * @method addHexPrefix
 * @param {String} str
 * @return {String}
 */
var addHexPrefix = function addHexPrefix (str) {
  if (typeof str !== 'string') {
    return str
  }

  return isHexPrefixed(str) ? str : '0x' + str
}

/**
 * Check if input number has enough length
 * if not, add 0s to make it enough length
 *
 * @method padWithZeroes
 * @param {number} input number 
* @param {length} input length as desired 
 * @returns {string}
 */
var padWithZeroes = function padWithZeroes (number, length) {
  var myString = '' + number
  while (myString.length < length) {
    myString = '0' + myString
  }
  return myString
}

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
var signTransaction = function (tx, privateKey) {

  if (tx.chainId < 1) {
    return new Error('"Chain ID" is invalid');
  }

  if (!tx.gas && !tx.gasLimit) {
    return new Error('"gas" is missing');
  }

  if (tx.nonce < 0 ||
    tx.gasLimit < 0 ||
    tx.gasPrice < 0 ||
    tx.chainId < 0) {
    return new Error('Gas, gasPrice, nonce or chainId is lower than 0');
  }


  //Sharding Flag can be 0, 1, 2
  //If input has not sharding flag, set it to 0 as global TX.
  if (tx.shardingFlag == undefined) {
    tx.shardingFlag = 0;
  }

  try {
    //Make sure all the number fields are in HEX format

    var transaction = tx;
    transaction.to = tx.to || '0x'; //Can be zero, for contract creation
    transaction.data = tx.data || '0x'; //can be zero for general TXs
    transaction.value = tx.value || '0x'; //can be zero for contract call
    transaction.chainId = utils.numberToHex(tx.chainId);
    transaction.shardingFlag = utils.numberToHex(tx.shardingFlag);
    transaction.systemContract = '0x0'; //System contract flag, always = 0
    transaction.via = tx.via || '0x'; //vnode subchain address

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
      Bytes.fromNat(transaction.gasLimit),
      transaction.to.toLowerCase(),
      Bytes.fromNat(transaction.value),
      transaction.data,
      Bytes.fromNat(transaction.shardingFlag),
      // transaction.via.toLowerCase()]);
      transaction.via.toLowerCase(),
      Bytes.fromNat(transaction.chainId),
      "0x",
      "0x"
    ]);

    var hash = Hash.keccak256(rlpEncoded);

    // for MOAC, keep 9 fields instead of 6
    var vPos = 9;
    //Sign the hash with the private key to produce the
    //V, R, S
    var newsign = ecsign(hash, stripHexPrefix(privateKey));

    var rawTx = RLP.decode(rlpEncoded).slice(0, vPos + 3);

    //Replace the V field with chainID info
    var newV = newsign.v + 8 + transaction.chainId * 2;

    // dont allow uneven r,s,v values
    // there could be 0 when convert the buffer to HEX.
    // In the RLP encoding/decoding rules, 
    rawTx[vPos] = (makeEven(trimLeadingZero(bufferToHex(newV))));
    rawTx[vPos + 1] = (makeEven(trimLeadingZero(bufferToHex(newsign.r))));
    rawTx[vPos + 2] = (makeEven(trimLeadingZero(bufferToHex(newsign.s))));
// console.log("R", newsign.r," length ",newsign.r.length);
// console.log("EVEN R", makeEven(bufferToHex(newsign.r)));
// console.log("S", newsign.s," length ", newsign.s.length);
// console.log("EVEN S", makeEven(bufferToHex(newsign.s)));
// console.log("EVEN S without zeros", makeEven(trimLeadingZero(bufferToHex(newsign.s))));

    var rawTransaction = RLP.encode(rawTx);


  } catch (e) {

    return e;
  }

  return rawTransaction;
};


module.exports = {
  toBuffer: toBuffer,
  signTransaction: signTransaction,
  signMcMessage: signMcMessage,
  recoverPersonalSignature: recoverPersonalSignature,
  verifyMcSignature: verifyMcSignature
};