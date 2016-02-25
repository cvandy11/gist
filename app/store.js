import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import {syncHistory, routeReducer} from 'redux-simple-router';
import {Router, Route, Link, browserHistory} from 'react-router';
import {createHashHistory} from 'history';
import thunk from 'redux-thunk';
import React from 'react';

import objectReducer from './reducers/object.js';

import App from './components/App.js';

const reducer = combineReducers({
    drawObject: objectReducer,
    routing: routeReducer
});

const reduxRouterMiddleware = syncHistory(browserHistory);
const createStoreWithMiddleware = applyMiddleware(reduxRouterMiddleware, thunk)(createStore);

const store = createStoreWithMiddleware(reducer);

reduxRouterMiddleware.listenForReplays(store);

export {store};
