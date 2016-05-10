'use strict';

const OBJECT_INSERTED = "OBJECT_INSERTED";
const OBJECT_DELETED = "OBJECT_DELETED";
const OBJECTS_RECEIVED ="OBJECTS_RECEIVED";
const ERROR = "ERROR";
const MISSIONS_RECEIVED = "MISSIONS_RECEIVED";
const MISSION_CREATED = "MISSION_CREATED";
const MISSION_ARCHIVED = "MISSION_ARCHIVED";
const LAYER_CREATED = "LAYER_CREATED";
const LAYER_DELETED = "LAYER_DELETED";
const LAYERS_RECEIVED = "LAYERS_RECEIVED";
const MISSION_SELECTED = "MISSION_SELECTED";

import {store} from '../store.js';

var socket;

//initializes the listeners
function initSocket() {
    //socket already initialized
    if(socket) {
        return;
    }

    socket = io.connect();

    socket.emit('ready');

    //event listener for when someone else inserts an object
    socket.on('object-inserted', function(data) {
        store.dispatch({
            type: OBJECT_INSERTED,
            object: data
        });
    });

    socket.on('object-deleted', function(data) {
        store.dispatch({
            type: OBJECT_DELETED,
            object_id: data
        });
    });

    socket.on('layer-created', function(data) {
        store.dispatch({
            type: LAYER_CREATED,
            layer: data
        });
    });

    socket.on('layer-deleted', function(data) {
        store.dispatch({
            type: LAYER_DELETED,
            layer_id: data
        });
    });


    socket.on('mission-created', function(data) {
        store.dispatch({
            type: MISSION_CREATED,
            mission: data
        });

    });

    socket.on('mission-archived', function(data) {
        store.dispatch({
            type: MISSION_ARCHIVED,
            mission_id: data
        });

    });
}

//function to tell the server when you inserted an object and the display on your map as well
//object must be an object with a type, coordinates, and optional properties for styling the object
function insertObject(object) {
    return function(dispatch) {
        socket.emit('insert-object', object, function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: OBJECT_INSERTED,
                    object: data.data
                });
            }
        });
    }
}

function deleteObject(object_id) {
    return function(dispatch) {
        socket.emit('toggle-object-delete', {object_id: object_id}, function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: OBJECT_DELETED,
                    object_id: object_id
                });
            }
        });
    }
}

//function to select layer and display it
function getLayerObjects(layer_id, mission_id) {
    return function(dispatch) {
        socket.emit('get-layer-objects', {mission_id: mission_id, layer_id: layer_id}, function(data) {
            if(data.type == "success") {
                dispatch({
                    type: OBJECTS_RECEIVED,
                    data: data.data
                });
            } else {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            }
        });
    }
}

//creates a new layer
function createLayer(layer) {
    return function(dispatch) {
        socket.emit('create-layer', layer, function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: LAYER_CREATED,
                    layer: data.data
                });
            }
        });
    }
}

//toggles delete layer
function deleteLayer(layer_id) {
    return function(dispatch) {
        socket.emit('toggle-layer-delete', {layer_id: layer_id}, function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: LAYER_DELETED,
                    layer_id: layer_id
                });
            }
        });
    }
}

function getLayers(mission_id) {
    return function(dispatch) {
        socket.emit('get-layers', {mission_id : mission_id}, function(data) {
            if(data.type =="error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: LAYERS_RECEIVED,
                    layers: data.data
                });
            }
        });
    }
}

//function to get mission list
function getMissionList() {
    return function(dispatch) {
        socket.emit('get-missions', function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: MISSIONS_RECEIVED,
                    missions: data.data
                });
            }
        });
    }
}

//function to get mission
function getMission(mission_id) {
    return function(dispatch) {
        socket.emit('get-mission-info', {mission_id: mission_id}, function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: MISSION_SELECTED,
                    mission: data.mission
                });
            }
        });

        socket.emit('get-layers', {mission_id : mission_id}, function(data) {
            if(data.type =="error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                //THIS IS BREAKING EVERYTHING WUT
                dispatch({
                    type: LAYERS_RECEIVED,
                    layers: data.data
                });
            }
        });
    }
}

//function to create a new mission
function createMission(mission) {
    return function(dispatch) {
        socket.emit('create-mission', {mission: mission}, function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: MISSION_CREATED,
                    mission: mission
                });
            }
        });
    }
}

function archiveMission(mission_id) {
    return function(dispatch) {
        socket.emit('toggle-mission-archive', {mission_id: mission_id}, function(data) {
            if(data.type == "error") {
                dispatch({
                    type: ERROR,
                    message: data.message
                });
            } else {
                dispatch({
                    type: MISSION_ARCHIVED,
                    mission_id: mission_id
                });
            }
        });
    }
}

export {OBJECT_INSERTED, ERROR, MISSIONS_RECEIVED, MISSION_CREATED, MISSION_ARCHIVED, LAYER_CREATED, LAYER_DELETED, OBJECT_DELETED, LAYERS_RECEIVED, MISSION_SELECTED, OBJECTS_RECEIVED};

export {initSocket, insertObject, getLayerObjects, getMissionList, createMission, archiveMission, createLayer, deleteLayer, deleteObject, getLayers, getMission};
