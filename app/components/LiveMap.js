import React from 'react';
import {Map, Marker, Popup, TileLayer, Circle} from 'react-leaflet';
import {connect} from 'react-redux';

import {insertObject} from '../actions/Connect.js';

class LiveMap extends React.Component {
    constructor(props) {
        super(props);
    }

    onMapClick(e) {
        insertObject({"lat": e.latlng["lat"], "lng": e.latlng["lng"]});
    }

    render() {
        const position = [48.73205, -122.48627];

        var i = 0;
        var objectList = this.props.draw.objects.map(function(obj) {
            return <Circle center={[obj.lat, obj.lng]} radius={200} fillColor='blue' key={i++}></Circle>
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

const mapState = function(state) {
    return {"draw": state.drawObject};
}

export default connect(
    mapState,
    {insertObject: insertObject}
)(LiveMap);
