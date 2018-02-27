var chai = require('chai');
var assert = chai.assert; 

var FakeHttpProvider = require('./FakeHttpProvider');

var methodExists = function (object, method) {
    it('should have method ' + method + ' implemented', function() {
        //chain3.setProvider(null);
        assert.equal('function', typeof object[method], 'method ' + method + ' is not implemented');
    });
};

var propertyExists = function (object, property) {
    it('should have property ' + property + ' implemented', function() {
        // set dummy providor, to prevent error, but 
        // chain3.setProvider(new FakeHttpProvider()); 
        console.log(typeof object[property]);//debug line
        // for (var p in object)
          // console.log('Pro:', p);//chain3[p]);//debug line
        assert.notEqual('undefined', typeof object[property], 'property ' + property + ' is not implemented');
    });
};

module.exports = {
    methodExists: methodExists,
    propertyExists: propertyExists
};

