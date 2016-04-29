'use strict';

import React from 'react';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';

class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({alertHidden: true});
    }

    componentWillReceiveProps() {
        if(this.props.notification.type != "none") {
            this.setState({alertHidden: false});
        }
    }

    handleClose() {
        this.setState({alertHidden: true});
    }

    render() {
        var severity;
        if(this.props.notification.type == "Error") {
            severity = "danger";
        } else if(this.props.notification.type == "Alert") {
            severity = "warning";
        }

        return (
            <div hidden={this.state.alertHidden} style={{"position": "relative"}}>
                <Alert bsStyle={severity} className="alert alert-dismissible" onDismiss={this.handleClose.bind(this)}>
                    <h4>{this.props.notification.type}</h4>
                    <p>{this.props.notification.message}</p>
                </Alert>
            </div>
        );
    }
}

var appState = function(state) {
    return {"notification": state.errors}
}

export default connect(
    appState,
    {}
)(Notification);
