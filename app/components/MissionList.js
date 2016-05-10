'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {Table, Button, Modal, Glyphicon, Form, FormGroup, Col, ControlLabel, FormControl, Grid, Row} from 'react-bootstrap';

import Notification from './Notification.js';
import {getMissionList, createMission, archiveMission, getMission} from '../actions/Connect.js';
import {replaceRoute} from '../actions/Controls.js';

class MissionList extends React.Component {
    constructor(props) {
        super(props);
        this.toggleModal = this.toggleModal.bind(this);
        this.confirmToggle = this.confirmToggle.bind(this);
        this.archiveButton = this.archiveButton.bind(this);
        this.createButton = this.createButton.bind(this);
    }

    componentWillMount() {
        this.props.getMissionList();
        this.setState({
            displayModal: false,
            confirmModal: false,
            confirmId: ""
        });
    }

    toggleModal() {
        var val = this.state.displayModal;
        this.setState({
            displayModal: !val
        });
    }

    confirmToggle(e) {
        if(typeof(e) != "undefined" && e.target.id) {
            this.setState({
                confirmId: e.target.id
            });
        }
        var val = this.state.confirmModal;
        this.setState({
            confirmModal: !val
        });
    }

    archiveButton(e) {
        this.props.archiveMission(this.state.confirmId);
        this.confirmToggle();
    }

    createButton() {
        this.props.createMission({
            mission_id: this.refs.id.value,
            mission_description: this.refs.description.value,
            center: {
                lat: 80,
                lng: 80
            }
        });
        this.toggleModal();
    }

    render() {
        var missions = Object.keys(this.props.data.missions).map(function(missionKey, i) {
            var mission = this.props.data.missions[missionKey];
            return <tr key={i}>
                    <td><Link to={"/mission/" + mission.mission_id}>{mission.mission_id}</Link></td>
                    <td>{mission.mission_description}</td>
                    <td><Link to={"/mission/" + mission.mission_id}><Button>Map</Button></Link> <Button id={mission.mission_id} onClick={this.confirmToggle}>Archive</Button></td>
                </tr>
        }.bind(this));

        return <div>
            <Notification />
            <h1>Active Missions</h1>
            <Table striped condensed hover responsive>
                <thead>
                    <tr>
                        <th>Mission ID</th>
                        <th>Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {missions}
                </tbody>
            </Table>
            <Button onClick={this.toggleModal}>Create Mission <Glyphicon glyph="plus"/></Button>
            <Modal show={this.state.displayModal} onHide={this.toggleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a Mission</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Grid>
                        <Row>
                            <Col sm={2}>
                                Mission ID
                            </Col>
                            <Col sm={10}>
                                <input ref="id" placeholder="Mission ID" type="text" />
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                Description
                            </Col>
                            <Col sm={10}>
                                <input type="textarea" ref="description" />
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.createButton}>Create</Button> <Button onClick={this.toggleModal}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.confirmModal} onHide={this.confirmToggle}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to archive this mission?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.archiveButton}>Archive</Button> <Button onClick={this.confirmToggle}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>
    }
}

var appState = function(state) {
    return {"data": state.data};
}

export default connect (
    appState,
    {getMissionList, createMission, archiveMission, getMission}
)(MissionList);
