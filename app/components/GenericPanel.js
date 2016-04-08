//Generic panel to allow for similar styling.

import React from 'react';

//Class

class GenericPanel extends React.Component{
	//Pass "left" or "right" as the align property.
	constructor(props){
		super(props);
		console.log(props);
		this.align = props.align;
		this.children= props.children||[];
		if(this.align!=="left" && this.align!=="right"){
			console.log("recieved " + this.align);
			throw "Invalid alignment property must provide left or right";
		}
	}
		//returns a div of generic panel aligned
	render(){
		if(this.align ==="left"){ 
			var genStyle = {
				left: 0
			};
		} else if(this.align ==="right"){
			var genStyle = {
				right: 0
			};
		}
		return(
			<div className="GenericPanel" style={genStyle}>
				<div style={{padding:" 10px 10px 0 0"}}>
					{this.children}
				</div>
			</div>

		);

	}

}

export default GenericPanel;
