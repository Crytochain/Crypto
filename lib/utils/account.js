"use strict";

var _ = require("underscore");
// var Account = require("eth-lib/lib/account");
var Hash = require("eth-lib/lib/hash");
var RLP = require("eth-lib/lib/rlp");
var Nat = require("eth-lib/lib/nat");
var Bytes = require("eth-lib/lib/bytes");
var cryp = (typeof global === 'undefined') ? require('crypto-browserify') : require('crypto');
var utils = require('./utils.js');
var secp256k1 = require('secp256k1');
var Buffer = require('safe-buffer').Buffer;
// develop only
var ethUtil = require('ethereumjs-util');


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
function ecrecover(msgHash, v, r, s) {
  // console.log("ecrecover?", msgHash);
  // console.log("ecrecover?", msgHash.length);
  // console.log("r?", r.length);
  // console.log("s?", s.length);

  try {
      var signature = Buffer.concat([setLength(r, 32), setLength(s, 32)], 64);

    var recovery = v - 27;
    if (recovery !== 0 && recovery !== 1) {
      throw new Error('Invalid signature v value');
    }
    
    // Recover using secp256k1 as buffer
    var senderPubKey = secp256k1.recover(toBuffer(msgHash), signature, recovery);

console.log("Pubkey...", senderPubKey.length);
    // console.log("Pubkey...", ethUtil.isValidPublic(senderPubKey));
    // var add = ethUtil.publicToAddress(senderPubKey);
    // console.log("Address:", utils.bytesArrayToHEXString(add));
    // console.log("Public Key verify:", secp256k1.publicKeyVerify(senderPubKey));

    return secp256k1.publicKeyConvert(senderPubKey, false).slice(1);
  } catch (e) {
    console.log("ecrecover Error:", e);
    return false
  }
};

/**
 * Determines if the signature is valid from MOAC sign
 * Inputs are two strings start with '0x'.
 * @param {String} msgHash
 * @param {String} signedData
 * @return {Boolean}
*/
function verifyMcSignature (message, signedData) {

  var prefix = toBuffer('\x19MoacNode Signed Message:\n' + message.length.toString());
  var msgHash = Hash.keccak256(Buffer.concat([prefix, toBuffer(message)]));
  
  let r = toBuffer(signedData.slice(0, 66));
  let s = toBuffer(signedData.slice(66, 130));
  let v = '0x' + signedData.slice(130, 132);
  v = utils.toDecimal(v);

    try {
      // let v = ethUtil.bufferToInt(this.v)
      var senderPubKey = ecrecover(msgHash, v, r, s);
    } catch (e) {
      return false
    }

    return !!senderPubKey
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
  var prefix = toBuffer('\x19MoacNode Signed Message:\n' + message.length.toString());
  var inHash = Hash.keccak256(Buffer.concat([prefix, toBuffer(message)]));//keccak(Buffer.concat([prefix, message]));
  console.log("Sign msg len:", inHash.length);
  var newsign = ecsign(inHash, stripHexPrefix(privateKey));
  var  v = trimLeadingZero(makeEven(bufferToHex(newsign.v)));
  var  r = trimLeadingZero(makeEven(bufferToHex(newsign.r)));
  var  s = trimLeadingZero(makeEven(bufferToHex(newsign.s)));
  console.log("r:",r);
  console.log("s:",s);
  console.log("v:",v);

  return r+stripHexPrefix(s)+stripHexPrefix(v);
};

//A simple Transaction class handling the 
//transaction.
//
// var Transaction = function Transaction() {
//     var _this = this;
// };

/* 
 * A simple signTransaction function to sign
 * the input TX with private key.
 * Input:
 * tx - a JSON format object contains the input TX info
 * privateKey - a string format of the private key
 * Output:
 * rawTransaction - a String, can be used with 
 *                  mc.sendRawTransaction
 * 
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
// console.log("HEX 0:", utils.numberToHex(0));
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
 console.log("RLP encoded transaction:", transaction);
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
 // console.log("chain3 tx:", transaction);
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
 console.log("chain3 rlpEncoded:", rlpEncoded);

            var hash = Hash.keccak256(rlpEncoded);
 console.log("chain3 hashed after rlpEncoded:", hash);
 // return;
            // for MOAC, keep 9 fields instead of 6
            var vPos = 9;
            //Sign the hash with the private key to produce the
            //V, R, S
            var newsign = ecsign(hash, stripHexPrefix(privateKey));
            // console.log("Sign:", privateKey);
            // console.log("chain3 newsign:", newsign);

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

//Debugging program to check the input TX 
var decodeTx = function (inTransaction) {
var values = RLP.decode(inTransaction);
return values;
}

module.exports = {
    signTransaction: signTransaction,
    decodeTx: decodeTx,
    signMcMessage: signMcMessage,
    verifyMcSignature: verifyMcSignature
};
