var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

process.env.NODE_ENV = 'development';
process.env.DEBUG = 'anigram:*';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit:'10mb', type: 'application/json'}));
app.use(bodyParser.urlencoded({limit:'10mb', extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/license', require('./routes/api/license'));
app.use('/api/token', require('./routes/api/token'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/', require('./routes/index'));

// below routes requires authentication.
app.use('*', require('./routes/authentication'));
app.use('/api/upload', require('./routes/api/upload'));
app.use('/api/browse', require('./routes/api/browse'));
app.use('/api/save', require('./routes/api/save'));
app.use('/api/unsave', require('./routes/api/unsave'));
app.use('/api/report', require('./routes/api/report'));


app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
