//Base imports for a generic tool button
import React from "react";

//boostrap imports
import {Button, OverlayTrigger, Popover} from 'react-bootstrap';

class BaseTool extends React.Component{

	constructor(props){
		super(props);
		console.log()
		this.TempName = props.Name;
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
				<Popover title="Example Popover" id="1">
					<strong>This Does Nothing Yet </strong>
				</Popover>
			}>
				<Button bsStyle = {this.state.bsStyle} id="base_tool" block>
					<span className={this.state.glyph}></span> {this.TempName} 
				 </Button>
			</OverlayTrigger>
		);
	}
}

export default BaseTool;
