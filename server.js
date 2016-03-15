'use strict';

var path = require('path');
var express = require('express.io');
var http = require('http');
var webpack = require('webpack');
var webpackMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('./webpack.config.js');
var pgp = require("pg-promise")();

var db = pgp("postgress://gist:m@ps&t!l3s@127.0.0.1:5432/gist");

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

//SOCKET ROUTES

//initial connection, gets given layer data and sends it back
app.io.route('ready', function(req) {
    req.io.join(req.data.mission_id);
    console.log('someone connected to room ' + req.data.mission_id);
    getLayerObjects(req.data.mission_id, req.data.layer_id).then(function(data) {
        req.io.respond(data);
    });
});

//inserts the object to database, broadcasts it to the room if successful, and returns database insert status
app.io.route('insert-object', function(req) {
    insertObject(req.data.object).then(function(data) {
        if(data) {
            req.io.room(req.data.mission_id).braodcast('object-inserted', req.data.object);
        }
        req.io.respond(data);
    });
});

//gets all objects with the given mission and layer ids
app.io.route('get-layer-objects', function(req) {
    getLayerObjects(req.data.mission_id, req.data.layer_id).then(function(data) {
        req.io.respond(data);
    });
});


//DATABASE FUNCTIONS

//gets all objects with the associated mission id and layer id
var getLayerObjects = function(mission_id, layer_id) {
    var promise = db.any("SELECT * FROM draw_objects WHERE mission_id = $1 AND layer_id = $2", [mission_id, layer_id]).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//inserts the object into the database
var insertObject = function(object) {
    var promise = db.none("INSERT INTO draw_objects(mission_id, layer_id, type, coordinates, properties) VALUES(${mission_id}, ${layer_id}, ${type}, ${coordinates}, ${properties})", object).then(function() {
        return true;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening on port %s', port);
});
