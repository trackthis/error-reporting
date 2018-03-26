// Defining vars

var co       = require('co'),
    tter     = require('../index'),
    assert   = require('assert'),
    reporter = null;

require('co-mocha');

describe('\n\n ####### fork function #######', function() {
    
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
          });
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
          });
      report2('error 2');
      assert.equal(_errors.length, 2);
    });

  });

});
