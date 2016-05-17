'use strict';

import {MISSIONS_RECEIVED, MISSION_CREATED, MISSION_ARCHIVED, LAYER_CREATED, LAYER_DELETED, LAYERS_RECEIVED, MISSION_SELECTED} from '../actions/Connect.js';

export default function dataReducer(previousControlState, action) {

    if(previousControlState == undefined) {
        return {
            missions : {},
            mission_info : {},
            layers : {},
            default_layer: -1
        };
    }

    const newState = Object.assign({}, previousControlState);

    switch(action.type) {
        case MISSION_SELECTED:
            newState.mission_info = action.mission;
            break;
        case MISSIONS_RECEIVED:
            for(let mission of action.missions) {
                newState.missions[mission.mission_id] = mission;
            }
            break;
        case MISSION_CREATED:
            newState.missions[action.mission.mission_id] = action.mission;
            break;
        case MISSION_ARCHIVED:
            delete newState.missions[action.mission_id];
            break;
        case LAYER_CREATED:
            newState.layers[action.layer.layer_id] = action.layer;
            break;
        case LAYER_DELETED:
            delete newState.layers[action.layer_id];
            break;
        case LAYERS_RECEIVED:
            for(let layer of action.layers) {
                newState.layers[layer.layer_id] = layer;
                if(newState.default_layer == -1 || parseInt(layer.layer_id) < parseInt(newState.default_layer)) {
                    newState.default_layer = layer.layer_id + "";
                }
            }
            break;
        default:
            break;
    };

    return newState;
}
