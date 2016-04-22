import {Router, Route, Link, browserHistory, IndexRedirect} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {store} from './store.js';
import App from './components/App.js';
import MissionList from './components/MissionList.js';

import {initSocket} from './actions/Connect.js';

ReactDOM.render((
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" onEnter={(newState) => store.dispatch(initSocket())} component={MissionList} />
                <Route path="/mission/:mission_id" onEnter={ (newState) => store.dispatch(initSocket())} component={App} />
            </Router>
        </Provider>
    ), document.getElementById('root')
);
