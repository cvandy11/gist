import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import { routerReducer } from 'react-router-redux';
import thunk from 'redux-thunk';
import React from 'react';

import objectReducer from './reducers/object.js';
import controlsReducer from './reducers/controls.js';
import errorReducer from './reducers/error.js';
import dataReducer from './reducers/data.js';

import MissionList from './components/MissionList.js';
import App from './components/App.js';

import initSocket from './actions/Connect.js';

//hooks up the routing and draw object reducer into one object
const reducer = combineReducers({
    drawObject: objectReducer,
    controls: controlsReducer,
    errors: errorReducer,
    data: dataReducer,
    routing: routerReducer
});

const store = compose(
    applyMiddleware(thunk)
)(createStore)(reducer);

export {store};
