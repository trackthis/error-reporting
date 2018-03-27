// Defining vars

var co       = require('co'),
    tter     = require('../index'),
    assert   = require('assert');

require('co-mocha');

describe('creating reporter', function() {
      
  it('create new reporter (only scope)', function * () {
    var reporter = tter('test/index.js');
    reporter('error');
    assert.notEqual(reporter, undefined);
  });

  it('create new reporter with scope, array', function * () {
    var errors   = [],
        reporter = tter({
          scope     : 'test/index.js',
          reportArr : errors
        });
    reporter('error');
    assert.equal(errors.length, 1);
  });

  it('report level 5 error', function * () {
    var errors   = [],
        reporter = tter({
          scope     : 'test/index.js',
          reportArr : errors
        });
    reporter(1, 'error');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].level, 'FATAL');
  });

  it('report level \'fatal\' error', function * () {
    var errors   = [],
        reporter = tter({
          scope     : 'test/index.js',
          reportArr : errors,
          level     : 'error'
        });
    reporter('fatal', 'error');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].level, 'FATAL');
  });

  it('new reporter defaultLevel 2', function * () {
    var errors   = [],
        reporter = tter({
          scope        : 'test/index.js',
          reportArr    : errors,
          defaultLevel : 2
        });
    reporter('error');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].level, 'ERROR');
  });

  it('new reporter defaultLevel \'error\'', function * () {
    var errors   = [],
        reporter = tter({
          scope        : 'test/index.js',
          reportArr    : errors,
          defaultLevel : 'error'
        });
    reporter('error');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].level, 'ERROR');
  });
  
  it('new reporter (level 3) ', function * () {
    var errors   = [],
        reporter = tter({
          scope     : 'test/index.js',
          reportArr : errors,
          level     : 3
        });
    reporter(2, 'error');
    reporter(3, 'error');
    reporter(4, 'error');
    assert.equal(errors.length, 2);
  });
  
  it('new reporter (level \'debug\')', function * () {
    var errors   = [],
        reporter = tter({
          scope     : 'test/index.js',
          reportArr : errors,
          level     : 'debug'
        });
    reporter('info', 'error');
    reporter('debug', 'error');
    reporter('trace', 'error');
    assert.equal(errors.length, 2);
  });

  it('new reporter (custom report funciton)', function * () {
    var errors   = [],
        reporter = tter({
          reportArr : errors,
          report    : function () {
            errors.push({
              test : 'test'
            });
          }
        });
    reporter('error');
    assert.equal(errors.length, 2);
    assert.equal(errors[0].level, 'INFO');
    assert.equal(errors[1].test, 'test');
  });

  /* end test */
});
