import React from 'react';
import {connect} from 'react-redux';
import {Alert} from 'react-bootstrap';

import LiveMap from './LiveMap.js';
import LayerPanel from './LayerPanel.js';
import ToolPanel from './ToolPanel.js';
//import ToolPanel from './ToolPanel.js';
import GenericPanel from './GenericPanel.js';

import {initSocket} from '../actions/Connect.js';

import {store} from '../store.js';

class App extends React.Component {
	constructor(props) {
		super(props);
	}

    render() {
        var notification = null;
        if(this.props.notifications != undefined && this.props.notifications.type != "none") {
            notification = <Notification type={this.props.notifications.type} message={this.props.notifications.message}/>;
        }

        return (
            <div>
                {notification}
                <LiveMap />
		        <GenericPanel align="left">
                    <ToolPanel />
				</GenericPanel>
				<GenericPanel align="right">
					<LayerPanel />
				</GenericPanel>
            </div>
        )
    }
}

class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({alertHidden: false});
    }

    componentWillReceiveProps() {
        this.setState({alertHidden: false});
    }

    handleClose() {
        this.setState({alertHidden: true});
    }

    render() {
        var severity;
        if(this.props.type == "Error") {
            severity = "danger";
        } else if(this.props.type == "Alert") {
            severity = "warning";
        }

        return (
            <div hidden={this.state.alertHidden} style={{"position": "relative"}}>
                <Alert bsStyle={severity} className="alert alert-dismissible" onDismiss={this.handleClose.bind(this)}>
                    <h4>{this.props.type}</h4>
                    <p>{this.props.message}</p>
                </Alert>
            </div>
        );
    }
}

var appState = function(state) {
    return {"notifications": state.errors}
}

export default connect(
    appState,
    {}
)(App);
