var formatters = require('./formatters');
var utils = require('./../utils/utils');
var Method = require('./method');
var Property = require('./property');

// TODO: refactor, so the input params are not altered.
// it's necessary to make same 'extension' work with multiple providers
var extend = function (chain3) {
    /* jshint maxcomplexity:5 */
    var ex = function (extension) {

        var extendedObject;
        if (extension.property) {
            if (!chain3[extension.property]) {
                chain3[extension.property] = {};
            }
            extendedObject = chain3[extension.property];
        } else {
            extendedObject = chain3;
        }

        if (extension.methods) {
            extension.methods.forEach(function (method) {
                method.attachToObject(extendedObject);
                method.setRequestManager(chain3._requestManager);
            });
        }

        if (extension.properties) {
            extension.properties.forEach(function (property) {
                property.attachToObject(extendedObject);
                property.setRequestManager(chain3._requestManager);
            });
        }
    };

    ex.formatters = formatters; 
    ex.utils = utils;
    ex.Method = Method;
    ex.Property = Property;

    return ex;
};



module.exports = extend;

