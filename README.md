# MOAC JavaScript API version 0.1.13.

This is the [MOAC](https://github.com/MOACChain/moac-core) compatible JavaScript API which implements the Generic JSON RPC spec as described in the Chain3.md. It's available on npm as a node module, for bower and component as an embeddable js and as a meteor.js package.

* v0.1.13 Added scs_getBlockList method.
* v0.1.12 Fixed Readme and missing scs_getMicroChainInfo method.
* v0.1.11 Added scs method getMicroChainInfo to work with subchain explorer.
* v0.1.10 Added vnode and scs methods to work with MicroChains.
* v0.1.9 Added new method to get ip for local node.
* v0.1.8 Moved git repository to https://github.com/MOACChain/chain3 and fixed some bugs.
* v0.1.7 Fixed uneven signature R & S.
* v0.1.6 A complete package with all tests.
* v0.1.4 First compatible version with MOAC chain.

Some of the methods require running a local MOAC node to use this library.
To use vnode methods, need to enable the vnode APIs in MOAC node by:
--rpc --rpcport "8545" --rpcapi "chain3,mc,net,vnode"

To use scs methods, need to enable the SCS RPC ports by:
--rpc

More information is in Chain3.md or [MOAC wiki](https://github.com/MOACChain/moac-core/wiki/Chain3).


## Installation

### Node.js

```bash
npm install chain3
```

### As Browser module
Bower

```bash
bower install chain3
```
### Meteor.js

```bash
meteor add moaclib:chain3
```


* Include `chain3.min.js` in your html file. (not required for the meteor package)

## Usage
Use the `chain3` object directly from global namespace:

```js
var Chain3 = require('chain3');
var chain3 = new Chain3();
console.log(chain3); // {mc: .., net: ...} // it's here!
```

Set a provider (HttpProvider) with VNODE:

```js
if (typeof chain3 !== 'undefined') {
  chain3 = new Chain3(chain3.currentProvider);
} else {
  // set the provider you want from Chain3.providers
  chain3 = new Chain3(new Chain3.providers.HttpProvider("http://localhost:8545"));
}
```

Set a provider (HttpProvider using [HTTP Basic Authentication](https://en.wikipedia.org/wiki/Basic_access_authentication))

```js
chain3.setProvider(new chain3.providers.HttpProvider('http://host.url', 0, BasicAuthUsername, BasicAuthPassword));
```

There you go, now you can use it:

```js
var coinbase = chain3.mc.coinbase;
var balance = chain3.mc.getBalance(coinbase);
```

To work with SCS servers, need to enable the rpc port on SCS monitors
and set the scsProvider for chain3. 

```js
if (typeof chain3 !== 'undefined') {
  chain3 = new Chain3(chain3.currentProvider);
} else {
  // set the provider you want from Chain3.providers
  chain3 = new Chain3(new Chain3.providers.HttpProvider("http://localhost:8545"));
  chain3.setScsProvider(new chain3.providers.HttpProvider('http://localhost:8548'));
}
```

After set the SCS monitor, now you can use it:

```js
mclist=chain3.scs.getMicroChainList();
console.log("SCS MicroChain List:", mclist);

console.log("MicroChain state:", chain3.scs.getDappState(mclist[0]));
console.log("MicroChain blockNumber:", chain3.scs.getBlockNumber(mclist[0]));
```

More examples are under the example directory

## Contribute!

### Requirements

* Node.js
* npm

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy
```

### Building (gulp)
Require install gulp (https://gulpjs.com/) in the system:

```bash
npm run-script build
```


### Testing (mocha)
Test all cases.
May need to install package mocha first.

```bash
mocha
```

Test a singe function.

```bash
mocha test/chain3.mc.coinbase.js 
```

## Some examples

### send_mc

Example codes to send moac through signed transaction.

	var rawTx = {
	      from: src.addr,
	      nonce: chain3.intToHex(txcount),
	      gasPrice: chain3.intToHex(2000000000),
  	      gasLimit: chain3.intToHex(2000),
	      to: '0xf1f5b7a35dff6400af7ab3ea54e4e637059ef909',
	      value: chain3.intToHex(chain3.toSha(value, 'mc')), 
	      data: '0x00',
	      chainId: chainid
	    }
		
	var cmd1 = chain3.signTransaction(rawTx, src["key"]);
	    
	chain3.mc.sendRawTransaction(cmd1, function(err, hash) {
	    if (!err){
	        console.log("Succeed!: ", hash);
	        return hash;
	    }else{
	        console.log("Chain3 error:", err.message);
	        return err.message;
	    }
});


### contract_deploy

Deploy a contract through chain3 RPC calls. This example requires install solc 
`solc`

build a web server to access
the MOAC network using this API library.


### Accounts use the following library for generating private key.

[browserify-cryptojs](https://github.com/fahad19/crypto-js/) v0.3.1





