'use strict';

var util = require('util')
  , Promise = require('bluebird/js/release/promise')()
  , that;

that = function () {
  this.constructor = Promise;
  return this.constructor.apply(this, arguments);
};

Object.keys(Promise).forEach(function (key) {
  if (typeof Promise[key] === 'function' && typeof that[key] === 'undefined') {
    that[key] = Promise[key].bind(that);
  }
});

util.inherits(that, Promise);

that.forIn = function (o, iterator) {
  return that.each(Object.keys(o), function (name) {
    return iterator(o[name], name);
  });
};

that.do = function (f) {
  var args, promise;
  args = Array.prototype.slice.call(arguments);
  args.shift();
  promise = that.resolve().then(f);
  if (args.length) {
    promise = args.reduce(function (promise, f) {
      return promise.then(f);
    }, promise);
  }
  return promise;
};

exports = module.exports = that;