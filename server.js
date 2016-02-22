var path = require('path');
var express = require('express.io');
var http = require('http');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.js');

const isDeveloping = process.env.NODE_ENV !== 'production';
const app = express();
app.http().io();
const port = isDeveloping ? process.env.PORT : 80;
const bodyParser = require("body-parser");

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post('/popup/', function(req, res) {
	console.log(req.body.lat);
	console.log(req.body.lng);
});

//initial connection, contains method for after connection
app.io.route('ready', function(req) {
	req.io.join(req.data);
	req.io.room(req.data).broadcast('announce', {
		message: 'someone connected!'
	})
});

app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening on port %s', port);
});
