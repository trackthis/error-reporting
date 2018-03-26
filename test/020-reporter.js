// Defining vars

var co       = require('co'),
    tter     = require('../index'),
    assert   = require('assert'),
    reporter = null;

require('co-mocha');

describe('\n\n ####### reporter #######', function() {
  
  describe('new reporter', function() {

    it('new reporter without array', function * () {
      var report = tter('test/index.js');
      report('error');
    });
    
    it('new reporter with scope, array', function * () {
      var errors = [],
          report = tter({
            scope     : 'test/index.js',
            reportArr : errors
          });
      report('error');
      assert.equal(errors.length, 1);
    });
  });
  
  describe('custom level option', function() {

    it('base reporter max level 3', function * () {
      reporter = tter({
        scope : 'test/index.js',
        level : 3
      });
    });

    it('report level 2', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(2, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'ERROR');
    });

    it('report level 4', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(4, 'error');
      assert.equal(errors.length, 0);
    });

    it('base reporter max level string', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors,
            level : 'error'
          });
      report(7, 'error');
      assert.equal(errors.length, 0);
      report(3, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'WARN');
    });

  });

  describe('defaultLevel option', function() {
    
    it('base reporter defaultLevel 5', function * () {
      reporter = tter({
        reportArr    : [],
        defaultLevel : 2
      });
    });

    it('report', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'ERROR');
    });

    it('base reporter defaultLevel string', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors,
            defaultLevel : 'error'
          });
      report('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'INFO');
    });

  });

  describe('custom report option', function() {
    
    it('base reporter', function * () {
      reporter = tter('test/index.js');
    });

    it('report', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors,
            report    : function () {
              errors.push({
                test : 'test'
              });
            }
          });
      report('error');
      assert.equal(errors.length, 2);
      assert.equal(errors[0].level, 'INFO');
      assert.equal(errors[1].test, 'test');
    });

  });
});
