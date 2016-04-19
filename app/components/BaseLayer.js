'use strict';

import React from "react";

import {ButtonGroup, Button} from "react-bootstrap";
import {changeBase} from "../actions/Controls.js";

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

export default BaseLayer;
