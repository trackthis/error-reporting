// Defining vars

var co           = require('co'),
    tter         = require('../index'),
    assert       = require('assert'),
    baseReporter = null,
    baseArray    = [];

require('co-mocha');

describe('fork', function() {

  it('create base reporter', function * () {
    baseReporter = tter({
      scope     : 'test/index.js',
      reportArr : baseArray
    });
    baseReporter('error');
    assert.equal(baseArray.length, 1);
  });
    
  it('fork reporter (only scope)', function * () {
    var reporter = baseReporter.fork('test/index.js');
    reporter('error');
    assert.equal(baseArray.length, 2);
  });

  it('fork reporter (new array)', function * () {
    var errors   = [],
        reporter = baseReporter.fork({
          scope     : 'test/index.js',
          reportArr : errors
        });
    reporter('error');
    assert.equal(baseArray.length, 2);
    assert.equal(errors.length, 1);
  });
  
  it('fork reporter (used array)', function * () {
    var errors   = ['val1'],
        reporter = baseReporter.fork({
          scope     : 'test/index.js',
          reportArr : errors
        });
    reporter('error');
    assert.equal(errors.length, 2);
  });

  // // REMOVED FUNCTIONALITY
  // it('fork reporter (level 2)', function * () {
  //   var errors   = [],
  //       reporter = baseReporter.fork({
  //         reportArr : errors,
  //         level     : 3
  //       });
  //   reporter(2, 'error');
  //   assert.equal(errors.length, 1);
  //   reporter(4, 'error');
  //   assert.equal(errors.length, 1);
  //   assert.equal(errors[0].level, 'ERROR');
  // });

  // // REMOVED FUNCTIONALITY
  // it('fork reporter (level \'error\')', function * () {
  //   var errors   = [],
  //       reporter = baseReporter.fork({
  //         reportArr : errors,
  //         level     : 'error'
  //       });
  //   reporter(3, 'error');
  //   assert.equal(errors.length, 0);
  //   reporter(1, 'error');
  //   assert.equal(errors.length, 1);
  //   assert.equal(errors[0].level, 'FATAL');
  // });
    
  it('fork reporter (defaultLevel 3)', function * () {
    var errors   = [],
        reporter = baseReporter.fork({
          reportArr    : errors,
          defaultLevel : 3
        });
    reporter('error');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].level, 'WARN');
  });

  it('fork reporter (defaultLevel \'warn\')', function * () {
    var errors   = [],
        reporter = baseReporter.fork({
          reportArr    : errors,
          defaultLevel : 'warn'
        });
    reporter('error');
    assert.equal(errors.length, 1);
    assert.equal(errors[0].level, 'WARN');
  });

  it('fork reporter (custom report function)', function * () {
    var errors   = [],
        reporter = baseReporter.fork({
          reportArr: errors,
          reporters: [ function () { errors.push({test: 'test'}); } ],
        });
    reporter('error');
    assert.equal(errors.length, 2);
    assert.equal(errors[0].level, 'INFO');
    assert.equal(errors[1].test, 'test');
  });

  /* end test */
});
