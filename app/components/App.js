import React from 'react';
import {connect} from 'react-redux';
import {Alert, Modal, Button} from 'react-bootstrap';

import LiveMap from './LiveMap.js';
import LayerPanel from './LayerPanel.js';
import ToolPanel from './ToolPanel.js';
import GenericPanel from './GenericPanel.js';
import Notification from './Notification.js';

import {createLayer} from '../actions/Connect.js';

import {store} from '../store.js';

class App extends React.Component {
	constructor(props) {
		super(props);
	}

    componentWillMount() {
        this.setState({showLayerModal: false});
    }

    createLayer() {
        this.props.createLayer({layer_name: this.refs.layer_name.value, mission_id: this.props.data.mission_info.mission_id});
        this.layerModal();
    }

    layerModal() {
        var val = this.state.showLayerModal;
        this.setState({showLayerModal: !val});
    }

    render() {
        var notification = null;
        if(this.props.notifications != undefined && this.props.notifications.type != "none") {
            notification = <Notification type={this.props.notifications.type} message={this.props.notifications.message}/>;
        }

        return (
            <div>
                <Notification />
                <LiveMap />
		        <GenericPanel align="left">
                    <ToolPanel />
				</GenericPanel>
				<GenericPanel align="right">
					<LayerPanel createLayer={this.layerModal.bind(this)} />
				</GenericPanel>

                <Modal show={this.state.showLayerModal} onHide={this.layerModal.bind(this)}>
                    <Modal.Header>
                        <h4>Create Layer</h4>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Layer Name: <input type="text" ref="layer_name"/></p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.createLayer.bind(this)}>Create</Button> <Button onClick={this.layerModal.bind(this)} >Cancel</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

var appState = function(state) {
    return {"data": state.data}
}

export default connect(
    appState,
    {createLayer}
)(App);
