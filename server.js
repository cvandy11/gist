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
var port = isDeveloping ? process.env.PORT : 3000;

app.use(express.static(__dirname + '/dist'));

/*
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
}*/

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'dist/index.html'));
});

app.get('/mission/:mission_id', function(req, res) {
    res.sendfile(path.join(__dirname, 'dist/index.html'));
});

//SOCKET ROUTES

//initial connection, gets given mission info, mission layers, and layer object data
//TODO: change this b/c we already have the mission info from the mission list page
//TODO: change this to an on connect to mission route
//TODO: make 'ready' route gather initial data from user
//TODO: each page should request info as needed, 'ready' should only initialize connection info
/*
app.io.route('ready', function(req) {
    req.io.join(req.data.mission_id);
    console.log('someone connected to room ' + req.data.mission_id);
    getMissionInfo(req.data.mission_id).then(function(mission_data) {
        if(!mission_data) {
            req.io.respond({
                type: "error",
                message: "There was a problem getting the mission info"
            });
        } else {
            getMissionLayers(req.data.mission_id).then(function(layers_data) {
                if(!layers_data) {
                    req.io.respond({
                        type: "error",
                        message: "There was a problem getting the layers for the mission"
                    });
                } else {
                    getLayerObjects(req.data.mission_id, req.data.default_layer_id).then(function(object_data) {
                        if(!object_data) {
                            req.io.respond({
                                type: "error",
                                message: "There was a problem getting the objects for the layer."
                            });
                        } else {
                            req.io.respond({
                                type: "success",
                                mission_data: mission_data,
                                layers_data: layers_data,
                                object_data: object_data
                            });
                        }
                    });
                }
            });
        }
    });
});
*/

app.io.route('ready', function(req) {
    req.io.respond(true);
});

app.io.route('get-mission-info', function(req) {
    getMissionInfo(req.data.mission_id).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem getting the mission info."
            });
        } else {
            req.io.respond({
                type: "success",
                mission: data
            });
        }
    });
});

//gets all active missions
app.io.route('get-missions', function(req) {
    getMissions().then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem getting the missions from the database."
            });
        } else {
            req.io.respond({
                type: "success",
                data: data
            });
        }
    });
});

//gets all archived missions
app.io.route('get-archived-missions', function(req) {
    getArchivedMissions().then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem getting the missions from the database."
            });
        } else {
            req.io.respond({
                type: "success",
                data: data
            });
        }
    });
});

//creates a new mission with a default layer
app.io.route('create-mission', function(req) {
    createMission(req.data.mission).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem creating the mission"
            });
        } else {
            createLayer({mission_id: req.data.mission.mission_id, layer_name: "Default Layer"}).then(function(data) {
                if(!data) {
                    req.io.respond({
                        type: "error",
                        message: "There was a problem creating the mission"
                    });
                } else {
                    req.io.respond({
                        type: "success"
                    });
                }
            });
        }
    });
});

//gets mission layers for the given mission_id
app.io.route('get-layers', function(req) {
    getLayers(req.data.mission_id).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem getting the layers from the database."
            });
        } else {
            req.io.respond({
                type: "success",
                data: data
            });
        }
    });
});

//toggles the mission to be marked archived or not
app.io.route('toggle-mission-archive', function(req) {
    toggleMissionArchive(req.data.mission_id).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem updating the database."
            });
        } else {
            req.io.respond({
                type: "success",
                mission_id: req.data.mission_id
            });
        }
    });
});

//inserts the object to database, broadcasts it to the room if successful, and returns database insert status
app.io.route('insert-object', function(req) {
    insertObject(req.data).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem inserting the object into the database."
            });
        } else {
            req.io.room(req.data.mission_id).broadcast('object-inserted', data);
            req.io.respond({
               type: "success",
               data: data
            });
        }
    });
});

//sets or unsets delete flag and lets the room know about it
app.io.route('toggle-delete-object', function(req) {
    toggleDeleteObject(req.data.mission_id, req.data.layer_id, req.data.object_id).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem deleting the object from the database."
            });
        } else {
            if(data.deleted) {
                req.io.room(req.data.mission_id).broadcast('object-deleted', req.data.object_id);
            } else {
                req.io.room(req.data.mission_id).broadcast('object-inserted', data);
            }
            req.io.respond({
                type: "success",
                object_id: req.data.object_id
            });
        }
    });
});

//creates a new layer in the database
app.io.route('create-layer', function(req) {
    createLayer(req.data).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem creating the layer in the database."
            });
        } else {
            req.io.room(req.data.mission_id).broadcast('layer-created', data);
            req.io.respond({
                type: "success",
                data: data
            });
        }
    });
});

//sets or unsetes delete flag for layer and updates room
app.io.route('toggle-delete-layer', function(req) {
    toggleDeleteLayer(req.data.mission_id, req.data.layer_id).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem with the layers in the database."
            });
        } else {
            if(data.deleted) {
                req.io.room(req.data.mission_id).broadcast('layer-deleted', req.data.layer_id);
            } else {
                req.io.room(req.data.mission_id).broadcast('layer-created', data);
            }
            req.io.respond({
                type: "success",
                layer_id: req.data.layer_id
            });
        }
    });
});

//gets all objects with the given mission and layer id
app.io.route('get-layer-objects', function(req) {
    getLayerObjects(req.data.mission_id, req.data.layer_id).then(function(data) {
        if(!data) {
            req.io.respond({
                type: "error",
                message: "There was a problem getting the objects for the layer."
            });
        } else {
            req.io.respond({
                type: "success",
                data: data
            });
        }
    });
});


//DATABASE FUNCTIONS

//gets all mission not marked archived
var getMissions = function() {
    var promise = db.any("SELECT * FROM mission_info WHERE archive = FALSE").then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//gets all missions marked as archived
var getArchivedMissions = function() {
    var promise = db.any("SELECT * FROM mission_info WHERE archive = TRUE").then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

var createMission = function(mission) {
    var promise = db.none("INSERT INTO mission_info(mission_id, mission_description, center) VALUES(${mission_id}, ${mission_description}, ${center})", mission).then(function(data) {
        return true;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//gets the info for the select mission
var getMissionInfo = function(mission_id) {
    var promise = db.one("SELECT * FROM mission_info WHERE mission_id = $1", mission_id).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//gets all layers for the given mission id that aren't marked deleted
var getMissionLayers = function(mission_id) {
    var promise = db.any("SELECT * FROM layer_info WHERE mission_id = $1 AND deleted = FALSE", mission_id).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//gets all objects with the associated mission id and layer id which are not marked deleted
var getLayerObjects = function(mission_id, layer_id) {
    var promise = db.any("SELECT * FROM draw_objects WHERE mission_id = $1 AND layer_id = $2 AND deleted = FALSE", [mission_id, layer_id]).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//archives/unarchives the mission with the given id
var toggleMissionArchive = function(mission_id) {
    var promise = db.none("UPDATE mission_info SET archive = NOT archive WHERE mission_id = $1", mission_id).then(function(data) {
        return true;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//inserts the object into the database
var insertObject = function(object) {
    var promise = db.one("INSERT INTO draw_objects(mission_id, layer_id, type, coordinates, properties) VALUES(${mission_id}, ${layer_id}, ${type}, ${coordinates}, ${properties}) RETURNING *", object).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//toggle whether object is marked as deleted or not
var toggleDeleteObject = function(mission_id, layer_id, object_id) {
    var promise = db.none("UPDATE draw_objects SET deleted = NOT deleted WHERE mission_id = $1 AND layer_id = $2 AND object_id = $3", [mission_id, layer_id, object_id]).then(function(data) {
        return true;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//creates a new layer
var createLayer = function(object) {
    var promise = db.one("INSERT INTO layer_info(mission_id, layer_name) VALUES(${mission_id}, ${layer_name}) RETURNING *", object).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//gets all layers associated with the given mission id
var getLayers = function(mission_id) {
    var promise = db.any("SELECT * FROM layer_info WHERE mission_id = $1 AND deleted = FALSE", mission_id).then(function(data) {
        return data;
    }).catch(function(error) {
        console.log("ERROR: " + error);
        return false;
    });
    return promise;
}

//toggles delete for the given layer on or off
var toggleDeleteLayer = function(layer_id) {
    var promise = db.none("UPDATE layer_info SET deleted = NOT deleted WHERE layer_id = $1", layer_id).then(function(data) {
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
