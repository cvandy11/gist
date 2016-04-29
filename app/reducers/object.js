import {OBJECT_INSERTED, OBJECTS_RECEIVED} from '../actions/Connect.js';

export default function objectReducer(previousObjectState, action) {

    //initial state, when loading the objects in
    if(previousObjectState == undefined) {
        return {loaded: false, objects:[]}
    }

    const newState = Object.assign({}, previousObjectState);

    switch(action.type) {
        case OBJECT_INSERTED:
            newState.loaded = true;
            newState.objects.push(action.object);
            break;
        case OBJECTS_RECEIVED:
            newState.loaded = true;
            newState.objects.push(action.data);
            break;
        default:
            break;
    };

    return newState;
}
