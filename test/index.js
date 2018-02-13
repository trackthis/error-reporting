var tter     = require('../index'),
    reporter = tter('test/index.js');

/**
 * Example reporter trigger
 *
 * Hello World
 *
 * @scope [relpath]
 * @description Hello World
 */
reporter('Hello World');
