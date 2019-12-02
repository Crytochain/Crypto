# MOAC JavaScript API version 0.1.2.
Modified from ethereum:web3.js 0.20.0

var Chain3 = require('chain3');

var chain3 = new Chain3();

This is the MOAC compatible JavaScript API which implements the Generic JSON RPC spec as described in the Chain3.md. It's available on npm as a node module, for bower and component as an embeddable js and as a meteor.js package.


Some of the methods require running a local MOAC node to use this library.


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

Component

```bash
component install moac/chain3.js
```

* Include `chain3.min.js` in your html file. (not required for the meteor package)

## Usage
Use the `chain3` object directly from global namespace:

```js
console.log(chain3); // {mc: .., db: ..., net: ...} // it's here!
```

Set a provider (HttpProvider)

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

```bash
npm test
```

Test a singe function.

```bash
mocha test/chain3.mc.coinbase.js 
```

## Some extras

### A simple express server
The server directory contains the example codes to build a web server to access
the MOAC network using this API library.


### Accounts use the following library for generating private key.

[browserify-cryptojs](https://github.com/fahad19/crypto-js/) v0.3.1





