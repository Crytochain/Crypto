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
// The RLP format
// Serialization and deserialization for the BytesTree type, under the following grammar:
// | First byte | Meaning                                                                    |
// | ---------- | -------------------------------------------------------------------------- |
// | 0   to 127 | HEX(leaf)                                                                  |
// | 128 to 183 | HEX(length_of_leaf + 128) + HEX(leaf)                                      |
// | 184 to 191 | HEX(length_of_length_of_leaf + 128 + 55) + HEX(length_of_leaf) + HEX(leaf) |
// | 192 to 247 | HEX(length_of_node + 192) + HEX(node)                                      |
// | 248 to 255 | HEX(length_of_length_of_node + 128 + 55) + HEX(length_of_node) + HEX(node) |

var encode = function encode(tree) {
  var padEven = function padEven(str) {
    return str.length % 2 === 0 ? str : "0" + str;
  };

  var uint = function uint(num) {
    return padEven(num.toString(16));
  };

  var length = function length(len, add) {
    return len < 56 ? uint(add + len) : uint(add + uint(len).length / 2 + 55) + uint(len);
  };

  var dataTree = function dataTree(tree) {
    if (typeof tree === "string") {
      var hex = tree.slice(2);
      var pre = hex.length != 2 || hex >= "80" ? length(hex.length / 2, 128) : "";
      return pre + hex;
    } else {
      var _hex = tree.map(dataTree).join("");
      var _pre = length(_hex.length / 2, 192);
      return _pre + _hex;
    }
  };

  return "0x" + dataTree(tree);
};

var decode = function decode(hex) {
  var i = 2;

  var parseTree = function parseTree() {
    if (i >= hex.length) throw "";
    var head = hex.slice(i, i + 2);
    return head < "80" ? (i += 2, "0x" + head) : head < "c0" ? parseHex() : parseList();
  };

  var parseLength = function parseLength() {
    var len = parseInt(hex.slice(i, i += 2), 16) % 64;
    return len < 56 ? len : parseInt(hex.slice(i, i += (len - 55) * 2), 16);
  };

  var parseHex = function parseHex() {
    var len = parseLength();
    return "0x" + hex.slice(i, i += len * 2);
  };

  var parseList = function parseList() {
    var lim = parseLength() * 2 + i;
    var list = [];
    while (i < lim) {
      list.push(parseTree());
    }return list;
  };

  try {
    return parseTree();
  } catch (e) {
    return [];
  }
};

module.exports = { encode: encode, decode: decode };