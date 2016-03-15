import React from 'react';
import {Map, Marker, Popup, TileLayer, Circle} from 'react-leaflet';
import {connect} from 'react-redux';

import {insertObject} from '../actions/Connect.js';

class LiveMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            layer_id: 0,
            type: "Point",
            properties: {
                radius: 200,
                color: "red"
            }
        });
    }

    //fired whenever there is a click event on the map
    //type, coords, properties passed to server for saving/redrawing
    onMapClick(e) {
        insertObject({layer_id: this.state.layer_id, type:this.state.type, coordinates: e.latlng, properties: this.state.properties});
    }

    render() {
        const position = [48.73205, -122.48627];

        //building the list of all objects that are in the reducer
        var objectList = this.props.draw.objects.map(function(obj, i) {
            switch(obj.type) {
                case("Point"):
                    return <Circle key={i} center={obj.coordinates} radius={obj.properties.radius} fillColor={obj.properties.color}></Circle>

                default:
                    break;
            }
        });

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
    return {"draw": state.drawObject};
}

//connects the mapState, functions, and class together
export default connect(
    mapState,
    {insertObject: insertObject}
)(LiveMap);
