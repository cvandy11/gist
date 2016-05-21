const LAYER_SELECTED = "LAYER_SELECTED";
const LAYER_TOGGLED = "LAYER_TOGGLED";
const TOOL_SELECTED = "TOOL_SELECTED";
const TOOL_PROPERTIES_UPDATED = "TOOL_PROPERTIES_UPDATED";
const BASE_CHANGE = "BASE_CHANGE";

import {push, replace} from 'redux-router';

function toggleLayer(layer_id) {
    return({
        type: LAYER_TOGGLED,
        layer_id: layer_id
    });
}

function selectLayer(layer_id) {
    return({
        type: LAYER_SELECTED,
        layer_id: layer_id
    });
}

function selectTool(tool) {
//   console.log(tool);
    return({
        type: TOOL_SELECTED,
        tool: tool
    });
}

function updateToolProperties(properties) {
    return({
        type: TOOL_PROPERTIES_UPDATED,
        properties: properties
    });
}

function changeBase(newBase) {
    return({
       type: BASE_CHANGE,
       properties: newBase
    });
}

function pushRoute(route) {
    return push({
        pathName: route
    });
}

function replaceRoute(route) {
    return replace({
        pathName: route
    });
}

export{LAYER_SELECTED, LAYER_TOGGLED, TOOL_SELECTED, TOOL_PROPERTIES_UPDATED, BASE_CHANGE};

export {toggleLayer, selectLayer, selectTool, updateToolProperties, changeBase, pushRoute, replaceRoute};
