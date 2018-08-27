// Defining vars

var co       = require('co'),
    tter     = require('../index'),
    assert   = require('assert'),
    reporter = null;

require('co-mocha');

describe('filterErrors function', function() {
      
  it('base reporter', function * () {
    reporter = tter('test/index.js');
  });

  it('filterErrors [no args]', function * () {
    assert.equal(reporter.filterErrors().length, 0);
  });

  it('filterErrors [no args]', function * () {
    var errors = [],
        report = reporter.fork({
          reportArr : errors
        });
    report.debug('debug');
    report.fatal('fatal');
    assert.equal(report.filterErrors().length, 1);
  });

  it('filterErrors [custom level]', function * () {
    var errors = [],
        report = reporter.fork({
          reportArr : errors
        });
    report.debug('debug');
    report.err('error');
    report.fatal('fatal');
    assert.equal(report.filterErrors('fatal').length, 1);
  });

  it('filterErrors [custom array]', function * () {
    var errors1 = [],
        errors2 = [],
        report1 = reporter.fork({
          reportArr : errors1
        }),
        report2 = reporter.fork({
          reportArr : errors2
        });
    report1.debug('debug');
    report2.debug('debug');
    report2.fatal('fatal');
    assert.equal(report2.filterErrors(null, errors1).length, 0);
    assert.equal(report1.filterErrors(null, errors2).length, 1);
  });

  it('filterErrors [custom array, custom level]', function * () {
    var errors1 = [],
        errors2 = [],
        report1 = reporter.fork({
          reportArr : errors1,
          level     : 7
        }),
        report2 = reporter.fork({
          reportArr : errors2,
          level     : 7
        });
    report1.debug('debug');
    report2.err('error');
    report2.fatal('fatal');
    assert.equal(report2.filterErrors(7, errors1).length, 1);
    assert.equal(report1.filterErrors(1, errors2).length, 1);
    assert.equal(report1.filterErrors('no-level', errors2).length, 2);
  });

  /* end test */
});
