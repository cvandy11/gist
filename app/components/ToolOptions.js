import React from 'react';
import ColorPicker from 'react-color';

import {Button, Grid, Row, Col} from 'react-bootstrap';

import {updateToolProperties} from '../actions/Controls.js';

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
        var color = <div><ColorPicker type="sketch" display={false} /><Button onClick={this.handleClick}>Pick Color</Button></div>;
        return <div className="info" style={{display: "inline-block"}}>
                <Grid style={{width: "100%"}}>
                    <Row>
                        <p>Radius</p>
                    </Row>

                    <Row>
                        <input onChange={this.updateRange} type="range" min={50} max={1000} defaultValue={200} />
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

export default ToolOptions;
