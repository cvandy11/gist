'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';

import {Table, Button, Modal, Glyphicon, Form, FormGroup, Col, ControlLabel, FormControl, Grid, Row} from 'react-bootstrap';

import {store} from '../store.js';

import {initSocket, getMissionList, createMission, archiveMission} from '../actions/Connect.js';

class MissionList extends React.Component {
    constructor(props) {
        super(props);
        getMissionList();
    }

    componentWillMount() {
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
        archiveMission(this.state.confirmId);
        this.confirmToggle();
    }

    createButton() {
        createMission({
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
                    <td><Button><Link to={"/mission/" + mission.mission_id}>Map</Link></Button> <Button id={mission.mission_id} onClick={this.confirmToggle.bind(this)}>Archive</Button></td>
                </tr>
        }.bind(this));

        return <div>
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
            <Button onClick={this.toggleModal.bind(this)}>Create Mission <Glyphicon glyph="plus"/></Button>
            <Modal show={this.state.displayModal} onHide={this.toggleModal.bind(this)}>
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
                    <Button onClick={this.createButton.bind(this)}>Create</Button> <Button onClick={this.toggleModal.bind(this)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
            <Modal show={this.state.confirmModal} onHide={this.confirmToggle.bind(this)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to archive this mission?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.archiveButton.bind(this)}>Archive</Button> <Button onClick={this.confirmToggle.bind(this)}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </div>;
    }
}
                    /* old form (broken)
                    <Form horizontal>
                        <FormGroup controlId="formHorizontalId">
                            <Col componentClass={ControlLabel} sm={2}>
                                Mission ID
                            </Col>
                            <Col sm={10}>
                                <FormControl type="text" placeholder="Mission ID" />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalDescription">
                            <Col componentClass={ControlLabel} sm={2}>
                                Description
                            </Col>
                            <Col sm={10}>
                                <FormControl type="textarea" />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="formHorizontalCoordinates">
                            <Col componentClass={ControlLabel} sm={2}>
                                Latitude
                            </Col>
                            <Col sm={5}>
                                <FormControl type="text" />
                            </Col>
                            <Col componentClass={ControlLabel} sm={2}>
                                Longitude
                            </Col>
                            <Col sm={5}>
                                <FormControl type="text" />
                            </Col>
                        </FormGroup>
                        <FormGroup>
                            <Col smOffset={12} sm={10}>
                                <Button type="submit">
                                    Create
                                </Button>
                                <Button onClick={this.closeModal.bind(this)}>
                                    Cancel
                                </Button>
                            </Col>
                        </FormGroup>
                    </Form>
                    */

var appState = function(state) {
    return {"data": state.data, "notifications": state.errors};
}

export default connect (
    appState, {}
)(MissionList);
