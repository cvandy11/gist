import {Router, Route, Link, browserHistory} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {store} from './store.js';
import App from './components/App.js';

ReactDOM.render((
        <Provider store={store}>
            <Router history={browserHistory}>
                <Route path="/" component={App} />
            </Router>
        </Provider>
    ), document.getElementById('root')
);
