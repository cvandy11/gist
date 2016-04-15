import React from "react";

import {ButtonGroup, Button} from "react-bootstrap";
import {changeBase} from "../actions/Controls.js";

class BaseLayer extends React.Component {
	constructor(props) {
		super(props);
	}

	onToggle(e, index) {
        return function(objects) {
            console.log(e);
            console.log(index);
            console.log(objects);
            changeBase(objects[index]);
        }
	}

	render() {
		var vfr = {
			disabledStyle: { background: 'gray' },
			activeStyle: { background: 'blue' }
		};
		var osm = {
			disbaledStyle: { background: 'gray' },
			activeStyle: { background: 'green' },

		};

		var objects = [{
			mapType: "VFR",
			url: "https://t.skyvector.com/9c82561433a66/vfr/1604/{z}/{x}/{y}.jpg"
		},{
			mapType: "OSM",
			url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png"
		}];

		return (
			<ButtonGroup defaultPressedIndex = { 0 } keepOnePressed onToggle = { this.onToggle()(objects) }>
				<Button theme = { vfr }>VFR</Button>
				<Button theme = { osm }>OSM</Button>
			</ButtonGroup>
		)
	}
}

export default BaseLayer;
