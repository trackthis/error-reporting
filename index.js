var slash = require('slashjs');

/**
 * The module initializer
 *
 * @param options
 */
var tter = module.exports = function( options ) {
  if ( 'string' === typeof options ) options = { scope: options };
  options              = options || {};
  options.scope        = options.scope || '';
  options.scopeHash    = slash(options.scope);
  options.report       = options.report || console.log;
  options.reportArr    = options.reportArr || null;
  options.level        = (!isNaN(options.level)) ? options.level : tter.level.INFO;
  options.defaultLevel = (!isNaN(options.defaultLevel)) ? options.defaultLevel : tter.level.INFO;
  if(isNaN(options.level)) {
    options.level = parseInt(tter.level[options.level.toUpperCase()]) || tter.level.INFO;
  }
  if(isNaN(options.defaultLevel)) {
    options.defaultLevel = parseInt(tter.level[options.defaultLevel.toUpperCase()]) || tter.level.INFO;
  }

  /**
   * The reporter function for the client
   *
   * @param level
   * @param description
   * @returns {*}
   */
  function reporter( level, description ) {
    if ( 'undefined' === typeof description ) { 
      description = level; 
      level = options.defaultLevel; 
    }
    if(isNaN(level)) {
      if ( level.toUpperCase() in tter.level ) {
        level = tter.level[level.toUpperCase()];
      } else {
        level = tter.level.INFO;
      }
    }
    if ( level > options.level ) {
      return description;
    }
    var code = options.scopeHash + '.' + slash(description),
        err  = { 
          code: code, 
          level: tter.level[level], 
          description: description 
        };
    if (options.reportArr) {
      options.reportArr.push(err);
    }
    options.report(err);
    return description;
  }

  /**
   * Extend the current set of options & return a separate reporter for it
   *
   * @param extraOptions
   * @returns {*}
   */
  reporter.fork = function( extraOptions ) {
    if ( 'string' === typeof extraOptions ) {
      extraOptions = { scope: extraOptions };
    }
    return tter(Object.assign({},options,extraOptions));
  };

  reporter.trace = function() {
    var args = arguments;
    return reporter.apply(reporter,[tter.level.TRACE].concat(Object.keys(args).map(function(k) {
      return args[k];
    })));
  };

  reporter.debug = function() {
    var args = arguments;
    return reporter.apply(reporter,[tter.level.DEBUG].concat(Object.keys(args).map(function(k) {
      return args[k];
    })));
  };

  reporter.info = function() {
    var args = arguments;
    return reporter.apply(reporter,[tter.level.INFO].concat(Object.keys(args).map(function(k) {
      return args[k];
    })));
  };

  reporter.warn = reporter.warning = function() {
    var args = arguments;
    return reporter.apply(reporter,[tter.level.WARN].concat(Object.keys(args).map(function(k) {
      return args[k];
    })));
  };

  reporter.err = reporter.error = function() {
    var args = arguments;
    return reporter.apply(reporter,[tter.level.ERROR].concat(Object.keys(args).map(function(k) {
      return args[k];
    })));
  };

  reporter.fatal = function() {
    var args = arguments;
    return reporter.apply(reporter,[tter.level.FATAL].concat(Object.keys(args).map(function(k) {
      return args[k];
    })));
  };

  return reporter;
};

// Register the logging levels
tter.level = {
  OFF   : 0, 0: 'OFF',
  FATAL : 1, 1: 'FATAL',
  ERROR : 2, 2: 'ERROR',
  WARN  : 3, 3: 'WARN',
  INFO  : 4, 4: 'INFO',
  DEBUG : 5, 5: 'DEBUG',
  TRACE : 6, 6: 'TRACE',
  ALL   : 7, 7: 'ALL'
};
