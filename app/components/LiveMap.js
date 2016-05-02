import React from 'react';
import {Map, Marker, Popup, TileLayer, Circle, FeatureGroup} from 'react-leaflet';
import {connect} from 'react-redux';

import {insertObject, getMission} from '../actions/Connect.js';

class LiveMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            rendered: false
        });
    }

    componentWillReceiveProps() {
        this.setState({
            rendered: true
        });
    }

    //fired whenever there is a click event on the map
    //type, coords, properties passed to server for saving/redrawing
    onMapClick(e) {
        this.props.insertObject({mission_id: this.props.data.mission_info.mission_id, layer_id: this.props.controls.active_layer, type:this.props.controls.tool.type, coordinates: e.latlng, properties: this.props.controls.tool.properties});
    }

    render() {
        const position = [48.73205, -122.48627];
	    const bounds = [ [-120,-220], [120,220] ];

        //TODO redo rendering of objects into layers, organize objects by layer_id in reducer, keyed by layer_id -> object_id
        //server has to append object_id to returned object

        var layerGroups = {};

        console.log(this.props.draw.objects);
        //building the list of all objects that are in the reducer
        this.props.draw.objects.map(function(obj, i) {
            if(!layerGroups[obj.layer_id]) layerGroups[obj.layer_id] = [];
            switch(obj.type) {
                case("Circle"):
                    layerGroups[obj.layer_id].push(<Circle key={i} className="" center={obj.coordinates} radius={obj.properties.radius} color={obj.properties.color}></Circle>);
                    break;

                default:
                    break;
            }
        }.bind(this));

        var layers = null;

        if(this.props.data.layers && Object.keys(this.props.data.layers).length > 0) {
            layers = Object.keys(this.props.data.layers).map(function(layer_id) {
                return <FeatureGroup ref={"layer-" + layer_id} key={layer_id}>{this.props.data.layers[layer_id].layer_name}</FeatureGroup>;
            }.bind(this));
        }

        layers = null;

        if(this.props.data.layers[0] && typeof this.refs["layer-"+this.props.layers[0].layer_id] != undefined && this.state.rendered) {
            Object.keys(this.props.data.layers).map(function(id) {
                var leaf = this.refs.map.getLeafletElement();
                var layer = this.refs["layer-"+id].getLeafletElement();

                if(this.props.controls.visible_layers.indexOf(id) > -1) {
                    if(!leaf.hasLayer(layer)) {
                        leaf.addLayer(layer);
                    }
                } else {
                    if(leaf.hasLayer(layer))  {
                        leaf.removeLayer(layer);
                    }
                }
            }.bind(this));
        }

        return (
            <Map center={position} worldCopyJump={false} zoom={this.props.controls.mapData.maxZoom} minZoom={2} maxBounds={bounds} zoomControl={false} onClick={this.onMapClick.bind(this)} ref='map'>
                <TileLayer
                    maxZoom={this.props.controls.mapData.maxZoom}
                    url={this.props.controls.mapData.url}
                    attribution='&copy; <a href="https://skyvector.com/">SkyVector</a> | &copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    noWrap={true}
                />
                { layers }
            </Map>
        );
    }
}

//puts the data from the reducers into a dictionary
const mapState = function(state) {
    return {"draw": state.drawObject, "controls": state.controls, "data": state.data};
}

//connects the mapState, functions, and class together
export default connect(
    mapState,
    {insertObject: insertObject, getMission}
)(LiveMap);
