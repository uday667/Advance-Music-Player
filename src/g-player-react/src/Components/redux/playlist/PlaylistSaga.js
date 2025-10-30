import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { addToPlaylistAPI, createPlaylistAPI, deletePlaylistAPI, exportPlaylistsAPI, fetchAssignedPlaylistsAPI, fetchPlaylistNamesAPI, fetchSongsInPlaylistAPI, importPlaylistsAPI, removeFromPlaylistAPI, renamePlaylistAPI } from "../GPApis";
import { PLAYLIST_ADD_TO_PLAYLIST_START, PLAYLIST_CREATE_PLAYLIST_START, PLAYLIST_DELETE_PLAYLIST_START, PLAYLIST_EXPORT_PLAYLISTS_START, PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_START, PLAYLIST_FETCH_PLAYLIST_NAMES_START, PLAYLIST_FETCH_SONGS_IN_PLAYLIST_START, PLAYLIST_IMPORT_PLAYLISTS_START, PLAYLIST_REMOVE_FROM_PLAYLIST_START, PLAYLIST_RENAME_PLAYLIST_START } from "./PlaylistActionTypes";
import { addToPlaylistFail, addToPlaylistSucc, createPlaylistSucc, deltePlaylistSucc, fetchAssignedPlaylistsSucc, fetchSongsInPlaylistSucc, fethPLaylistNamesSucc, importPlaylistsSucc, removeFromPlaylistSucc, renamePlaylistSucc } from "./PlaylistActions";
import { handleAPIError } from "../../utilities/util";
import { setCommonPopupObj, setPlayerTracks, setPlaylistSongs, setShowContextMenu, setShowPlaylistSelector, setStatusMessage } from "../library/LibraryActions";
import { FAILED, SUCCESS } from "../GPActionTypes";

export function* onFetchPlaylistNames(){
    yield takeLatest(PLAYLIST_FETCH_PLAYLIST_NAMES_START, onFetchPlaylistNamesAsnc);
}

export function* onFetchPlaylistNamesAsnc(){
    try {
        const response = yield call(fetchPlaylistNamesAPI);
        if(response.status===200){
            const data = response.data;
            yield put(fethPLaylistNamesSucc(data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onFetchSongsInPlaylist(){
    yield takeEvery(PLAYLIST_FETCH_SONGS_IN_PLAYLIST_START, onFetchSongsInPlaylistAsnc);
}

export function* onFetchSongsInPlaylistAsnc(payload){
    try {
        const response = yield call(fetchSongsInPlaylistAPI, payload.playListId);
        if(response.status===200){
            const data = response.data;
            if(payload.isSetPlayerTracks){
                yield put(setPlayerTracks(null,data));
            }else{
                yield put(fetchSongsInPlaylistSucc(data));
                yield put(setPlaylistSongs(data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onAddToPlaylist(){
    yield takeLatest(PLAYLIST_ADD_TO_PLAYLIST_START, onAddToPlaylistAsnc);
}

export function* onAddToPlaylistAsnc(payload){
    try {
        const response = yield call(addToPlaylistAPI, payload.reqPLObj);
        if(response.status===200){
            const data = response.data;
            let successMessage;
            if(data.status === SUCCESS){
                let addedSongsCount = data.playlistItems.length;
                const playlistItem = data.playlistItems[0];
                //successMessage = "Added "+addedSongsCount+" tracks to "+playlistItem.playlist+" playlist!";
                successMessage = data.status1;
                if(addedSongsCount === 1){
                   // const songPath = playlistItem.songPath;
                    //addedSongsCount = songPath.substring(songPath.lastIndexOf("\\")+1, songPath.indexOf("."));
                    successMessage = "Added "+data?.playlistItems?.at(0)?.songTitle+" to "+playlistItem.playlist+" playlist!";
                }
                yield put(addToPlaylistSucc(data));
            }else{
                successMessage = data.error;
                yield put(addToPlaylistFail(data));
            }
            yield put(setShowPlaylistSelector(false));
            yield put(setShowContextMenu(false));
            yield put(setStatusMessage(successMessage));
            
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onRemoveFromPlaylist(){
    yield takeLatest(PLAYLIST_REMOVE_FROM_PLAYLIST_START, onRemoveFromPlaylistAsnc);
}

export function* onRemoveFromPlaylistAsnc(payload){
    try {
        const response = yield call(removeFromPlaylistAPI, payload.playListId, payload.songId);
        if(response.status===200){
            const data = response.data;
            yield put(setShowContextMenu(false));
            yield put(removeFromPlaylistSucc(data.playlist));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onCreatePlaylist(){
    yield takeLatest(PLAYLIST_CREATE_PLAYLIST_START, onCreatePlaylistAsnc);
}

export function* onCreatePlaylistAsnc(payload){
    try {
        const response = yield call(createPlaylistAPI, payload.createPlaylistObj.playlist);
        if(response.status===200){
            const data = response.data;
            if(data.status === SUCCESS){
                const tempAddedNewPlaylistObj = {
                    isAddToNewPlaylist : false
                }
                if(payload.createPlaylistObj.addedNewPlaylistObj){
                    tempAddedNewPlaylistObj.playlist= data.response;
                    tempAddedNewPlaylistObj.isAddToNewPlaylist = true
                }
                const resp = {
                    playlist: data.response,
                    addedNewPlaylistObj: tempAddedNewPlaylistObj
                }
                yield put(createPlaylistSucc(resp));
            }else if(data.status === FAILED){
                yield put(setStatusMessage(data.error))
            }
            
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onDeletePlaylist(){
    yield takeLatest(PLAYLIST_DELETE_PLAYLIST_START, onDeletePlaylistAsnc);
}

export function* onDeletePlaylistAsnc(payload){
    try {
        const response = yield call(deletePlaylistAPI, payload.playlistId);
        if(response.status===200){
            yield put(deltePlaylistSucc(payload.playlistId));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onRenamePlaylist(){
    yield takeLatest(PLAYLIST_RENAME_PLAYLIST_START, onRenamePlaylistAsnc);
}

export function* onRenamePlaylistAsnc(payload){
    try {
        const response = yield call(renamePlaylistAPI, payload.playlist);
        if(response.status===200){
            const data = response.data;
            yield put(renamePlaylistSucc(data.response));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onExportPlaylists(){
    yield takeLatest(PLAYLIST_EXPORT_PLAYLISTS_START, onExportPlaylistsAsnc);
}

export function* onExportPlaylistsAsnc(){
    try {
        const response = yield call(exportPlaylistsAPI);
        if(response.status===200){
            const data = response.data;
            const message = Object.keys(data.response).length+' Playlists are exported to "'+data.status1+'" path.';
            yield put(setStatusMessage(message));
            yield put(setCommonPopupObj({showPopup:false}))
            //yield put(exportPlaylistsSucc());
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onImportPlaylists(){
    yield takeLatest(PLAYLIST_IMPORT_PLAYLISTS_START, onImportPlaylistsAsnc);
}

export function* onImportPlaylistsAsnc(payload){
    try {
        const response = yield call(importPlaylistsAPI, payload.payload, payload.fileType);
        if(response.status===200){
            const data = response.data;
            yield put(fethPLaylistNamesSucc(data.response));
            const message = data.status1+' Playlist/s are successfully imported!';
            yield put(setStatusMessage(message));
            yield put(setCommonPopupObj({showPopup:false}));
            yield put(importPlaylistsSucc());
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onFetchAssignedPlaylits(){
    yield takeLatest(PLAYLIST_FETCH_ASSIGNED_PLAYLISTS_START, onFetchAssignedPlaylitsAsnc);
}

export function* onFetchAssignedPlaylitsAsnc(payload){
    try {
        const response = yield call(fetchAssignedPlaylistsAPI, payload);
        if(response.status === 200){
            const data = response.data;
            yield put(fetchAssignedPlaylistsSucc(data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}