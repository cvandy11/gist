const LAYER_SELECTED = "LAYER_SELECTED";
const LAYER_TOGGLED = "LAYER_TOGGLED";
const TOOL_SELECTED = "TOOL_SELECTED";
const TOOL_PROPERTIES_UPDATED = "TOOL_PROPERTIES_UPDATED";

import {store} from '../store.js';

var toggleLayer = function(layer_id) {
    store.dispatch({
        type: LAYER_TOGGLED,
        layer_id: layer_id
    });
}

var selectLayer = function(layer_id) {
    store.dispatch({
        type: LAYER_SELECTED,
        layer_id: layer_id
    });
}

var selectTool = function(tool) {
    store.dispatch({
        type: TOOL_SELECTED,
        tool: tool
    });
}

var updateToolProperties = function(properties) {
    store.dispatch({
        type: TOOL_PROPERTIES_UPDATED,
        properties: properties
    });
}


export{LAYER_SELECTED, LAYER_TOGGLED, TOOL_SELECTED, TOOL_PROPERTIES_UPDATED};

export {toggleLayer, selectLayer, selectTool, updateToolProperties};
