'use strict';

import React from 'react';

import {Grid, Row, Col, FormGroup, FormControl, ControlLabel} from 'react-bootstrap';

import {store} from '../store.js';
import {updateToolProperties} from '../actions/Controls.js';

//This file contains the generic classes for all tools and updates controls reducer accordingly

//Generic functions for converting from meters to miles
function meterToMile(x) {
    return x * 0.000621371;
}
function mileToMeter(x) {
    return x * 1609.34;
}

//The slider component, note that this is converting from diameter in miles, to radius in meters
//required parameters:
//step: how much to step the slider by
//defaultValue: starting value of the slider
//min: minimum slider value
//max: maximum slider value
//title: title above the slider
class Slider extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            range: this.props.defaultValue
        });
        this.updateRange = this.updateRange.bind(this);
    }

    //send converted number to the tool controls
    updateRange(range) {
        this.setState({
            range: range.target.value
        });
        store.dispatch(updateToolProperties({radius: (mileToMeter(range.target.value) / 2)}));
    }

    render() {
        return <Grid className="info" style={{width: "100%"}}>
                <Row>
                    <p>{this.props.title}</p>
                </Row>

                <Row>
                    <input onChange={this.updateRange} type="range" step={this.props.step} min={this.props.min} max={this.props.max} defaultValue={this.props.defaultValue} />
                </Row>

                <Row>
                    <Col xs={6} md={4}><p>{this.props.min}</p></Col>
                    <Col xs={6} md={4}><output name="size"><p>{this.state.range}</p></output></Col>
                    <Col xs={6} md={4}><p>{this.props.max}</p></Col>
                </Row>
            </Grid>
    }
}

class ColorDropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    updateColor(color) {
        store.dispatch(updateToolProperties({color: color.target.value}));
    }

    render() {
        var colorOptions = this.props.colors.map(function(color, i) {
            return <option value={color} key={i} >{color[0].toUpperCase() + color.slice(1)}</option>
        });

        return <select onChange={this.updateColor.bind(this)}>
            {colorOptions}
        </select>
    }
}

//DEFINITION OF TOOLS
/*
 / To define a tool object create and object with type, properties, and options
 /
 / type is the type that is used to identify what type of drawing object it is
 /      this must be unique. Typically matches the name of the object
 / properties are the properties and their default values of the tool (this is passed to
 /      the database and should be kept small as possible)
 / options is the list of classes to render as options, a valid option is one which changes the
 /      value of a property defined in properties
 / glyph is the glyphicon used in one the tool button
 / description is a short description of the tool for the hover popover
*/

//default radius is 1 mile, while slider is 2 because the slider is in diameter
const Circle = {
    type: "Circle",
    properties: {
        radius: mileToMeter(1),
        color: "blue"
    },
    options: [
        <Slider title={"Diameter"} min={0.5} max={20} step={0.5} defaultValue={2} key={1} />,
        <ColorDropdown title={"Color"} colors={["blue", "red", "green"]} key={2} />
    ],
    glyph: "glyphicon-record",
    description: "A circle with diameter in miles and drawn in the given color."
};

//list of all tools, used in rendering things
const toolList = [Circle];

export default toolList;
