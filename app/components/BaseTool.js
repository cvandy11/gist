//Base imports for a generic tool button
import React from "react";

//boostrap imports
import {Button, OverlayTrigger, Popover} from 'react-bootstrap';

class BaseTool extends React.Component{

	constructor(props){
		super(props);
		console.log()
	}
	
	componentWillMount(){
		this.setState({
			name: "Base Tool",
			active: true,
			bsStyle:"primary",
			glyph: "glyphicon glyphicon-fire"
		});
	}
	
	render(){
		return(
			<OverlayTrigger trigger="click" placement="right" overlay={
				<Popover title="Example Popover">
					<strong>This Does Nothing Yet </strong>
				</Popover>
			}>
				<Button bsStyle = {this.state.bsStyle} id="base_tool">
					<span className={this.state.glyph}></span> {this.state.name}
				 </Button>
			</OverlayTrigger>
		);
	}
}

export default BaseTool;
