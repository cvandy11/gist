import React from 'react';

import Layers from './Layers.js';
import Info from './Info.js';
import BaseLayer from './BaseLayer.js';

class LayerPanel extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="layer_panel">
				<Info />
				<Layers />
				<BaseLayer />
			</div>
		)
	}
}

export default LayerPanel;
