import "babel-polyfill";
require('./css/import.css');

import {Route, browserHistory, Router} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import {store} from './store.js';
import App from './components/App.js';
import MissionList from './components/MissionList.js';

import {initSocket, getMission} from './actions/Connect.js';

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render((
        <Provider store={store}>
            <Router history={history}>
                <Route path="" onEnter={(newState) => {initSocket()}}>
                    <Route path="/" component={MissionList} />
                    <Route path="/mission/:mission_id" onEnter={(newState) => {store.dispatch(getMission(newState.params.mission_id))}} component={App} />
                </Route>
            </Router>
        </Provider>
    ), document.getElementById('root')
);
