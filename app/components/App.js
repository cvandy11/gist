import React from 'react';
import LiveMap from './LiveMap.js';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <LiveMap />
            </div>
        )
    }
}
