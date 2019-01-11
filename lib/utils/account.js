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
var assert = require('assert');


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
 * Pads a `String` to have an even length
 * @method padToEven
 * @param {String} a
 * @return {String}
 */
var padToEven = function (a) {
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

/**
 * Removes 0x from a given String
 * @param {String} value
 * @return {String} output
 */
function stripHexPrefix (str) {
  if (typeof str !== 'string') {
    return str;
  }
  return isHexPrefixed(str) ? str.slice(2) : str;
}

/**
 * Pads a `String` to have an even length
 * @param {String} value
 * @return {String} output
 */

function padToEven (a) {
  if (a.length % 2) a = '0' + a
  return a
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
function zeros (bytes) {
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
function setLength (msg, length, right) {
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
exports.ecrecover = function (msgHash, v, r, s) {
  var signature = Buffer.concat([exports.setLength(r, 32), exports.setLength(s, 32)], 64);
  var recovery = v - 27;
  if (recovery !== 0 && recovery !== 1) {
    throw new Error('Invalid signature v value');
  }
  var senderPubKey = secp256k1.recover(msgHash, signature, recovery);
  return secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
};

/**
 * Determines if the signature is valid from MOAC sign
 * Inputs are strings start with '0x'.
 * msgHash    -  Hash of the message
 * signedData - signature with account private key and chain3.mc.sign
 * srcAddr.   -  account public address
 * @param {String} msgHash
 * @param {String} signedData
 * @param {String} srcAddr
 * @return {Boolean}
*/
function verifyMcSignature (message, signedData, srcAddr) {

  // Need to add MOAC prefix to the message
  var prefixMsg= addPrefixToMessage(toBuffer(message));

  // do Hash
  var msgHash = Hash.keccak256(prefixMsg);


  try {

    var recoverAddr = Account.recover(msgHash, signedData).toLowerCase();
      // console.log(assert.equal(recoverAddr.toUpperCase(), srcAddr.toUpperCase()));
      assert.equal(recoverAddr, srcAddr.toLowerCase());
      if ( recoverAddr == srcAddr.toLowerCase()){
      // console.log("Verify address the same: true");
        return true;
     }else{
      // console.log("Veify found diff addr: false");
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
 * @param {Buffer} 
 * @return {Buffer} 
*/
function addPrefixToMessage(message) {
  //Header: \x19MoacNode Signed Message:\n
  //25 77 111 97 99 78 111 100 101 32 83 105 103 110 101 100 32 77 101 115 115 97 103 101 58 10
  var prefix = toBuffer('0x194d6f61634e6f6465205369676e6564204d6573736167653a0a');
  var msgLen = message.length.toString();

  var lenBuf= new Buffer(msgLen.length);

  // Convert the string length to ASCII string array
  for (var i = 0; i < msgLen.length; i ++){
    lenBuf[i] = msgLen.charCodeAt(i);
  }

  return Buffer.concat([prefix, lenBuf, toBuffer(message)]);
}

/**
 * Returns the keccak-256 hash of `message`, prefixed with the header used by the `mc_sign` RPC call, 
 * then use `ecsign` to produce the same signature as the `mc_sign` from MOAC nodes.
 * call for a given `message`, or fed to `ecrecover` along with a signature to recover the public key
 * used to produce the signature.
 * @param {String} message
 * @param {String} privateKey
 * @return {Object}
 */
function signMcMessage(message, privateKey) {
  // console.log("toBuffer:", toBuffer(message));
  var prefixMsg= addPrefixToMessage(toBuffer(message));//Buffer.concat([prefix, toBuffer(message)]);

  var inHash = Hash.keccak256(prefixMsg);//

  var newsign = ecsign(inHash, stripHexPrefix(privateKey));
  var  v = trimLeadingZero(makeEven(bufferToHex(newsign.v)));
  var  r = trimLeadingZero(makeEven(bufferToHex(newsign.r)));
  var  s = trimLeadingZero(makeEven(bufferToHex(newsign.s)));

  return r+stripHexPrefix(s)+stripHexPrefix(v);
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

  if (tx.nonce  < 0 ||
      tx.gasLimit  < 0 ||
      tx.gasPrice  < 0 ||
      tx.chainId  < 0) {
      return new Error('Gas, gasPrice, nonce or chainId is lower than 0');
  }


  //Sharding Flag can be 0, 1, 2
  //If input has not sharding flag, set it to 0 as global TX.
  if (tx.shardingFlag == undefined){
      tx.shardingFlag = 0;
  }

  try {
      //Make sure all the number fields are in HEX format

      var transaction = tx;
      transaction.to = tx.to || '0x';//Can be zero, for contract creation
      transaction.data = tx.data || '0x';//can be zero for general TXs
      transaction.value = tx.value || '0x';//can be zero for contract call
      transaction.chainId = utils.numberToHex(tx.chainId);
      transaction.shardingFlag = utils.numberToHex(tx.shardingFlag);
      transaction.systemContract = '0x0';//System contract flag, always = 0
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
          "0x"]);

      var hash = Hash.keccak256(rlpEncoded);

      // for MOAC, keep 9 fields instead of 6
      var vPos = 9;
      //Sign the hash with the private key to produce the
      //V, R, S
      var newsign = ecsign(hash, stripHexPrefix(privateKey));

      var rawTx = RLP.decode(rlpEncoded).slice(0,vPos+3);

      //Replace the V field with chainID info
      var newV = newsign.v + 8 + transaction.chainId *2;

      // Add trimLeadingZero to avoid '0x00' after makeEven
      // dont allow uneven r,s,v values
      rawTx[vPos] = trimLeadingZero(makeEven(bufferToHex(newV)));
      rawTx[vPos+1] = trimLeadingZero(makeEven(bufferToHex(newsign.r)));
      rawTx[vPos+2] = trimLeadingZero(makeEven(bufferToHex(newsign.s)));

      var rawTransaction = RLP.encode(rawTx);


  } catch(e) {

      return e;
  }

  return rawTransaction;
};


module.exports = {
  toBuffer:toBuffer,
    signTransaction: signTransaction,
    signMcMessage: signMcMessage,
    verifyMcSignature: verifyMcSignature
};
