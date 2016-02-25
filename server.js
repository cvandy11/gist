var path = require('path');
var express = require('express.io');
var http = require('http');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
var app = express().http().io();
const port = isDeveloping ? process.env.PORT : 80;

app.use(express.static(__dirname + '/dist'));

if(isDeveloping) {
    const compiler = webpack(config);

    app.use(webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    }));

    app.use(webpackHotMiddleware(compiler));
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


//initial connection, contains method for after connection
app.io.route('ready', function(req) {
    console.log("someone connected!");
    req.io.respond();
});

app.io.route('insert-object', function(req) {
    req.io.broadcast('object-inserted', req.data);
});

app.io.route('update-object', function(req) {
    req.io.broadcast('shout-out', req.data);
});

app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening on port %s', port);
});
