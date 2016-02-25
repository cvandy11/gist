import React from 'react';
import {connect} from 'react-redux';

import LiveMap from './LiveMap.js';
import {initSocket} from '../actions/Connect.js';

import {store} from '../store.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        store.dispatch(initSocket());
    }

    render() {
        return (
            <div>
                <LiveMap />
            </div>
        )
    }
}

export default App;
