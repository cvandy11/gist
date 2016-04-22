import {ERROR} from '../actions/Connect.js';

export default function errorReducer(previousControlState, action) {

    if(previousControlState == undefined) {
        return {
            type: "none",
            message: "",
        };
    };

    const newState = Object.assign({}, previousControlState);

    switch(action.type) {
        case ERROR:
            newState.type = "Error";
            newState.message = action.message;
            break;
        default:
            break;
    };

    return newState;
}
