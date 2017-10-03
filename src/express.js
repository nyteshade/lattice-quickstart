import express from 'express'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import graphql from './routes/graphql'

// setup Express instance to be configured
const server = express();

// uncomment after placing your favicon in /public
server.use(logger(process.env.NODE_ENV || 'dev'))
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))
server.use(cookieParser())

// routes
server.use('/', graphql)
server.use('/', (req, res, next) => res.redirect('/graphql'))

// catch 404 and forward to error handler
server.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
server.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default server;
