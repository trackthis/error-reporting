var reporter = require('./index')({
  scope: 'example',
  reporters: [[ 'INFO', console.log ]]
});


/**
 * Example error
 *
 * This is an example info report for testing the list generator. When you run
 * the tter-generate-list command, this block should always appear in it.
 *
 * @scope example
 * @level info
 */
reporter.info('Hello World');
