import React from 'react';
import {Map, Marker, Popup, TileLayer, Circle, FeatureGroup} from 'react-leaflet';
import {connect} from 'react-redux';

import {insertObject} from '../actions/Connect.js';

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
        insertObject({layer_id: this.props.controls.active_layer, type:this.props.controls.tool.type, coordinates: e.latlng, properties: this.props.controls.tool.properties});
    }

    render() {
        const position = [48.73205, -122.48627];
	/*const bounds =[
		[-100,-190],
		[100,190]
		];*/ 

        var layerGroups = {
            "0" : [],
            "1" : [],
            "2" : [],
            "3" : []
        }

        //building the list of all objects that are in the reducer
        this.props.draw.objects.map(function(obj, i) {
            switch(obj.type) {
                case("Point"):
                    layerGroups[obj.layer_id].push(<Circle key={i} className="" center={obj.coordinates} radius={obj.properties.radius} color={obj.properties.color}></Circle>);
                    break;

                default:
                    break;
            }
        }.bind(this));

        var layers = Object.keys(layerGroups).map(function(layer_id) {
            return <FeatureGroup ref={"layer-" + layer_id} key={layer_id}>{layerGroups[layer_id]}</FeatureGroup>;
        }.bind(this));

        if(this.state.rendered) {
            Object.keys(layerGroups).map(function(id) {
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
            <Map center={position} worldCopyJump={true} zoom={13} zoomControl={false}  onClick={this.onMapClick.bind(this)} ref='map'>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributers'
                />
                { layers }
            </Map>
        );
    }
}

//puts the data from the reducers into a dictionary
const mapState = function(state) {
    return {"draw": state.drawObject, "controls": state.controls};
}

//connects the mapState, functions, and class together
export default connect(
    mapState,
    {insertObject: insertObject}
)(LiveMap);
