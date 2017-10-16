import express from 'express'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import graphql from './routes/graphql'
import { ExpressErrorHandler } from './utils/ErrorHandlers'

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
server.use(ExpressErrorHandler);

export default server;
