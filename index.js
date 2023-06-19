require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');

const createError = require('http-errors');
const mainRouter = require('./src/routes/index');
const port = 3000;

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());
app.use(xss());
app.use('/', mainRouter);
app.all('*', (req, res, next) => {
  next(new createError.NotFound());
});
app.use((err, req, res, next) => {
  const messageError = err.message || 'internal server error';
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: messageError,
  });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
