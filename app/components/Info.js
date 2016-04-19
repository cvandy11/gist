import React from "react";

import {Button} from "react-bootstrap";
import {recenterMap} from "../actions/Controls.js";

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
				<span id="info_description">{this.state.description}</span>
				<Button bsStyle="primary" bsSize="xsmall" onClick={recenterMap()}>{this.state.center_point}</Button></p>
			</div>
	}
}

export default Info;
