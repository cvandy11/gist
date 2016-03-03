import React from 'react';

import Layers from './Layers.js';
import Info from './Info.js';

class LayerPanel extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div id="layer_panel">
				<Info />
				<Layers />
			</div>
		)
	}
}

export default LayerPanel;
