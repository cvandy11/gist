import React from 'react';
import ColorPicker from 'react-color';

import {Button} from 'react-bootstrap';

import {updateToolProperties} from '../actions/Controls.js';

class ToolOptions extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({
            displayColorPicker: false,
            range: 200,
        });
        this.handleClick = this.handleClick.bind(this);
        this.updateTool = this.updateTool.bind(this);
        this.updateRange = this.updateRange.bind(this);
    }

    handleClick() {
        this.setState({
            displayColorPicker: !this.state.displayColorPicker
        });
    }

    updateTool(color) {
        var newProperties = {color: color.hex};
        updateToolProperties(newProperties);
    }

    updateRange(range) {
        this.setState({
            range: range.target.value
        });
        updateToolProperties({radius: range.target.value});
    }

    render() {
        return null;
        //currently not working as hoped
        return <div className="info">
                <Button onClick={this.handleClick}>Pick Color</Button>
                <ColorPicker type="sketch" display={false} />
                <span>50</span><input onChange={this.updateRange} type="range" min={50} max={1000} defaultValue={200} /><label>1000</label>
                <output name="size">{this.state.range}</output>
            </div>
    }
}

export default ToolOptions;
