const BN = require('bn.js');
const numberToBN = require('number-to-bn');

const zero = new BN(0);
const negative1 = new BN(-1);

// complete ethereum unit map
const unitMap = {
      'nomc':      '0',
    'sha':       '1',
    'ksha':      '1000',
    'Ksha':      '1000',
    'femtomc':   '1000',
    'msha':      '1000000',
    'Msha':      '1000000',
    'picomc':    '1000000',
    'gsha':      '1000000000',
    'Gsha':      '1000000000',
    'nanomc':    '1000000000',
    'nano':      '1000000000',
    'xiao':      '1000000000',
    'micromc':   '1000000000000',
    'micro':     '1000000000000',
    'sand':      '1000000000000',
    'millimc':   '1000000000000000',
    'milli':     '1000000000000000',
    'mc':        '1000000000000000000',
    'kmc':       '1000000000000000000000',
    'grand':     '1000000000000000000000',
    'mmc':       '1000000000000000000000000',
    'gmc':       '1000000000000000000000000000',
    'tmc':       '1000000000000000000000000000000'
};

/**
 * Returns value of unit in Wei
 *
 * @method getValueOfUnit
 * @param {String} unit the unit to convert to, default ether
 * @returns {BigNumber} value of the unit (in Wei)
 * @throws error if the unit is not correct:w
 */
function getValueOfUnit(unitInput) {
  const unit = unitInput ? unitInput.toLowerCase() : 'ether';
  var unitValue = unitMap[unit]; // eslint-disable-line

  if (typeof unitValue !== 'string') {
    throw new Error(`[ethjs-unit] the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(unitMap, null, 2)}`);
  }

  return new BN(unitValue, 10);
}

function numberToString(arg) {
  if (typeof arg === 'string') {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(`while converting number to string, invalid number value '${arg}', should be a number matching (^-?[0-9.]+).`);
    }
    return arg;
  } else if (typeof arg === 'number') {
    return String(arg);
  } else if (typeof arg === 'object' && arg.toString && (arg.toTwos || arg.dividedToIntegerBy)) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else { // eslint-disable-line
      return arg.toString(10);
    }
  }
  throw new Error(`while converting number to string, invalid number value '${arg}' type ${typeof arg}.`);
}

function fromSha(shaInput, unit, optionsInput) {
  var sha = numberToBN(shaInput); // eslint-disable-line
  var negative = sha.lt(zero); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;
  const options = optionsInput || {};

  if (negative) {
    sha = sha.mul(negative1);
  }

  var fraction = sha.mod(base).toString(10); // eslint-disable-line

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }

  if (!options.pad) {
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  var whole = sha.div(base).toString(10); // eslint-disable-line

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  var value = `${whole}${fraction == '0' ? '' : `.${fraction}`}`; // eslint-disable-line

  if (negative) {
    value = `-${value}`;
  }

  return value;
}

function toSha(moacInput, unit) {
  var moac = numberToString(moacInput); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;

  // Is it negative?
  var negative = (moac.substring(0, 1) === '-'); // eslint-disable-line
  if (negative) {
    moac = moac.substring(1);
  }

  if (moac === '.') { throw new Error(`[mcjs-unit] while converting number ${moacInput} to sha, invalid value`); }

  // Split it into a whole and fractional part
  var comps = moac.split('.'); // eslint-disable-line
  if (comps.length > 2) { throw new Error(`[ethjs-unit] while converting number ${etherInput} to sha,  too many decimal points`); }

  var whole = comps[0], fraction = comps[1]; // eslint-disable-line

  if (!whole) { whole = '0'; }
  if (!fraction) { fraction = '0'; }
  if (fraction.length > baseLength) { throw new Error(`[mcjs-unit] while converting number ${etherInput} to sha, too many decimal places`); }

  while (fraction.length < baseLength) {
    fraction += '0';
  }

  whole = new BN(whole);
  fraction = new BN(fraction);
  var sha = (whole.mul(base)).add(fraction); // eslint-disable-line

  if (negative) {
    sha = sha.mul(negative1);
  }

  return new BN(sha.toString(10), 10);
}

module.exports = {
  unitMap,
  numberToString,
  getValueOfUnit,
  fromSha,
  toSha,
};
