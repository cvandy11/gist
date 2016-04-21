'use strict';

//Tool Panel
import React from 'react';

import {Button, Grid, Row, Col, OverlayTrigger, Popover} from 'react-bootstrap';
import {updateToolProperties} from '../actions/Controls.js';

class ToolPanel extends React.Component {
	constructor(props){
		super(props);
		console.log();
	}

	render(){
		return(
			<div id="tool_panel">
                <ToolOptions />
				<BaseTool />
			</div>
		);
	}
}

class BaseTool extends React.Component{

	constructor(props){
		super(props);
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
					<span className={this.state.glyph}></span> {this.props.name}
				 </Button>
			</OverlayTrigger>
		);
	}
}

class ToolOptions extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            displayColorPicker: false,
            range: 200,
        });
        this.handleClick = this.handleClick.bind(this);
        this.updateTool = this.updateTool.bind(this);
        this.updateRange = this.updateRange.bind(this);
    }

    handleClick() {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
    }

    updateTool(color) {
        var newProperties = {color: color.hex};
        updateToolProperties(newProperties);
    }

    updateRange(range) {
        this.setState({
            range: range.target.value
        });
        updateToolProperties({radius: range.target.value});
    }

    render() {
        return <div className="info" style={{display: "inline-block"}}>
                <Grid style={{width: "100%"}}>
                    <Row>
                        <p>Radius</p>
                    </Row>

                    <Row>
                        <input onChange={this.updateRange} type="range" min={400} max={8000} defaultValue={800} />
                    </Row>

                    <Row>
                        <Col xs={6} md={4}><p>50</p></Col>
                        <Col xs={6} md={4}><output name="size"><p>{this.state.range}</p></output></Col>
                        <Col xs={6} md={4}><p>1000</p></Col>
                    </Row>
                </Grid>
            </div>
    }
}

export default ToolPanel;
