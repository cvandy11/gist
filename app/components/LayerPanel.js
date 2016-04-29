'use strict';

import React from 'react';
import {connect} from 'react-redux';

import {Modal, ButtonGroup, Button, ListGroup, ListGroupItem, Input, Glyphicon, Grid, Row, Col} from "react-bootstrap";
import {getLayerObjects} from '../actions/Connect.js';
import {changeBase, selectLayer, toggleLayer} from "../actions/Controls.js";

//loads when I click create layer?! why?!
class LayerPanel extends React.Component {
	constructor(props) {
		super(props);
    }

	render() {
        console.log(this.props.data.layers);
		return (
            <div className="layer_panel">
                <Info mission_id={this.props.data.mission_info.mission_id} mission_description={this.props.data.mission_info.mission_description} center={this.props.data.mission_info.center} />
                <Button onClick={this.props.createLayer}>Create Layer</Button>
                <Layers layers={this.props.data.layers} selectLayer={this.props.selectLayer} toggleLayer={this.props.toggleLayer} getLayerObjects={this.props.getLayerObjects} />
                <BaseLayer changeBase={this.props.changeBase} />
            </div>
		)
	}
}

class Info extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return 	<div className="info">
				<p><span id="info_id">{this.props.mission_id}</span><br />
				<span id="info_description">{this.props.mission_description}</span>
				<Button bsStyle="primary" bsSize="xsmall">Test</Button></p>
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
                this.props.changeBase(this.state.objects[this.state.active])
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
            active_layer: -1,
            visible_layers: [],
            retrieved_layers: []
        });
    }

    toggleLayerVisibility(id) {
        return function() {
            var oldLayers = this.state.layers;
            if(this.state.retrieved_layers.indexOf(id) < 0) {
                this.props.getLayerObjects(id);
                var l = this.state.retrieved_layers;
                l.push(id);
                this.setState({retrieved_layers: l});
            }

            this.props.toggleLayer(id);

            var v = this.state.visible_layers;
            if(v.indexOf(id) < 0) {
                v.push(id);
            } else {
                v.splice(v.indexOf(id), -1);
            }

            this.setState({
                visible_layers: v
            });
        }
    }

    toggleLayerActive(id) {
        return function() {
            this.setState({active_layer: id});

            this.props.selectLayer(id);

            if(this.state.visible_layers.indexOf(id) < 0) {
                this.toggleLayerVisibility(id).bind(this)();
            }
        }
    }


    //The most likely cause of the invariant violation, says something is undefined, not sure what
    //gives invariant violation on the getLayers action function, not sure why...it dispatch correctly, i think
	render() {
		var layers = Object.keys(this.props.layers).map(function(layer_id, i) {
			var layer = this.props.layers[layer_id];
            var style = "info";
            var active = (layer_id == this.state.active_layer);
            var glyphicon = (this.state.visible_layers.indexOf(layer_id) < 0) ? "ban-circle" : "eye-open";

			return (
				<ListGroupItem
					data-id={ i } key={ i } draggable="true"
					bsStyle={style} active={active}>
                            <Button className="layer-visible-button" bsSize="xsmall" onClick={this.toggleLayerVisibility(layer_id).bind(this)}><Glyphicon glyph={glyphicon} /></Button>
                            <span className="active-layer-clickable" onClick={this.toggleLayerActive(layer_id).bind(this)}> {layer.layer_name}</span>
				</ListGroupItem>
			);
		}.bind(this));

		return <ListGroup id="layers">{ layers }</ListGroup>
	}
}

var appState = function(state) {
    return {"data": state.data};
}

export default connect(
    appState,
    {changeBase, selectLayer, toggleLayer, getLayerObjects}
)(LayerPanel);
