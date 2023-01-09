//----------------
//---------------- OUT OF USE - refactored with newer redux and uses the global store
//----------------
import { combineReducers } from "redux";
import auth from "./auth";

export default combineReducers({
    auth,
});
