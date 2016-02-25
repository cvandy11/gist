const CONNECTING = "CONNECTING";
const OBJECT_INSERTED = "OBJECT_INSERTED";

import {store} from '../store.js';

var socket;

//initializes the event listeners and connects the socket to the server
var initSocket = function() {
    return function(dispatch) {
        socket = io.connect();
        socket.emit('ready', {id: "1"}, function(data) {
            dispatch({
                type: CONNECTING
            });
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
var insertObject = function(object) {
    socket.emit('insert-object', object);
    store.dispatch({
        type: OBJECT_INSERTED,
        object: object
    });
}

export {OBJECT_INSERTED};

export {initSocket, insertObject};
