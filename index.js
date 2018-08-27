var main = module.exports = function( options ) {

  // Sanitize our inputs
  if ('string' === typeof options) { options = {scope: options}; }
  if ('object' !== typeof options) options = {};
  options = options || {};

  // Make the scope clear & track errors
  options.scope        = options.scope || '';
  options.reportArr    = Array.isArray(options.reportArr) ? options.reportArr : false;
  options.defaultLevel = options.defaultLevel || 'INFO';
  if('number'===typeof options.defaultLevel) options.defaultLevel = main.level[options.defaultLevel];
  options.defaultLevel = options.defaultLevel.toUpperCase();
  if(!(options.defaultLevel in main.level)) options.defaultLevel = 'INFO';

  // Sanitize the reporters
  options.reporters = (options.reporters||[]).reduce(function(reporters,reporter) {

    // Minimal sanitation
    if(!reporter) return reporters;
    if('object'!==typeof reporter) return reporters;

    // Array support
    if( Array.isArray(reporter) && (reporter.length === 2) ) {
      reporter = {
        level   : reporter[0],
        callback: reporter[1],
      };
    }

    // Validate components
    if('function'!==typeof reporter.callback) return reporters;
    if('string'===typeof reporter.level) reporter.level = main.level[reporter.level.toUpperCase()];
    if('number'!==typeof reporter.level) return reporters;

    // Add to our list
    reporters.push(reporter);
    return reporters;
  },[]);

  // To clean ourselves from the stack
  function cleanStack(stack) {
    stack = stack.split("\r\n").join("\n");
    stack = stack.split("\r").join("\n");
    stack = stack.split("\n");
    stack.shift(); // Error
    stack.shift(); //   at index.js:<N>
    return ['Error'].concat(stack).join("\n");
  }

  // Reports a sanitized message to all listeners
  function report( message ) {
    var txtLevel = main.level[message.level],
        msg      = Object.assign({},message,{level:txtLevel});
    // console.log(options);
    if(options.reportArr) options.reportArr.push(msg);
    options.reporters.forEach(function(reporter) {
      if ( reporter.level < message.level ) return;
      reporter.callback(msg);
    });
  }

  // What we're returning to the caller
  var reporter = function( level, message ) {
    if('undefined'===typeof message) {
      message = level;
      level   = options.defaultLevel;
    }
    if('number'===typeof level) level = main.level[level];
    if('string'!==typeof level) level = options.defaultLevel;
    if(!(level.toUpperCase() in main.level)) level = options.defaultLevel;
    return commonReport(level.toUpperCase(), {stack:cleanStack(new Error().stack),message});
  };

  // The common action for all levels
  function commonReport( level, message ) {
    var msg = { level: main.level[level], scope: options.scope, message: 'Fatal error', stack: false };
    message = message || msg.message;
    if('string'===typeof message) msg.message = message;
    if('object'!==typeof message) message = {};
    msg.stack   = message.stack   || cleanStack(new Error().stack);
    msg.message = message.message || msg.message;
    report(msg);
  }

  // Attach all levels
  reporter.fatal   = commonReport.bind(undefined,'FATAL');
  reporter.error   = commonReport.bind(undefined,'ERROR');
  reporter.err     = commonReport.bind(undefined,'ERROR');
  reporter.warning = commonReport.bind(undefined,'WARN');
  reporter.warn    = commonReport.bind(undefined,'WARN');
  reporter.info    = commonReport.bind(undefined,'INFO');
  reporter.debug   = commonReport.bind(undefined,'DEBUG');
  reporter.trace   = commonReport.bind(undefined,'TRACE');

  // Allow forking a.k.a. extending the options
  reporter.fork = function( extraOptions ) {
    if ('string' === typeof extraOptions) extraOptions = {scope: extraOptions};
    return main(Object.assign({},options,extraOptions));
  };

  // Filtering errors
  reporter.filterErrors = function(errLevel, reportArr) {
    reportArr = reportArr || options.reportArr;
    errLevel  = errLevel || options.defaultLevel;
    if(!reportArr) return [];
    if('string'===typeof errLevel) errLevel = main.level[errLevel.toUpperCase()];
    if('undefined'===typeof errLevel) errLevel = main.level.ALL;
    if(!errLevel) return [];
    return reportArr.filter(function(err) {
      return errLevel >= main.level[err.level.toUpperCase()];
    });
  };

  return reporter;
};

// Register the logging levels
main.level = {
  OFF   : 0, 0: 'OFF',
  FATAL : 1, 1: 'FATAL',
  ERROR : 2, 2: 'ERROR',
  WARN  : 3, 3: 'WARN',
  INFO  : 4, 4: 'INFO',
  DEBUG : 5, 5: 'DEBUG',
  TRACE : 6, 6: 'TRACE',
  ALL   : 7, 7: 'ALL'
};
