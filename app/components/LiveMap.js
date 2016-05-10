import React from 'react';
import {Map, Marker, Popup, TileLayer, Circle, FeatureGroup} from 'react-leaflet';
import {connect} from 'react-redux';

import {insertObject, getMission, deleteObject} from '../actions/Connect.js';

class LiveMap extends React.Component {
    constructor(props) {
        super(props);
        this.handleElementClick = this.handleElementClick.bind(this);
    }

    componentWillMount() {
        this.setState({
            rendered: false
        });
    }

    componentWillReceiveProps() {
        if(this.props.draw.loaded) {
            this.setState({
                rendered: true
            });
        }
    }

    //fired whenever there is a click event on the map
    //type, coords, properties passed to server for saving/redrawing
    onMapClick(e) {
        if(this.props.controls.tool.type != "Eraser" && this.props.controls.tool.type != "") {
            this.props.insertObject({mission_id: this.props.data.mission_info.mission_id, layer_id: this.props.controls.active_layer, type:this.props.controls.tool.type, coordinates: e.latlng, properties: this.props.controls.tool.properties});
        }
    }

    handleElementClick(e) {
        if(this.props.controls.tool.type == "Eraser") {
            this.props.deleteObject(e.target.options.id);
        }
    }

    render() {
        const position = [48.73205, -122.48627];
	    const bounds = [ [-120,-220], [120,220] ];

        var layerGroups = {};

        //building the list of all objects that are in the reducer
        Object.keys(this.props.draw.objects).map(function(object_id, i) {
            var obj = this.props.draw.objects[object_id];
            if(!layerGroups[obj.layer_id]) layerGroups[obj.layer_id] = [];
            switch(obj.type) {
                case("Circle"):
                    layerGroups[obj.layer_id].push(<Circle key={i} id={obj.object_id} center={obj.coordinates} radius={obj.properties.radius} color={obj.properties.color} onClick={this.handleElementClick} ></Circle>);
                    break;

                default:
                    break;
            }
        }.bind(this));

        var layers = null;

        if(this.props.data.layers && Object.keys(this.props.data.layers).length > 0) {
            layers = Object.keys(this.props.data.layers).map(function(layer_id) {
                return <FeatureGroup ref={"layer-" + layer_id} key={layer_id}>{layerGroups[layer_id]}</FeatureGroup>;
            }.bind(this));
        }

        if(this.state.rendered) {
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
                    maxZoom={18}
                    url='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                    noWrap={true}
                />
                <TileLayer
                    maxZoom={11}
                    url='https://t.skyvector.com/9c82561433a66/vfr/1605/{z}/{x}/{y}.jpg'
                    attribution='&copy; <a href="https://skyvector.com/">SkyVector</a>'
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
    {insertObject, getMission, deleteObject}
)(LiveMap);
