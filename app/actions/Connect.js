const CONNECTING = "CONNECTING";
const OBJECT_INSERTED = "OBJECT_INSERTED";

import {store} from '../store.js';

var socket;

//initializes the listeners
var initSocket = function() {
    return function(dispatch) {
        socket = io.connect();
        socket.emit('ready', {id: "1"}, function(data) {
            dispatch({
                type: CONNECTING
            });
        });

        socket.on('object-inserted', function(data) {
            dispatch({
                type: OBJECT_INSERTED,
                object: data
            });
        });
    }
};

var insertObject = function(object) {
    socket.emit('insert-object', object);
    store.dispatch({
        type: OBJECT_INSERTED,
        object: object
    });
}

export {OBJECT_INSERTED};

export {initSocket, insertObject};
