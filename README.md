# error-reporting
Easy-to-use error reporting

[![Codetree](https://codetree.com/images/managed-with-codetree.svg)](https://codetree.com/projects/gX1r)

[![npm](https://img.shields.io/npm/v/trackthis-error-reporting.svg?style=flat-square)](https://npmjs.com/package/trackthis-error-reporting/)
[![Scrutinizer Build](https://img.shields.io/scrutinizer/build/g/trackthis/error-reporting.svg?style=flat-square)](https://scrutinizer-ci.com/g/trackthis/error-reporting/)
[![Scrutinizer](https://img.shields.io/scrutinizer/g/trackthis/error-reporting.svg?style=flat-square)](https://scrutinizer-ci.com/g/trackthis/error-reporting/)
[![Scrutinizer Coverage](https://img.shields.io/scrutinizer/coverage/g/trackthis/error-reporting.svg?style=flat-square)](https://scrutinizer-ci.com/g/trackthis/error-reporting/)
[![npm](https://img.shields.io/npm/l/trackthis-error-reporting.svg?style=flat-square)](https://npmjs.com/package/trackthis-error-reporting/)

## Installation

```bash
npm install --save trackthis-error-reporting
```

## Usage

```js

// Load the module
var tter     = require('trackthis-error-reporting');

// Initialize a reporter with default values in scope 'scope'
var reporter = tter('scope');

// Use the reporter to log 'Hello World'
// Outputs (console.log) { code: '2ML7WOXUP2NAM.26PZVO9P3TYEP', level: 'INFO', description: 'Hello World' }
// Returns 'Hello World'
reporter('Hello World');

// Report with a custom level
// Outputs (console.log) { code: '2ML7WOXUP2NAM.26PZVO9P3TYEP', level: 'FATAL', description: 'Hello World' }
// Returns 'Hello World'
reporter( tter.level.FATAL, 'Hello World' );

// Initialize a reporter which saves the errors into an array of ours
var logArr         = [],
    customReporter = reporter.fork({ reportArr: logArr });

// Outputs (console.log) { code: '2ML7WOXUP2NAM.26PZVO9P3TYEP', level: 'INFO', description: 'Hello World' }
// Outputs (console.log) { code: '2ML7WOXUP2NAM.URTTQPNTWFPA' , level: 'INFO', description: 'foobar'      }
// Returns 'Hello World'
// Returns 'foobar'
customReporter( 'Hello World' );
customReporter( 'foobar' );

// Outputs [ { code: '2ML7WOXUP2NAM.26PZVO9P3TYEP', level: 'INFO', description: 'Hello World' },
//           { code: '2ML7WOXUP2NAM.URTTQPNTWFPA' , level: 'INFO', description: 'foobar'      }
//         ]
console.log(logArr);
```

## Examples

Reporting an error for missing data

```js
// Create the reporter for this file
// I suggest using the filename as scope (__filename in nodejs)
var tter     = require('trackthis-error-reporting'),
    reporter = tter('scope');

// An example function that fetches the user from it's cookie
function fetchUser( request, response, resolve, reject ) {
  
  // Log the errors into response.data.errors as well
  var reporter = reporter.fork({ reportArr: response.data.errors });
  
  // Fetch the user data from the cookie
  var cookieData = decodeCookie(request.headers['cookie']),
      userData   = cookieData && cookieData.jwt || false;
  
  // Return whether we were successful
  if ( userData ) {
    resolve(userData);
  } else {
    
    // Use the default reporting level
    reject(reporter( 'user-not-found' ));
    
    // Or with custom reporting level
    reject(reporter( tter.level.WARN, 'user-not-found' ));
  }
}
```

## Contributing

First, look at the [issues page](https://github.com/trackthis/error-reporting/issues) to ensure your issue isn't already known. If it's not, you can create a new issue with a detailed description of what happened & how to reproduce the unexpected behavior.

If you decide to take on the challenge of fixing a known (or unknown) issue, you can do so by sending in a pull request from your own fork of the project. Once it has been tested (manually for now) and approved, it will be merged into the master branch of the repository.
