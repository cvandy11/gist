'use strict';

import React from 'react';

import {Grid, Row, Col, FormGroup, FormControl, ControlLabel, Checkbox} from 'react-bootstrap';

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
         if(this.props.toMeter ===true){
           store.dispatch(updateToolProperties({[this.props.propKey]: (mileToMeter(range.target.value) / 2)}));
         } else{
            store.dispatch(updateToolProperties({[this.props.propKey]: range.target.value}));
         }
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

class Dropdown extends React.Component {
    constructor(props) {
        super(props);
    }

    updateColor(color) {
        store.dispatch(updateToolProperties({[this.props.propKey]: color.target.value}));
    }

    render() {
        var colorOptions = this.props.colors.map(function(color, i) {
            var keys = Object.keys(color);
            return <option value={color[keys[0]]} key={i} >{keys[0]}</option>
        });

        return <Grid style={{width:"100%"}}>
         <Row>
            <p> {this.props.title}</p>
         </Row>
         <Row>
          <select onChange={this.updateColor.bind(this)}>
            {colorOptions}
        </select>
        </Row>
        </Grid>
    }
}

class ToggleBox extends React.Component {
   constructor(props){
      super(props);
   }

   updateFlag(boolVal){
      store.dispatch(updatetoolProperties({[this.props.propKey]:true }));
   }

   render(){
      return <Grid style={{width:"100%"}}>
               <Row>
               <p>{this.props.title}</p>
               </Row>
               <Row>
                     <input type="checkbox"/>
               </Row>
            </Grid>
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

const colorDefinitions = [
   {"Red": "rgb(255,0,0)"},
   {"Blue": "rgb(0,0,255)"},
   {"Green": "rgb(0,255,0)"},
   {"Orange": "rgb(255,125,0)"},
   {"Yellow": "rgb(255,255,0)"},
   {"Purple": "rgb(255,0,255)"},
   {"Teal": "rgb(0,255,255)"}
];

//default radius is 1 mile, while slider is 2 because the slider is in diameter
const Circle = {
    type: "Circle",
   twoPoint: false,
    properties: {
        radius: mileToMeter(1),
        color: "blue",
        fill: true,
        fillColor: "blue",
        stroke: true,
        strokeWidth: 5
    },
    options: [
        <Slider title={"Diameter"} min={0.5} max={20} step={0.5} defaultValue={2} propKey={"radius"} toMeter={true} key={1} />,
        <Dropdown title={"Color"} colors={colorDefinitions} propKey={"color"} key={2} />,
        <ToggleBox title={"Fill?"} propKey={"fill"} key={3} />,
        <Dropdown title={"FillColor"} colors={colorDefinitions} propKey={"fillColor"} key={4} />,
        <ToggleBox title={"Stroke?"} propKey={"stroke"} key={5} />,
        <Slider title={"Stroke Pixels"} min={1} max={25} step={1} defaultValue={5} propKey={"strokeWidth"} toMeter={false} key={6} />
    ],
    glyph: "glyphicon-record",
    description: "A circle with diameter in miles and drawn in the given color."
};

const Rectangle = {
   type: "Rectangle",
   twoPoint: true,
   properties: {
      color: "blue",
      fill: true,
      fillColor: "blue",
      stroke:true,
      strokeWidth: 5
   },
   options: [
      <Dropdown title={"Stroke Color"} colors={colorDefinitions} propKey={"color"} key={1} />,
      <ToggleBox title={"Fill?"} propKey={"fill"} key={2} />,
      <Dropdown title={"Fill Color"} colors={colorDefinitions} propKey={"fillColor"} key={3} />,
      <ToggleBox title={"Stroke?"} propKey={"stroke"} key={4} />,
      <Slider title={"Stroke Width"} min={1} max={25} step={1} defaultValue={5} propKey={"strokeWidth"} key={5} />
   ],
   glyph:"glyphicon-unchecked",
   description: "Click on two locations to draw a rectangle"
}

const Erase = {
    type: "Eraser",
    twoPoint: false,
    properties: null,
    options: null,
    glyph: "glyphicon-erase",
    description: "Click on elements on the map to erase them"
}

//list of all tools, used in rendering things
const toolList = [Circle, Erase, Rectangle];

export default toolList;
