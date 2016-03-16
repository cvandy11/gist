//Tool Panel

import React from 'react';

//Import Tools and info
import BaseTool from './BaseTool.js';
import ToolOptions from './ToolOptions.js';

//Class

class ToolPanel extends React.Component {
	constructor(props){
		super(props);
		console.log();
	}

	render(){
		//still needs to have things inside of it
        //add back ToolOptions later
		return(
			<div id="tool_panel">
				<BaseTool />
			</div>
		);
	}
}

export default ToolPanel;
