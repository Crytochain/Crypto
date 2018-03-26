'use strict'
const txutil = require('./txutils')
const fees = require('./params.json')
const BN = txutil.BN
// var BigNumber = require('bignumber.js');


// secp256k1n/2
const N_DIV_2 = new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)
const SystemFlag  = 0x80
const QueryFlag  = 0x40
const ShardingFlag  = 0x20

// var N_DIV_2 = new BigNumber('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0', 16)

/**
 * Creates a new transaction object.
 *
 * @example
 * var rawTx = {
 *   nonce: '00',
 *   gasPrice: '09184e72a000',
 *   gasLimit: '2710',
 *   to: '0000000000000000000000000000000000000000',
 *   value: '00',
 *   data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '1c',
 *   r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s: '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13',
 *   shardingFlag: 0,
 *   
 * };
 * var tx = new Transaction(rawTx);
 *
 * @class
 * @param {Buffer | Array | Object} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple.
 *
 * Or lastly an Object containing the Properties of the transaction like in the Usage example.
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 *
 * @property {Buffer} raw The raw rlp encoded transaction
 * @param {Buffer} data.nonce nonce number
 * @param {Buffer} data.systemContract Default = 0, don't change
 * @param {Buffer} data.gasLimit transaction gas limit
 * @param {Buffer} data.gasPrice transaction gas price
 * @param {Buffer} data.to to the to address
 * @param {Buffer} data.value the amount of ether sent
 * @param {Buffer} data.data this will contain the data of the message or the init of a contract
 * @param {Buffer} data.v EC signature parameter
 * @param {Buffer} data.r EC signature parameter
 * @param {Buffer} data.s EC recovery ID
 * @param {Number} data.chainId EIP 155 chainId - mainnet: 1, ropsten: 3
 * @param {Buffer} data.nonce nonce number
 * */

class Transaction {
  constructor (data) {
    data = data || {}

    // Define Properties,
    // The properties need to follow the data structure in MOAC
    // core/type/
    // Added two more fields
    // systemFlag, range (0,1), should always be 0
    // shardingFlag, ranger (0,1)

    const fields = [{
      name: 'nonce',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {name: 'systemContract',
      length: 32,
      allowLess: true,
      // allowZero: true,
      default: new Buffer([0])
    }, {
      name: 'gasPrice',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'gasLimit',
      alias: 'gas',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'to',
      allowZero: true,
      length: 20,
      default: new Buffer([])
    }, {
      name: 'value',
      length: 32,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 'data',
      alias: 'input',
      allowZero: true,
      default: new Buffer([])
    }, { name: 'shardingFlag',
      length: 32,
      allowLess: true,
      default: new Buffer([0]) 
      // allowZero: true,
      // default: new Buffer([0])      
    },{
      name: 'v',
      allowZero: true,
      // FOR ETH before, v = 27 (0x1B) or v = 28 (0x1c)
      // default: new Buffer([0x25])
      // FOR EIP155, v = CHAIN_ID * 2 + 35 or v = CHAIN_ID * 2 + 36
      // mainnet: 37 or 0x25, testnet: 38 or 0x26, 
      default: new Buffer([0x1B])
    }, {
      name: 'r',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }, {
      name: 's',
      length: 32,
      allowZero: true,
      allowLess: true,
      default: new Buffer([])
    }]

    /**
     * Returns the rlp encoding of the transaction
     * @method serialize
     * @return {Buffer}
     * @memberof Transaction
     * @name serialize
     */
    // attached serialize
    txutil.defineProperties(this, fields, data)

//Set default values for system flag and sharding flag
    /**
     * @property {Buffer} from (read only) sender address of this transaction, mathematically derived from other parameters.
     * @name from
     * @memberof Transaction
     */
    Object.defineProperty(this, 'from', {
      enumerable: true,
      configurable: true,
      get: this.getSenderAddress.bind(this)
    })

    //Set system flag to 0, this value should not be changed
    Object.defineProperty(this, 'systemContract', {
      value: 0,
      writable: false
    })


    //Set sharding flag to 0 as default
    Object.defineProperty(this, 'shardingFlag', {
      value: 0,
      writable: true
    })

    // calculate chainId from signature
    // with EIP155
    let sigV = txutil.bufferToInt(this.v)
    let chainId = Math.floor((sigV - 35) / 2)
    if (chainId < 0) chainId = 0

    // set chainId as default
    // this chainID can be set with the right chain
    this._chainId = chainId || data.chainId || 0
    this._pangu = true
// console.log("In constructor:", this.v, sigV);

  }

  /**
   * Set the chain id and
   * update the V default value
   * 
   * @return {Buffer}
   */
  setChainId (inValue) {
    if (typeof inValue != "number"){
      // console.log("Not number!!!")
      inValue = parseInt(inValue)
    }
    if (inValue > 0)
    this._chainId = inValue;
    else
    throw new Error('Invalid chainID');
  }

  /**
   * Set the control flag value 
   * @return {Boolean}
   */
  setShardingFlag (inValue) {
    if ( inValue == 1 || inValue == 0){
      this.shardingFlag = inValue
      return true
    }
    throw new Error('Invalid shardingFlag');
  }
  /**
   * Display the TX in JSON format
   * @return {JSON string}
   */
  toJSON () {
    var outJson = {
            'nonce':this.nonce,
      'from': this.from,
      'to': this.to,
      'gasLimit':this.gasLimit,
      'gasPrice':this.gasPrice,
      'shardingFlag':this.shardingflag
    };

    return outJson;
  }


  /**
   * If the tx's `to` is to the creation address
   * @return {Boolean}
   */
  toCreationAddress () {
    return this.to.toString('hex') === ''
  }

  /**
   * Computes a sha3-256 hash of the serialized tx
   * The tx need to be the same 
   * @param {Boolean} [includeSignature=true] whether or not to inculde the signature
   * @return {Buffer}
   * MOAC, added SystemContract, QueryFlag and ShardingFlag items for signing
   * if the transaction structure changesm, this follows the definition in
   *  
   * MoacCore\core\types\transaction.go
   * Updated 2018/03/25
   * 
   type txdata struct {
  AccountNonce uint64          `json:"nonce"    gencodec:"required"`
  SystemContract uint64          `json:"syscnt" gencodec:"required"`
  Price        *big.Int        `json:"gasPrice" gencodec:"required"`
  GasLimit     *big.Int        `json:"gas"      gencodec:"required"`
  Recipient    *common.Address `json:"to"       rlp:"nil"` // nil means contract creation
  Amount       *big.Int        `json:"value"    gencodec:"required"`
  Payload      []byte          `json:"input"    gencodec:"required"`
  ShardingFlag uint64 `json:"shardingFlag" gencodec:"required"`

  // Signature values
  V *big.Int `json:"v" gencodec:"required"`
  R *big.Int `json:"r" gencodec:"required"`
  S *big.Int `json:"s" gencodec:"required"`

  // This is only used when marshaling to JSON.
  Hash *common.Hash `json:"hash" rlp:"-"`
  }
   * The hash process should follow the same procedure as in the 
   * /core/types/transaction_signing.go
   * 
   */
  hash (includeSignature) {
    if (includeSignature === undefined) includeSignature = true

    // EIP155 spec:
    // when computing the hash of a transaction for purposes of signing or recovering,
    // 
    // instead of hashing the elements (ie. nonce, systemcontract,
    // gasprice, startgas, to, value, data, queryflag, shardingflag),
    // hash the elements with three more fields, with v replaced by CHAIN_ID, r = 0 and s = 0

    // chainid SHOULD BE non-zero for the valid network and EIP155
    //MOAC has 8 items
    //
    const min_items = 8;

    let items
    if (includeSignature) {
      items = this.raw
    } else {

     
      if (this._chainId > 0) {
        // console.log("Sign TX with chain id:", this._chainId)
        const raw = this.raw.slice()
        this.v = this._chainId
        this.r = 0
        this.s = 0
        items = this.raw
        this.raw = raw
      } else {
        //Enforced the signature process
        // console.log("chainID = 0 min slice")
        throw new Error('Invalid chainID')
        // items = this.raw.slice(0, min_items)
      }
    }
 // console.log("items to seri", items);
 // console.log("===before rlphash===========", this.v);

    // create hash
    return txutil.rlphash(items)
  }

  /**
   * returns the chain id, 
   * @return {Buffer}
   */
  getChainId () {
    return this._chainId
  }


  /**
   * returns the fields name and value, 
   * @return {Buffer}
   */
  getFields () {
    return this._fields
  }

  /**
   * returns shardingFlag value, 
   * @return {Buffer}
   */
  getShardingFlag () {
    return this._shardingFlag;
  }

  /**
   * returns the sender's address
   * @return {Buffer}
   */
  getSenderAddress () {
    if (this._from) {
      return this._from
    }
    const pubkey = this.getSenderPublicKey()
    this._from = txutil.publicToAddress(pubkey)
    
    //add for MOAC encoding

    return this._from
  }

  /**
   * returns the public key of the sender
   * @return {Buffer}
   */
  getSenderPublicKey () {
    if (!this._senderPubKey || !this._senderPubKey.length) {
      if (!this.verifySignature()) throw new Error('Invalid Signature')
    }
    return this._senderPubKey
  }

  /**
   * Determines if the signature is valid
   * @return {Boolean}
   */
  verifySignature () {
    const msgHash = this.hash(false)

    // All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
    if (this._pangu && new BN(this.s).cmp(N_DIV_2) === 1) {
    // if (this._pangu && new BigNumber(this.s).cmp(N_DIV_2) === 1) {  
      return false
    }


    try {
      let v = txutil.bufferToInt(this.v)
          // console.log("v value:", v);
      if (this._chainId > 0) {
        v -= this._chainId * 2 + 8
      }
      
      this._senderPubKey = txutil.ecrecover(msgHash, v, this.r, this.s)
      
      // console.log('public key:', this._senderPubKey.toString('hex'))

    } catch (e) {
      return false
    }

    return !!this._senderPubKey
  }

  /**
   * sign a transaction with a given a private key
   * @param {Buffer} privateKey
   */
  sign (privateKey) {
    const msgHash = this.hash(false)
    // console.log("Sign the hash with  chainID", this._chainId)

    const sig = txutil.ecsign(msgHash, privateKey)

    if (this._chainId > 0) {
      sig.v += this._chainId * 2 + 8
    }
    // console.log("Signed sig:", sig.toString('hex'));

    Object.assign(this, sig)
  }

  /**
   * The amount of gas paid for the data in this tx
   * @return {BN}
   */
  getDataFee () {
    const data = this.raw[5]
    const cost = new BN(0)
    // const cost = new BigNumber(0)
    for (let i = 0; i < data.length; i++) {
      data[i] === 0 ? cost.iaddn(fees.txDataZeroGas.v) : cost.iaddn(fees.txDataNonZeroGas.v)
    }
    return cost
  }

  /**
   * the minimum amount of gas the tx must have (DataFee + TxFee + Creation Fee)
   * @return {BN}
   */
  getBaseFee () {
    const fee = this.getDataFee().iaddn(fees.txGas.v)
    if (this._pangu && this.toCreationAddress()) {
      fee.iaddn(fees.txCreation.v)
    }
    return fee
  }

  /**
   * the up front amount that an account must have for this transaction to be valid
   * @return {BN}
   */
  getUpfrontCost () {
    return new BN(this.gasLimit)
      .imul(new BN(this.gasPrice))
      .iadd(new BN(this.value))
    // return new BigNumber(this.gasLimit)
    //     .times(new BigNumber(this.gasPrice))
    //     .plus(new BigNumber(this.value))
  }

  /**
   * validates the signature and checks to see if it has enough gas
   * @param {Boolean} [stringError=false] whether to return a string with a dscription of why the validation failed or return a Bloolean
   * @return {Boolean|String}
   */
  validate (stringError) {
    const errors = []
    if (!this.verifySignature()) {
      errors.push('Invalid Signature')
    }

    if (this.getBaseFee().cmp(new BN(this.gasLimit)) > 0) {
    // if (this.getBaseFee().cmp(new BigNumber(this.gasLimit)) > 0) {  

      errors.push([`gas limit is too low. Need at least ${this.getBaseFee()}`])
    }

    if (stringError === undefined || stringError === false) {
      return errors.length === 0
    } else {
      return errors.join(' ')
    }
  }
}

module.exports = Transaction
