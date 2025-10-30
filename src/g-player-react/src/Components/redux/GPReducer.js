import { combineReducers } from "redux";
import libraryReducer from "./library/LibraryReducer";
import playerReducer from "./player/PlayerReducer";
import playlistReducer from "./playlist/PlaylistReducer";

export const GPReducer = combineReducers({
    library: libraryReducer,
    player: playerReducer,
    playlist: playlistReducer
})