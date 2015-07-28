'use strict';

var chai = require('chai')
  , expect = chai.expect
//, logger = require('hw-logger')
//, log = logger.log
  , p = require('../lib/hw-promise');

describe('hw-promise', function () {
  var count;

  function doAsync(error) {
    return function (resolve, reject) {
      setTimeout(function () {
        if (error) {
          reject(error);
        } else {
          count = count % 2 === 1 ? count * 2 : count + 1;
          resolve(count);
        }
      }, 1);
    };
  }

  function doPromise(error) {
    return new p(doAsync(error));
  }

  beforeEach(function () {
    count = 0;
  });

  it('should build a promise', function () {
    return new p(doAsync())
      .then(function (result) {
        expect(result).to.equal(1);
      });
  });

  it('should reject', function () {
    return new p(doAsync({msg: 'test error'}))
      .catch(function (err) {
        expect(err).to.eql({msg: 'test error'});
      });
  });

  it('should use do', function () {
    return p.do(
      doPromise,
      function (result) {
        expect(result).to.equal(1);
      }
    );
  });

  it('should use do and reject', function () {
    return p.do(doPromise.bind(null, {msg: 'test error'}))
      .catch(function (err) {
        expect(err).to.eql({msg: 'test error'});
      });
  });

  it('should use multi do', function () {
    return p.do(
      doPromise.bind(null, null),
      doPromise.bind(null, null),
      doPromise.bind(null, null),
      doPromise.bind(null, null),
      doPromise.bind(null, null),
      doPromise.bind(null, null),
      function (result) {
        expect(result).to.equal(14);
      }
    );
  });

  it('should use forIn', function () {
    return p.forIn({a: 3}, function (value, name) {
      expect(value).to.equal(3);
      expect(name).to.equal('a');
    });
  });

});