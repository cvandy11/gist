import {LAYER_SELECTED, LAYER_TOGGLED, TOOL_SELECTED, TOOL_PROPERTIES_UPDATED} from '../actions/Controls.js';

export default function controlsReducer(previousControlState, action) {

    if(previousControlState == undefined) {
        return {
            tool: {
                type: "Point",
                properties: {
                    radius: 200,
                    color: "blue",
                }
            },
            visible_layers: ["0"],
            active_layer: 0,
        };
    }

    const newState = Object.assign({}, previousControlState);

    switch(action.type) {
        case LAYER_SELECTED:
            newState.active_layer = action.layer_id
            break;
        case LAYER_TOGGLED:
            var index = newState.visible_layers.indexOf(action.layer_id);
            if(index > -1) {
                newState.visible_layers.splice(index, 1);
            } else {
                newState.visible_layers.push(action.layer_id);
            }
            break;
        case TOOL_SELECTED:
            newState.tool = action.tool;
            break;
        case TOOL_PROPERTIES_UPDATED:
            newState.tool.properties = action.properties;
            break;
        default:
            break;
    };

    return newState;
}
