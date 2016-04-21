const OBJECT_INSERTED = "OBJECT_INSERTED";
const ERROR = "ERROR";
const MISSIONS_RECEIVED = "MISSIONS_RECEIVED";
const MISSION_CREATED = "MISSION_CREATED";
const MISSION_ARCHIVED = "MISSION_ARCHIVED";

import {store} from '../store.js';

var socket;

var mission_id = "0";
var default_layer_id = 0;


//initializes the listeners
var initSocket = function() {
    return function(dispatch) {
        //socket already initialized
        if(socket) {
            return;
        }

        socket = io.connect();

        socket.emit('ready');

        //event listener for when someone else inserts an object
        socket.on('object-inserted', function(data) {
            dispatch({
                type: OBJECT_INSERTED,
                object: data
            });
        });
    }
};

//function to tell the server when you inserted an object and the display on your map as well
//object must be an object with a type, coordinates, and optional properties for styling the object
var insertObject = function(object) {
    object['mission_id'] = mission_id;
    socket.emit('insert-object', {"mission_id": mission_id,"object": object}, function(data) {
        if(!data) {
            //database error
            console.log("error!");
            store.dispatch({
                type: ERROR,
                message: "There was a problem inserting into the database"
            });
        } else {
            store.dispatch({
                type: OBJECT_INSERTED,
                object: data
            });
        }
    });
}

//function to select layer and display it
var getLayerObjects = function(layer_id) {
    socket.emit('get-layer-objects', {mission_id: mission_id, layer_id: layer_id}, function(data) {
        if(data) {
            for(let object of data) {
                store.dispatch({
                    type: OBJECT_INSERTED,
                    object: object
                });
            }
        }
    });
}

//function to get mission list
var getMissionList = function() {
    socket.emit('get-missions', function(data) {
        if(data.type == "error") {
            store.dispatch({
                type: ERROR,
                message: data.message
            });
        } else {
            store.dispatch({
                type: MISSIONS_RECEIVED,
                missions: data.data
            });
        }
    });
}

//function to create a new mission
var createMission = function(mission) {
    socket.emit('create-mission', {mission: mission}, function(data) {
        if(data.type == "error") {
            store.dispatch({
                type: ERROR,
                message: data.message
            });
        } else {
            store.dispatch({
                type: MISSION_CREATED,
                mission: mission
            });
        }
    });
}

var archiveMission = function(mission_id) {
    socket.emit('toggle-mission-archive', {mission_id: mission_id}, function(data) {
        if(data.type == "error") {
            store.dispatch({
                type: ERROR,
                message: data.message
            });
        } else {
            store.dispatch({
                type: MISSION_ARCHIVED,
                mission_id: mission_id
            });
        }
    });
}

export {OBJECT_INSERTED, ERROR, MISSIONS_RECEIVED, MISSION_CREATED, MISSION_ARCHIVED};

export {initSocket, insertObject, getLayerObjects, getMissionList, createMission, archiveMission};
