import React from "react";

import {ListGroup, ListGroupItem, Input} from "react-bootstrap";
import {insertObject} from '../actions/Connect.js';

class Info extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.setState({ 
			identifier: "MIS_001",
			description: "A test mission",
			center_point: "48.7502 N, 122.4750 W"
		});
	} 

	render() {
		return 	<div className="info">
				<p><span id="info_id">{this.state.identifier}</span><br />
				<span id="info_center">{this.state.center_point}</span><br />
				<span id="info_description">{this.state.description}</span></p>
			</div>
	}
}

export default Info;
