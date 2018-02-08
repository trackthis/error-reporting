# error-reporting
Easy-to-use error reporting

## Installation

```bash
npm install --save trackthis-error-reporting
```

## Usage

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
