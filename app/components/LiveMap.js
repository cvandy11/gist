import React from 'react';
import {Map, Marker, Popup, TileLayer, Circle} from 'react-leaflet';
import {connect} from 'react-redux';

import {insertObject} from '../actions/Connect.js';

class LiveMap extends React.Component {
    constructor(props) {
        super(props);
    }

    //fired whenever there is a click event on the map
    //type, coords, properties passed to server for saving/redrawing
    onMapClick(e) {
        insertObject({layer_id: this.props.controls.active_layer, type:this.props.controls.tool.type, coordinates: e.latlng, properties: this.props.controls.tool.properties});
    }

    render() {
        const position = [48.73205, -122.48627];

        //building the list of all objects that are in the reducer
        var objectList = this.props.draw.objects.map(function(obj, i) {
            switch(obj.type) {
                case("Point"):
                    return <Circle key={i} center={obj.coordinates} radius={obj.properties.radius} color={obj.properties.color}></Circle>

                default:
                    break;
            }
        }.bind(this));

        return (
            <Map center={position} zoom={13} onClick={this.onMapClick.bind(this)} ref='map'>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributers'
                />
                { objectList }
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
