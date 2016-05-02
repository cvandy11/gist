'use strict';

//Tool Panel
import React from 'react';
import {connect} from 'react-redux';

import {Button, Grid, Glyphicon, Row, Col, OverlayTrigger, Popover} from 'react-bootstrap';

import {selectTool} from '../actions/Controls.js';
import toolList from './ToolOptions.js';

class ToolPanel extends React.Component {
	constructor(props){
		super(props);
	}

	render(){
        var toolsList = toolList.map(function(tool, i) {
            return <BaseTool key={i} tool={tool} selectedTool={this.props.controls.tool.type} selectTool={this.props.selectTool} />
        }.bind(this));

        return(
			<div id="tool_panel">
                { this.props.controls.tool.options }
				{ toolsList }
			</div>
		);
	}
}

class BaseTool extends React.Component{
	constructor(props){
		super(props);
	}

	componentWillMount(){
        this.select = this.select.bind(this);
	}

    select() {
        this.props.selectTool(this.props.tool);
    }

	render(){
        var tool = this.props.tool;
        var bsStyle;
        if(this.props.selectedTool == tool.type) {
            bsStyle = "primary";
        } else {
            bsStyle = "default";
        }
		return(
			<OverlayTrigger placement="right" overlay={
				    <Popover title={tool.type} id={1}>
					    <strong>{tool.description}</strong>
				    </Popover>}>
				<Button bsStyle={bsStyle} onClick={this.select} block>
					<Glyphicon glyph={"glyphicon " + tool.glyph} />
                    {tool.type}
				 </Button>
			</OverlayTrigger>
		);
	}
}

var appState = function(state) {
    return {"controls": state.controls};
}

export default connect(
    appState,
    {selectTool}
)(ToolPanel);
