import React from 'react';
import {connect} from 'react-redux';

import LiveMap from './LiveMap.js';
import Menu from './Menu.js';
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
                <Menu name="Tools" alignment="left" />
                <LiveMap />
                <Menu name="Layers" alignment="right" />
            </div>
        )
    }
}

export default App;
