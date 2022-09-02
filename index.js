const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const debugApp = require('debug')('app:index');

const app = express();
const config = require('./config');

const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middleware/errorHandlers');

require('./libs/mongoose/connect.js')(config.db);

// middleware
app.disable('x-powered-by');
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(helmet());

// routers
require('./routers/auth')(app); //
require('./routers/cartones')(app); //
require('./routers/catalogos')(app); //
require('./routers/orden')(app); //
require('./routers/play')(app); //
require('./routers/main')(app); //

// 404 not found
app.use((req, res)=>{
  res.status(404).json({
    status: 404,
    body: 'error 404 not fund',
    message: 'not fund',
  });
});
// error handlers
app.use(logErrors);
app.use(wrapErrors);
app.use(errorHandler);

// catching exceptions
process.on('uncaughtException', (err) => {
  debugApp('uncaughtException :: Fatal Error');
  debugApp(err);
});
process.on('unhandledRejection', (err) => {
  debugApp('unhandledRejection :: Fatal Error');
  debugApp(err);
});

// server.listen(config.port, () => {
app.listen(config.port, () => {
  debugApp(
      `server listening on port ${
        config.port
      } in ${
      config.dev ? 'development' : 'production'
      } mode`);
});
