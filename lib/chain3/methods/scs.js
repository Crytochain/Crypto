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
*/
/**
 * @file scs.js
 * Developing
 * @MOAC lab
 * @date 2018
 *
 */

"use strict";

var Method = require('../method');
var Property = require('../property');

function Scs(chain3) {
    this._requestManager = chain3._requestManager;

    var self = this;

    methods().forEach(function(method) {
        method.attachToObject(self);
        method.setRequestManager(self._requestManager);
    });

    properties().forEach(function(p) {
        p.attachToObject(self);
        p.setRequestManager(self._requestManager);
    });
}

var methods = function () {
    var blockNetworkRead = new Method({
        name: 'blockNetworkRead',
        call: 'scs_blockNetworkRead',
        params: 1,
        inputFormatter: [null]
    });

    var syncEnabled = new Method({
        name: 'syncEnabled',
        call: 'scs_syncEnabled',
        params: 1,
        inputFormatter: [null]
    });

    var register = new Method({
        name: 'register',
        call: 'scs_register',
        params: 1,
        inputFormatter: [null]
    });

    return [
        blockNetworkRead,
        syncEnabled,

        register
    ];
};

var properties = function () {
    return [
        new Property({
            name: 'address',
            getter: 'scs_address'
        }),
        new Property({
            name: 'info',
            getter: 'scs_info'
        })
    ];
};


module.exports = Scs;
