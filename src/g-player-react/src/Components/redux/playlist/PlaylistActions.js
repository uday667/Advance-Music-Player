import { ADD, RENAME } from "../GPActionTypes"
import { PLAYLIST_ADD_TO_PLAYLIST_FAIL, PLAYLIST_ADD_TO_PLAYLIST_START, PLAYLIST_ADD_TO_PLAYLIST_SUCCESS, 
    PLAYLIST_CREATE_PLAYLIST_START, PLAYLIST_CREATE_PLAYLIST_SUCCESS, 
    PLAYLIST_DELETE_PLAYLIST_START, PLAYLIST_DELETE_PLAYLIST_SUCCESS, 
    PLAYLIST_EXPORT_PLAYLISTS_START, PLAYLIST_EXPORT_PLAYLISTS_SUCCESS, 
    PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_START, 
    PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_SUCCESS, 
    PLAYLIST_FETCH_PLAYLIST_NAMES_START, PLAYLIST_FETCH_PLAYLIST_NAMES_SUCCESS, 
    PLAYLIST_FETCH_SONGS_IN_PLAYLIST_START, PLAYLIST_FETCH_SONGS_IN_PLAYLIST_SUCCESS, 
    PLAYLIST_IMPORT_PLAYLISTS_START, PLAYLIST_IMPORT_PLAYLISTS_SUCCESS, 
    PLAYLIST_REMOVE_FROM_PLAYLIST_START, PLAYLIST_REMOVE_FROM_PLAYLIST_SUCCESS, 
    PLAYLIST_RENAME_PLAYLIST_START, PLAYLIST_RENAME_PLAYLIST_SUCCESS, 
    SET_ADDED_NEW_PLAYLIST_OBJ 
} from "./PlaylistActionTypes"

export const fetchPlaylistNames = () => ({
    type: PLAYLIST_FETCH_PLAYLIST_NAMES_START
})

export const fethPLaylistNamesSucc = (resp) => ({
    type:PLAYLIST_FETCH_PLAYLIST_NAMES_SUCCESS,
    resp
})

export const fetchSongsInPlaylist = (playListId, isSetPlayerTracks) => ({
    type: PLAYLIST_FETCH_SONGS_IN_PLAYLIST_START,
    playListId,
    isSetPlayerTracks
})

export const fetchSongsInPlaylistSucc = (playlistSongs) => ({
    type:PLAYLIST_FETCH_SONGS_IN_PLAYLIST_SUCCESS,
    playlistSongs
})

export const addToPlaylist = (reqPLObj) => ({
    type: PLAYLIST_ADD_TO_PLAYLIST_START,
    reqPLObj
})

export const addToPlaylistSucc = (response) => ({
    type:PLAYLIST_ADD_TO_PLAYLIST_SUCCESS,
    response
})

export const addToPlaylistFail = (error) => ({
    type:PLAYLIST_ADD_TO_PLAYLIST_FAIL,
    error
})

export const setAddedNewPlaylistObj = (addedNewPlaylistObj) => ({
    type: SET_ADDED_NEW_PLAYLIST_OBJ,
    addedNewPlaylistObj
})

export const removeFromPlaylist = (playListId, songId) => ({
    type: PLAYLIST_REMOVE_FROM_PLAYLIST_START,
    playListId,
    songId
})

export const removeFromPlaylistSucc = (playlistItem) => ({
    type:PLAYLIST_REMOVE_FROM_PLAYLIST_SUCCESS,
    playlistItem
})

export const createPlaylist = (createPlaylistObj) => ({
    type: PLAYLIST_CREATE_PLAYLIST_START,
    createPlaylistObj
})

export const createPlaylistSucc = (response) => ({
    type:PLAYLIST_CREATE_PLAYLIST_SUCCESS,
    response
})

export const renamePlaylist = (playlist) => ({
    type: PLAYLIST_RENAME_PLAYLIST_START,
    playlist
})

export const renamePlaylistSucc = (playlist) => ({
    type:PLAYLIST_RENAME_PLAYLIST_SUCCESS,
    playlist
})

export const deltePlaylist = (playlistId) => ({
    type: PLAYLIST_DELETE_PLAYLIST_START,
    playlistId
})

export const deltePlaylistSucc = (playlistId) => ({
    type:PLAYLIST_DELETE_PLAYLIST_SUCCESS,
    playlistId
})

export const exportPlaylists = () => ({
    type: PLAYLIST_EXPORT_PLAYLISTS_START
})

export const exportPlaylistsSucc = () => ({
    type: PLAYLIST_EXPORT_PLAYLISTS_SUCCESS
})

export const importPlaylists = (payload, fileType) => ({
    type: PLAYLIST_IMPORT_PLAYLISTS_START,
    payload,
    fileType
})

export const importPlaylistsSucc = () => ({
    type: PLAYLIST_IMPORT_PLAYLISTS_SUCCESS
})

export const fetchAssignedPlaylists = (objType, identifier) => ({
    type: PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_START,
    objType,
    identifier
})

export const fetchAssignedPlaylistsSucc = (response) => ({
    type: PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_SUCCESS,
    response
})

export const getUpdatedPlayListNames = (playlists, playlist, action) => {
    if(action === ADD){
        return [...playlists, playlist];
    }else if(action === RENAME){
        playlists.forEach(element => {
            if(element.id === playlist.id){
                element.name = playlist.name;
            }
        });
        return playlists;
    }else{
        return playlists.filter((pl)=>{return pl.id !== parseInt(playlist)});
    }
    
}

export const getUpdatedPlayListAlbums = (playlistAlbums, playlist, action) => {
    playlistAlbums[playlist.id] = [];
    return playlistAlbums;
}

export const removeRemovedSongFromPlaylist = (playlistSongs, playlistItem) => {
    for (let i = 0; i < playlistSongs.length; i++) {
        const element = playlistSongs[i];
        if(element.songId === playlistItem.songId){
            playlistSongs.splice(i, 1);
            break;
        }
    }
    return playlistSongs;
}

export const getUpdatedAssignedPlaylits = (assignedPlaylists, plItem, action) => {
    if(action === ADD){
        assignedPlaylists.push(plItem.playlist);
    }else{
        assignedPlaylists = assignedPlaylists.filter(pl=>pl!==plItem.playlist);
    }
    return assignedPlaylists;
}