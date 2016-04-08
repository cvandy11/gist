import React from 'react';
import {connect} from 'react-redux';

import LiveMap from './LiveMap.js';
import LayerPanel from './LayerPanel.js';
//import ToolPanel from './ToolPanel.js';
import BaseTool from './BaseTool.js';
import Layers from './Layers.js';
import Info from './Info.js';
import GenericPanel from './GenericPanel.js';

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
		                <GenericPanel align="left">
					<BaseTool Name="Base Tool" />
					<BaseTool Name="Hello World" />
					<BaseTool Name="THIS IS A REALLY LONG BUTTON" />
					<BaseTool Name="Short" />
				</GenericPanel>
				<GenericPanel align="right">
					<Info />
					<Layers />
				</GenericPanel>
			</div>
		)
	}
}

export default App;
