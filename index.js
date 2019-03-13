var Chain3 = require('./lib/chain3');

// dont override global variable
if (typeof window !== 'undefined' && typeof window.Chain3 === 'undefined') {
    window.Chain3 = Chain3;
}

if ( typeof window !== 'undefined' && typeof window.moac === 'undefined'){
    window.moac = Chain3;
}

module.exports = Chain3;
