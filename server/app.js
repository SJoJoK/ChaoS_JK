const createError = require('http-errors');
const express = require('express');
const exjwt = require('express-jwt');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
//获得连接函数
const mongoose = require('./config/mongoose.js');
//进行连接
const db = mongoose();
const { http } = require('../.config.js')
const secret = http.secret;
const statsRouter = require('./routes/stats');
const usersRouter = require('./routes/user');
const authRouter = require("./routes/auth");
const deviceRouter = require("./routes/device");
const mapRouter = require("./routes/map");
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/user', exjwt({ secret, algorithms: ['HS256'] }));
app.use('/device', exjwt({ secret, algorithms: ['HS256'] }));
app.use('/stats', exjwt({ secret, algorithms: ['HS256'] }));
app.use('/map', exjwt({ secret, algorithms: ['HS256'] }));
app.use('/user', usersRouter);
app.use("/auth", authRouter);
app.use("/device", deviceRouter);
app.use("/stats", statsRouter)
app.use("/map", mapRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
