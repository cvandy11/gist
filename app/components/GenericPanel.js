//Generic panel to allow for similar styling.

import React from 'react';

//Class

class GenericPanel extends React.Component{
	//Pass "left" or "right" as the align property.
	constructor(props){
		super(props);
		this.align = props.align;
		if(this.align!=="left" || this.align!=="right"){
			throw "Invalid alignment property must provide left or right";
		}

	}

	render(){
		//returns a div of Generic panel aligned 
		return(
			<div className="GenericPanel" {this.align}="0">
			</div>

		);

	}

}

export default ToolPanel;
