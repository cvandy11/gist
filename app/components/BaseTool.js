//Base imports for a generic tool button
import React from "react";

//boostrap imports
import {Button} from 'react-bootstrap';

class BaseTool extends React.Component{

	constructor(props){
		super(props);
	}
	
	componentWillMount(){
		this.setState({
			name: "Base Tool",
			active: true,
			bsStyle:"default"
		});
	}
	
	render(){
		return(
			<Button bsStyle = {this.state.bsStyle} block> {this.state.name} </Button>
		);
	}
}

export default BaseTool;
