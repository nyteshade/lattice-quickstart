/**
 * @namespace ErrorHandlers
 * @flow
 */


/**
 * Ports can sometimes be specified as named pipes in macOS/UNIX land and as 
 * such, this function can determine which you are using.
 *
 * @method ErrorHandlers~validatePort
 * 
 * @param {string|number} port either the named port string or a port number
 * @return {string|number} a validated port number that has been ranged checked 
 * or a named port string.
 */
function validatePort(
  port: string | number,
  type: string = 'http'
): string | number | boolean {
  let num = parseInt(port, 10);

  if (isNaN(num)) {
    // named pipe
    return port;
  }

  if (num >= 0) {
    // port number
    return num;
  }

  return false;
}

/**
 * A default Express and Express compatible error handler.
 *
 * @method ErrorHandlers~DefaultErrorHandler
 * 
 * @param {[type]} error [description]
 * @constructor
 */
export function DefaultErrorHandler(type, error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let port = validatePort(this.get('ports')[type])
  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

export default DefaultErrorHandler