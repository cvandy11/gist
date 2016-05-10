import {OBJECT_INSERTED, OBJECTS_RECEIVED, OBJECT_DELETED} from '../actions/Connect.js';

export default function objectReducer(previousObjectState, action) {

    //initial state, when loading the objects in
    if(previousObjectState == undefined) {
        return {loaded: false, objects:{}}
    }

    const newState = Object.assign({}, previousObjectState);

    switch(action.type) {
        case OBJECT_INSERTED:
            newState.loaded = true;
            newState.objects[action.object.object_id] = action.object;
            break;
        case OBJECTS_RECEIVED:
            newState.loaded = true;
            for(let x of action.data) {
                newState.objects[x.object_id] = x;
            }
            break;
        case OBJECT_DELETED:
            delete newState.objects[action.object_id];
            break;
        default:
            break;
    };

    return newState;
}
