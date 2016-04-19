'use strict';

//Generic panel to allow for similar styling.
import React from 'react';

//Class

class GenericPanel extends React.Component{
	//Pass "left" or "right" as the align property.
	constructor(props){
		super(props);
		if(this.props.align!=="left" && this.props.align!=="right"){
			console.log("recieved " + this.props.align);
			throw "Invalid alignment property must provide left or right";
		}
	}
		//returns a div of generic panel aligned
	render(){
		if(this.props.align ==="left"){
			var genStyle = {
				left: 0
			};
		} else if(this.props.align ==="right"){
			var genStyle = {
				right: 0
			};
		}
		return(
			<div className="GenericPanel" style={genStyle}>
				<div style={{padding:" 10px 10px 0 0"}}>
					{this.props.children}
				</div>
			</div>

		);

	}

}

export default GenericPanel;
