var _ = require('lodash');
//var async = require('async');
var bodyParser = require('body-parser');
var data = require('./subs');
var express = require('express');
var favicon = require('serve-favicon');
var hbs = require('hbs');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');
var Assignment = require('./models/Assignment');
var Exercise = require('./models/Exercise');
var Interaction = require('./models/Interaction');
var User = require('./models/User');

// WEB FRAMEWORK (EXPRESS)
var app = express();
app.set('port', process.env.PORT || 3000);

// DATABASE
mongoose.connect(process.env.MONGOHQ_URL);

//VIEW ENGINE (HANDLEBARS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: false }); // no global layout
//hbs.registerPartials(__dirname + '/views/partials');

// FAVICON
// User agents request favicon.ico frequently and indiscriminately;
// exclude these requests from our logs by using this middleware
// before our logger middleware.
// (This module caches the icon in memory to improve performance.)
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

// LOGGER (MORGAN)
app.use(logger('dev'));

// REQUEST PARSERS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// ROUTES (EXPRESS)
app.use(express.static(path.join(__dirname, 'public')));
app.get('/times', function(req, res, next) {
  res.render('d3', {
    data: JSON.stringify(data.data)
  });
});

app.get('/diff', function(req, res, next) {
  res.send('diff');
});

app.get('/dist', function(req, res, next) {
  res.send('dist');
});


// ERROR HANDLERS

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// START LISTENING FROM SERVER
var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
