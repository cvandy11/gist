import React from 'react';
import LiveMap from './LiveMap.js';
import io from 'socket.io';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }

	componentWillMount() {
		var socket = io.connect('http://webgis.bellinghamcap.org:' + procces.env.PORT) ;
		socket.on('news', function(data) {
			console.log(data);
		});
	}

    render() {
        return (
            <div>
                <LiveMap />
            </div>
        )
    }
}
