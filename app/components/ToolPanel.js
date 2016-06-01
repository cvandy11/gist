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
			<Grid id="tool_panel">
                <Row>
                { this.props.controls.tool.options }
                </Row>
            <Row>
				{ toolsList }
            </Row>
         </Grid>
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
       // console.log(this.props.tool);
       // console.log(toolList);
        this.props.selectTool(this.props.tool);

        if (this.props.tool.type != "Done") {
            document.getElementById("map1").classList.remove("map_grab");
        }
        else {
            document.getElementById("map1").classList.add("map_grab");
        }
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
				<Button bsStyle={bsStyle} onClick={this.select}>
					<Glyphicon glyph={"glyphicon " + tool.glyph} /> {tool.type}
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
