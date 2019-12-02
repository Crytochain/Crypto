# chain3-mc

This is a sub package of [chain3.js][repo]

This is the Eth package to be used [chain3.js][repo].
Please read the [documentation][docs] for more.

## Installation

### Node.js

```bash
npm install chain3-mc
```

### In the Browser

Build running the following in the [web3.js][repo] repository:

```bash
npm run-script build-all
```

Then include `dist/web3-eth.js` in your html file.
This will expose the `Web3Eth` object on the window object.


## Usage

```js
// in node.js
var Chain3Mc = require('chain3-mc');

var mc = new Chain3Mc('ws://localhost:8546');
```


[docs]: http://web3js.readthedocs.io/en/1.0/
[repo]: https://github.com/ethereum/web3.js


