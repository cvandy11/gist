'use strict';

import {MISSIONS_RECEIVED, MISSION_CREATED, MISSION_ARCHIVED} from '../actions/Connect.js';

export default function dataReducer(previousControlState, action) {

    if(previousControlState == undefined) {
        return {
            missions : {},
            mission_info : {},

        };
    }

    const newState = Object.assign({}, previousControlState);

    switch(action.type) {
        case MISSIONS_RECEIVED:
            newState.missions = action.missions;
            break;
        case MISSION_CREATED:
            newState.missions[action.mission.mission_id] = action.mission;
            break;
        case MISSION_ARCHIVED:
            delete newState.missions[action.mission_id];
            break;
        default:
            break;
    };

    return newState;
}
