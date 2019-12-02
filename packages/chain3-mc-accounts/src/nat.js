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
  
*/
var BN = require("bn.js");
var Bytes = require("./bytes");

var fromBN = function fromBN(bn) {
  return "0x" + bn.toString("hex");
};

var toBN = function toBN(str) {
  return new BN(str.slice(2), 16);
};

var fromString = function fromString(str) {
  var bn = "0x" + (str.slice(0, 2) === "0x" ? new BN(str.slice(2), 16) : new BN(str, 10)).toString("hex");
  return bn === "0x0" ? "0x" : bn;
};

// Convert from moac to sha 1e-18
var toMc = function toMc(sha) {
  return toNumber(div(sha, fromString("10000000000"))) / 100000000;
};

//
var fromMc = function fromMc(mc) {
  return mul(fromNumber(Math.floor(mc * 100000000)), fromString("10000000000"));
};

var toString = function toString(a) {
  return toBN(a).toString(10);
};

var fromNumber = function fromNumber(a) {
  return typeof a === "string" ? /^0x/.test(a) ? a : "0x" + a : "0x" + new BN(a).toString("hex");
};

var toNumber = function toNumber(a) {
  return toBN(a).toNumber();
};

var toUint256 = function toUint256(a) {
  return Bytes.pad(32, a);
};

var bin = function bin(method) {
  return function (a, b) {
    return fromBN(toBN(a)[method](toBN(b)));
  };
};

var add = bin("add");
var mul = bin("mul");
var div = bin("div");
var sub = bin("sub");

module.exports = {
  toString: toString,
  fromString: fromString,
  toNumber: toNumber,
  fromNumber: fromNumber,
  toMc: toMc,
  fromMc: fromMc,
  toUint256: toUint256,
  add: add,
  mul: mul,
  div: div,
  sub: sub
};