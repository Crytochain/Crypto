# MOAC JavaScript API version 1.0.0.
This documentation is under construction and documents the 1.0.x alpha versions of chain3.js. 
The current stable version of chain3.js is 0.1.22 and should get preferred for production use cases.

//MOAC chain3 lib
var Chain3 = require('../packages/chain3');

var chain3 = new Chain3();

This is the MOAC compatible JavaScript API which implements the Generic JSON RPC spec as described in the Chain3.md. 

Some of the methods require running a local MOAC node to use this library.


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
More examples are under the examples directory

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



