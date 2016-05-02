import {LAYER_SELECTED, LAYER_TOGGLED, TOOL_SELECTED, TOOL_PROPERTIES_UPDATED, BASE_CHANGE} from '../actions/Controls.js';

export default function controlsReducer(previousControlState, action) {

    if(previousControlState == undefined) {
        return {
            tool: {
                type: "",
                properties: {
                },
                options: null
            },
            visible_layers: [],
            active_layer: 0,
            mapData: {
                mapType: "VFR",
                url: "https://t.skyvector.com/9c82561433a66/vfr/1604/{z}/{x}/{y}.jpg",
                maxZoom: 11
            }
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
            Object.keys(action.properties).forEach(function(key) { newState.tool.properties[key] = action.properties[key]; });
            break;
        case BASE_CHANGE:
            newState.mapData = action.properties;
            break;
        default:
            break;
    };

    return newState;
}
