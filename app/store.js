import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import {syncHistory, routeReducer} from 'redux-simple-router';
import {Router, Route, Link, browserHistory} from 'react-router';
import {createHashHistory} from 'history';
import thunk from 'redux-thunk';
import React from 'react';

import objectReducer from './reducers/object.js';

import App from './components/App.js';

//hooks up the routing and draw object reducer into one object
const reducer = combineReducers({
    drawObject: objectReducer,
    routing: routeReducer
});

//applies middleware and creates store
const reduxRouterMiddleware = syncHistory(browserHistory);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware, thunk)(createStore);

//puts the combined reducer into a store
const store = createStoreWithMiddleware(reducer);

//listens for playbacks when using the react devtool
reduxRouterMiddleware.listenForReplays(store);

export {store};
