const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {errorMiddleware} = require('./src/middlewares/error.middleware.js')
const publicRoute = require('./src/routes/public.routes.js')
const api = require('./src/routes/private.routes.js')
const cors = require('cors')

const app = express();

const corsOption = {
    origin : "*"
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOption))

app.use(errorMiddleware)
app.use(publicRoute)
app.use(api)


module.exports = app;
 