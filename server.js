var path = require('path');
var express = require('express.io');
var http = require('http');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.js');

//constants for ports, dev, and the server object
const isDeveloping = process.env.NODE_ENV !== 'production';
var app = express().http().io();
const port = isDeveloping ? process.env.PORT : 80;

//defines the directory the files are located in
app.use(express.static(__dirname + '/dist'));

//webpack options for hot reloading and other things which are only used
//when we are in development
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

//sends the static html file when someone goes to the base of the server
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});


//fired when someone connects to the server, logs it to the server and
//responds back. currently no data is sent but eventually we will send back th
//data that is in the map they are trying to look at
app.io.route('ready', function(req) {
    console.log("someone connected!");
    req.io.respond();
});


//broadcasts the object whenever someone adds it the map, this will eventually
//hold the save to database piece
app.io.route('insert-object', function(req) {
    req.io.broadcast('object-inserted', req.data);
});

//starts the server listening on the supplied port
app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening on port %s', port);
});
