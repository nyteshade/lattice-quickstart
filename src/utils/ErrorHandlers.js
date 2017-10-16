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
 * @method ErrorHandlers~SetupErrorHandler
 *
 * @param {[type]} error [description]
 * @constructor
 */
export function SetupErrorHandler(type, error) {
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

/**
 * A typical Express middleware piece that is used when error is expected
 * as the first parameter.
 *
 * @param {mixed} err an error thrown during normal Express usage
 * @param {mixed} req an Express 4.x request object
 * @param {mixed} res an Express 4.x response object
 * @param {function} next a function to call, passed in when in use, that
 * allows the users to move to the next handler if this one can no longer
 * handle the request.
 */
export function ExpressErrorHandler(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

export default SetupErrorHandler
