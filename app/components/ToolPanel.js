//Tool Panel

import React from 'react';

//Import Tools and info
import BaseTool from './BaseTool.js';

//Class

class ToolPanel extends React.Componenet {
	constructor(props){
		super(props);
	}

	render(){
		//still needs to have things inside of it
		return(
			<div id="tool_panel">
				<BaseTool />
			</div>
		)
	}
}

export default ToolPanel;
