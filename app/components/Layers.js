import React from "react";

import {ListGroup, ListGroupItem, Input} from "react-bootstrap";
import {insertObject} from '../actions/Connect.js';

class Layers extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.setState({ 
			layers:{ 
				"1": {
					name: "New layer",
					active: true,
					bsStyle: "info"
				},
				"2": {
					name: "Cell",
					active: false,
					bsStyle: "warning"
				},
				"3": {
					name: "Eyewitness",
					active: false,
					bsStyle: "success"
				},
				"4": {
					name: "ATC",
					active: false,
					bsStyle: "danger"
				}
			}
		});
	} 

	render() {
		var layers = Object.keys(this.state.layers).map(function(layer_id, i) {
			var layer = this.state.layers[layer_id];

			return (
				<ListGroupItem 
					data-id={ i } key={ i } draggable="true" 
					bsStyle={layer.bsStyle} active={layer.active}>
				<Input className="toggle" type="checkbox" />
				{ layer.name }
				</ListGroupItem>
			);
		}.bind(this));
		
		return <ListGroup id="layers">{ layers }</ListGroup>
	}
}

export default Layers;
