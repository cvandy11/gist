import React from 'react';
import {Map, Marker, Popup, TileLayer } from 'react-leaflet';

class LiveMap extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            popups: []
        });
    }

    onMapClick(e) {
        var old = this.state.popups;

        var newPopup = {
            latlng: e.latlng
        };

        var newPopups;

        if(old.length > 0) {
            old.push(newPopup);
            newPopups = old;
        } else {
            newPopups=[newPopup];
        }

        this.setState({
            popups: newPopups
        });
    }

    render() {
        const position = [48.73205, -122.48627];

        var popupList = this.state.popups.map(function(popup) {
            return (
                <Popup position={popup.latlng}>
                    <span>You clicked {popup.latlng.toString()}</span>
                </Popup>
            );
        });

        console.log(popupList);

        return (
            <Map center={position} zoom={13} onClick={this.onMapClick.bind(this)} ref='map'>
                <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributers'
                />
                { popupList }
            </Map>
        );
    }
}

export default LiveMap;
