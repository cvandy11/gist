const CONNECTING = "CONNECTING";
const OBJECT_INSERTED = "OBJECT_INSERTED";

import {store} from '../store.js';

var socket;

var mission_id = "0";
var default_layer_id = 0;


//initializes the listeners
var initSocket = function() {
    return function(dispatch) {
        socket = io.connect();
        socket.emit('ready', {mission_id: mission_id, layer_id: default_layer_id}, function(data) {
            for(let object of data) {
                dispatch({
                    type: OBJECT_INSERTED,
                    object: object
                });
            }
        });

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
    socket.emit('insert-object', {"object": object});
    store.dispatch({
        type: OBJECT_INSERTED,
        object: object
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

export {OBJECT_INSERTED};

export {initSocket, insertObject, getLayerObjects};
