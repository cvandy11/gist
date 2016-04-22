import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import {syncHistory, routeReducer} from 'redux-simple-router';
import {Router, Route, Link, browserHistory} from 'react-router';
import {createHashHistory} from 'history';
import thunk from 'redux-thunk';
import React from 'react';

import objectReducer from './reducers/object.js';
import controlsReducer from './reducers/controls.js';
import errorReducer from './reducers/error.js';
import dataReducer from './reducers/data.js';

//hooks up the routing and draw object reducer into one object
const reducer = combineReducers({
    drawObject: objectReducer,
    controls: controlsReducer,
    errors: errorReducer,
    data: dataReducer,
    routing: routeReducer
});

const reduxRouterMiddleware = syncHistory(browserHistory);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware, thunk)(createStore);

const store = createStoreWithMiddleware(reducer);

reduxRouterMiddleware.listenForReplays(store);

export {store};
