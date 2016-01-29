import React from 'react';
var Button = require('./Button.js');

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {test: 'doot'};
    }
    render() {
        return (
            <div>Skeleton
            <Button />
            </div>
        )
    }
}
