const LAYER_SELECTED = "LAYER_SELECTED";
const LAYER_TOGGLED = "LAYER_TOGGLED";
const TOOL_SELECTED = "TOOL_SELECTED";
const TOOL_PROPERTIES_UPDATED = "TOOL_PROPERTIES_UPDATED";
const BASE_CHANGE = "BASE_CHANGE";
const MAP_RECENTER = "MAP_RECENTER";

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

var changeBase = function(newBase) {
    console.log(newBase);

    store.dispatch({
       type: BASE_CHANGE,
       properties: newBase
    });
}

var recenterMap = function(properties) {
    store.dispatch({
        type: MAP_RECENTER,
        properties: properties
    });
}

export{LAYER_SELECTED, LAYER_TOGGLED, TOOL_SELECTED, TOOL_PROPERTIES_UPDATED, BASE_CHANGE, MAP_RECENTER};

export {toggleLayer, selectLayer, selectTool, updateToolProperties, changeBase, recenterMap};
