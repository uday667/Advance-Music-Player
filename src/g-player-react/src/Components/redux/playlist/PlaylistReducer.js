import { ADD, INIT, LOADING, PLAYLIST_ALBUMS, PLAYLIST_NAMES, PLAYLIST_SONGS_COUNT, REMOVE, RENAME, SUCCESS } from "../GPActionTypes";
import { PLAYLIST_ADD_TO_PLAYLIST_FAIL, PLAYLIST_ADD_TO_PLAYLIST_SUCCESS, PLAYLIST_CREATE_PLAYLIST_START, PLAYLIST_CREATE_PLAYLIST_SUCCESS, PLAYLIST_DELETE_PLAYLIST_START, PLAYLIST_DELETE_PLAYLIST_SUCCESS, PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_SUCCESS, PLAYLIST_FETCH_PLAYLIST_NAMES_START, PLAYLIST_FETCH_PLAYLIST_NAMES_SUCCESS, PLAYLIST_FETCH_SONGS_IN_PLAYLIST_START, PLAYLIST_FETCH_SONGS_IN_PLAYLIST_SUCCESS, PLAYLIST_REMOVE_FROM_PLAYLIST_START, PLAYLIST_REMOVE_FROM_PLAYLIST_SUCCESS, PLAYLIST_RENAME_PLAYLIST_START, PLAYLIST_RENAME_PLAYLIST_SUCCESS } from "./PlaylistActionTypes";
import { getUpdatedAssignedPlaylits, getUpdatedPlayListAlbums, getUpdatedPlayListNames, removeRemovedSongFromPlaylist } from "./PlaylistActions";

export const initialState = {
    playlists:[],
    playlistAlbums:{},
    playlistSongs:[],
    playlistSongsCount:{},
    addedNewPlaylistObj:{},
    assignedPlaylists:[],
    phase:INIT
}

const playlistReducer = (state = initialState, action) => {
    switch(action.type){
        case PLAYLIST_ADD_TO_PLAYLIST_SUCCESS:
            return{
                ...state,
                assignedPlaylists: getUpdatedAssignedPlaylits([...state.assignedPlaylists],action.response.playlistItems[0], ADD),
                phase: PLAYLIST_ADD_TO_PLAYLIST_SUCCESS
            }
        case PLAYLIST_ADD_TO_PLAYLIST_FAIL:
            return{
                ...state,
                phase: PLAYLIST_ADD_TO_PLAYLIST_FAIL
            }
        case PLAYLIST_FETCH_PLAYLIST_NAMES_START:
            return{
                ...state,
                phase: LOADING
            }
        case PLAYLIST_FETCH_PLAYLIST_NAMES_SUCCESS:
            return{
                ...state,
                playlists:action.resp[PLAYLIST_NAMES],
                playlistAlbums:action.resp[PLAYLIST_ALBUMS],
                playlistSongsCount: action.resp[PLAYLIST_SONGS_COUNT],
                phase:SUCCESS
            }
        case PLAYLIST_FETCH_SONGS_IN_PLAYLIST_START:
            return{
                ...state,
                phase: LOADING
            }
        case PLAYLIST_FETCH_SONGS_IN_PLAYLIST_SUCCESS:
            return{
                ...state,
                playlistSongs:action.playlistSongs,
                phase:PLAYLIST_FETCH_SONGS_IN_PLAYLIST_SUCCESS
            }
        case PLAYLIST_CREATE_PLAYLIST_START:
            return{
                ...state,
                phase: LOADING
            }
        case PLAYLIST_CREATE_PLAYLIST_SUCCESS:
            return{
                ...state,
                playlists: getUpdatedPlayListNames([...state.playlists], action.response.playlist, ADD),
                playlistAlbums: getUpdatedPlayListAlbums({...state.playlistAlbums}, action.response.playlist, ADD),
                addedNewPlaylistObj : action.response.addedNewPlaylistObj,
                phase:PLAYLIST_CREATE_PLAYLIST_SUCCESS
            }
        case PLAYLIST_DELETE_PLAYLIST_START:
            return{
                ...state,
                phase: LOADING
            }
        case PLAYLIST_DELETE_PLAYLIST_SUCCESS:
            return{
                ...state,
                playlists: getUpdatedPlayListNames([...state.playlists], action.playlistId, REMOVE),
                playlistSongs:[],
                phase:PLAYLIST_DELETE_PLAYLIST_SUCCESS
            }
         case PLAYLIST_RENAME_PLAYLIST_START:
            return{
                ...state,
                phase: LOADING
            }
        case PLAYLIST_RENAME_PLAYLIST_SUCCESS:
            return{
                ...state,
                playlists: getUpdatedPlayListNames([...state.playlists], action.playlist, RENAME),
                playlistSongs:[],
                phase:PLAYLIST_RENAME_PLAYLIST_SUCCESS
            }
        case PLAYLIST_REMOVE_FROM_PLAYLIST_START:
            return{
                ...state,
                phase: LOADING
            }
        case PLAYLIST_REMOVE_FROM_PLAYLIST_SUCCESS:
            return{
                ...state,
                playlistSongs: removeRemovedSongFromPlaylist([...state.playlistSongs], action.playlistItem),
                assignedPlaylists: getUpdatedAssignedPlaylits([...state.assignedPlaylists],action.playlistItem, REMOVE),
                phase: PLAYLIST_REMOVE_FROM_PLAYLIST_SUCCESS
            }
        case PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_SUCCESS:
            return{
                ...state,
                assignedPlaylists: action.response,
                phase: PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_SUCCESS
            }
        default:
            return {
                ...state,
                phase:INIT
            }
    }
}

export default playlistReducer;