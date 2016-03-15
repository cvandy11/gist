//Base imports for a generic tool button
import React from "react";

//boostrap imports
import {Button} from 'react-bootstrap';

class BaseTool extends React.Component{

	constructor(props){
		super(props);
		console.log()
	}
	
	componentWillMount(){
		this.setState({
			name: "Base Tool",
			active: true,
			bsStyle:"primary"
		});
	}
	
	render(){
		return(
			<Button bsStyle = {this.state.bsStyle} id="base_tool"> {this.state.name} </Button>
		);
	}
}

export default BaseTool;
