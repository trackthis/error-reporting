// Defining vars

var co       = require('co'),
    tter     = require('../index'),
    assert   = require('assert'),
    reporter = null;

require('co-mocha');

describe('\n\n ####### error reporting #######', function() {
  
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
  
  describe('fork', function() {

    it('fork reporter (new array)', function * () {
      var _errors = [],
          _report = tter({
            scope     : 'test/index.js',
            reportArr : _errors
          });
      _report('error 1');
      var errors2 = [],
          report2 = _report.fork({
            scope     : 'test/index.js',
            reportArr : errors2
          })
      report2('error 2');
      assert.equal(_errors.length, 1);
      assert.equal(errors2.length, 1);
    });
    
    it('fork reporter (new array)', function * () {
      var _errors = [],
          _report = tter({
            scope     : 'test/index.js',
            reportArr : _errors
          });
      _report('error 1');
      var report2 = _report.fork({
            scope     : 'test/index.js',
            reportArr : _errors
          })
      report2('error 2');
      assert.equal(_errors.length, 2);
    });

  });
  
  describe('level', function() {

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
      assert.equal(errors[0].level, 'FATAL');
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
  
  describe('custom level report', function() {

    it('report level OFF', function * () {
      var errors = [],
          report = tter({
            scope     : 'test/index.js',
            reportArr : errors
          });
      report('OFF', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'OFF');
    });
    
    it('new reporter ready to be forked by below tests (max level 7)', function * () {
      reporter = tter({
        scope : 'test/index.js',
        level : 7
      });
    });

    it('report level 0', function * () {
      var errors = [],
          report = reporter.fork({
            scope     : 'test/index.js',
            reportArr : errors
          });
      report(0, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'OFF');
    });
    
    it('report level FATAL', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('FATAL', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'FATAL');
    });

    it('report level 1', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(1, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'FATAL');
    });
    
    it('report level ERROR', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('ERROR', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'ERROR');
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
    
    it('report level WARN', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('WARN', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'WARN');
    });

    it('report level 3', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(3, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'WARN');
    });
    
    it('report level INFO', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('INFO', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'INFO');
    });

    it('report level 4', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(4, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'INFO');
    });
    
    it('report level DEBUG', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('DEBUG', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'DEBUG');
    });

    it('report level 5', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(5, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'DEBUG');
    });
    
    it('report level TRACE', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('TRACE', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'TRACE');
    });

    it('report level 6', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(6, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'TRACE');
    });
    
    it('report level ALL', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report('ALL', 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'ALL');
    });

    it('report level 7', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report(7, 'error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'ALL');
    });

  });
  
  describe('shortcuts report functions', function() {
    
    it('base reporter level 7', function * () {
      reporter = tter({
        scope : 'test/index.js',
        level : 7
      });
    });

    it('report.fatal', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.fatal('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'FATAL');
    });

    it('report.err', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.err('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'ERROR');
    });

    it('report.error', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.error('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'ERROR');
    });

    it('report.warn', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.warn('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'WARN');
    });

    it('report.warning', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.warning('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'WARN');
    });

    it('report.info', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.info('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'INFO');
    });

    it('report.debug', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.debug('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'DEBUG');
    });

    it('report.trace', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors
          });
      report.trace('error');
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'TRACE');
    });

  });

  describe('defaultLevel', function() {
    
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
      console.log(errors)
      assert.equal(errors.length, 1);
      assert.equal(errors[0].level, 'INFO');
    });

  });

  describe('custom report', function() {
    
    it('base reporter', function * () {
      reporter = tter('test/index.js');
    });

    it('report', function * () {
      var errors = [],
          report = reporter.fork({
            reportArr : errors,
            report    : function (err) {
              errors.push({
                test : 'test'
              });
            }
          });
      report('error');
      console.log(errors)
      assert.equal(errors.length, 2);
      assert.equal(errors[0].level, 'INFO');
      assert.equal(errors[1].test, 'test');
    });

  });
});
