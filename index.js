var slash = require('slashjs');

/**
 * The module initializer
 *
 * @param fname
 */
var tter = module.exports = function( options ) {
  if ( 'string' === typeof options ) options = { filename: options };
  options              = options || {};
  options.filename     = options.filename || '';
  options.filehash     = slash(options.filename);
  options.report       = options.report || console.log;
  options.reportArr    = options.reportArr || null;
  options.level        = options.level || tter.level.INFO;
  options.defaultLevel = options.defaultLevel || tter.level.INFO;
  if(isNaN(options.level)) options.level = parseInt(tter.level[options.level.toUpperCase()]);
  if(isNaN(options.defaultLevel)) options.defaultLevel = parseInt(tter.level[options.defaultLevel.toUpperCase()]) || tter.level.INFO;

  // The reporter called by the 'client'
  function reporter( level, description ) {
    if ('undefined' === typeof description ) { description = level ; level = options.defaultLevel; }
    if(isNaN(level)) level = tter.level[level.toUpperCase()] || tter.level.INFO;
    if ( level > options.level ) return;
    var code = options.filehash + '.' + slash(description),
        err  = { code: code, level: tter.level[level] };
    if (options.reportArr) options.reportArr.push(err);
    options.report(err);
    return description;
  }

  // Fork, to add some more options
  reporter.fork = function( extraOptions ) {
    var newOptions = Object.assign({},options);
    newOptions = Object.assign(newOptions,extraOptions);
    return tter(newOptions);
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
