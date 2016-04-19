'use strict';

import React from 'react';

import {ButtonGroup, Button, ListGroup, ListGroupItem, Input, Glyphicon, Grid, Row, Col} from "react-bootstrap";
import {getLayerObjects} from '../actions/Connect.js';
import {changeBase, selectLayer, toggleLayer} from "../actions/Controls.js";

class LayerPanel extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
            <div className="layer_panel">
                <Info />
                <Layers />
                <BaseLayer />
            </div>
		)
	}
}

class Info extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.setState({
			identifier: "MIS_001",
			description: "A test mission",
			center_point: "48.7502 N, 122.4750 W"
		});
	}

	render() {
		return 	<div className="info">
				<p><span id="info_id">{this.state.identifier}</span><br />
				<span id="info_description">{this.state.description}</span>
				<Button bsStyle="primary" bsSize="xsmall">{this.state.center_point}</Button></p>
			</div>
	}
}

class BaseLayer extends React.Component {
	constructor(props) {
		super(props);
	}

    componentWillMount() {
        this.setState({
        objects : {
            VFR: {
                mapType: "VFR",
                url: "https://t.skyvector.com/9c82561433a66/vfr/1604/{z}/{x}/{y}.jpg",
                maxZoom: 11
            },
            OSM: {
                mapType: "OSM",
                url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
                maxZoom: 18
            }
        },
        active : "VFR"

        });
    }

    onclick(e) {
        if(e.target.id != this.state.active) {
            this.setState({active: e.target.id}, function() {
                changeBase(this.state.objects[this.state.active])
            });
        }
    }

	render() {

        return (
            <div id="baseLayers">
                <ButtonGroup justified>
                    <ButtonGroup>
                        <Button id="VFR" bsStyle="success" onClick={this.onclick.bind(this)}>VFR</Button>
                    </ButtonGroup>
                    <ButtonGroup>
                        <Button id="OSM" bsStyle="warning" onClick={this.onclick.bind(this)}>OSM</Button>
                    </ButtonGroup>
                </ButtonGroup>
            </div>
        );
	}
}

class Layers extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.setState({
			layers:{
                "0": {
                    name: "Default Layer",
                    active: true,
                    bsStyle: "info",
                    glyphicon: "eye-open",
                    retrieved: true,
                    displayed: true
				},
				"1": {
					name: "Cell",
					active: false,
					bsStyle: "info",
                    glyphicon: "ban-circle",
                    retrieved: false,
                    displayed: false,
				},
				"2": {
					name: "Eyewitness",
					active: false,
					bsStyle: "info",
                    glyphicon: "ban-circle",
                    retrieved: false,
                    displayed: false,
				},
				"3": {
					name: "ATC",
					active: false,
					bsStyle: "info",
                    glyphicon: "ban-circle",
                    retrieved: false,
                    displayed: false,
				}
			}
		});

	}

    toggleLayerVisibility(id) {
        return function() {
            var oldLayers = this.state.layers;
            if(!oldLayers[id].retrieved) {
                getLayerObjects(id);
                oldLayers[id].retrieved = true;
            }

            toggleLayer(id);

            oldLayers[id].glyphicon = (oldLayers[id].displayed) ? "ban-circle" : "eye-open";
            oldLayers[id].displayed = !oldLayers[id].displayed;
            this.setState({
                layers: oldLayers
            });
        }
    }

    toggleLayerActive(id) {
        return function() {
            //does stuff
            var oldLayers = this.state.layers;
            for(let layer in oldLayers) {
                oldLayers[layer].active = false;
            }
            oldLayers[id].active = true;
            this.setState({
                layers: oldLayers
            });

            selectLayer(id);

            if(!oldLayers[id].displayed) {
                this.toggleLayerVisibility(id).bind(this)();
            }
        }
    }

	render() {
		var layers = Object.keys(this.state.layers).map(function(layer_id, i) {
			var layer = this.state.layers[layer_id];

			return (
				<ListGroupItem
					data-id={ i } key={ i } draggable="true"
					bsStyle={layer.bsStyle} active={layer.active}>
                            <Button className="layer-visible-button" bsSize="xsmall" onClick={this.toggleLayerVisibility(layer_id).bind(this)}><Glyphicon glyph={layer.glyphicon} /></Button>
                            <span className="active-layer-clickable" onClick={this.toggleLayerActive(layer_id).bind(this)}> {layer.name}</span>
				</ListGroupItem>
			);
		}.bind(this));

		return <ListGroup id="layers">{ layers }</ListGroup>
	}
}
export default LayerPanel;
