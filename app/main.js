import {Router, Route, Link} from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App.js';


ReactDOM.render((
    <Router>
        <Route path="/" component={App} />
    </Router>
    ), document.getElementById('root')
);
