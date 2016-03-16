import React from "react";

import {ListGroup, ListGroupItem, Input, Button, Glyphicon} from "react-bootstrap";
import {getLayerObjects} from '../actions/Connect.js';
import {selectLayer, toggleLayer} from '../actions/Controls.js';

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

export default Layers;
