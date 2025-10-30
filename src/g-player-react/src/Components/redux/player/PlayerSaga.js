import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getCookieValue, handleAPIError, setCookies } from "../../utilities/util";
import { GP_PAGE_TRACKS_MAP, MEDIA_PLAYER_NULL, PLAYER } from "../GPActionTypes";
import { deleteLyricsAPI, getCurrentSongAndStatusAPI, getCurrentSongStatusAPI, playASongAPI, playPauseAPI, setMediaVolumeAPI, 
            setPlaybackLengthAPI, updateLyricsAPI } from "../GPApis";
import { deleteLyricsSucc, fetchCurrentSontAndStatusSucc, fettchCurrentSongStatusSucc, playASong, playASongSucc, playPauseSucc, 
            setMediaVolumeSucc, setPlayBackLengthSucc, updateLyricsSucc } from "./PlayerActions";
import { PLAYER_CURRENT_SONG_AND_STATUS_START, PLAYER_CURRENT_SONG_STATUS_START, PLAYER_DELETE_LYRICS_START, PLAYER_PLAY_A_SONG_START, 
        PLAYER_PLAY_PAUSE_START, PLAYER_SET_MEDIA_VOLUME_START, PLAYER_SET_PB_LENGTH_START, 
        PLAYER_UPDATE_LYRICS_START 
    } from "./PlayerActionTypes";
import { setPlayerTracks, setStatusMessage } from "../library/LibraryActions";

export function * onPlayPause() {
    yield takeLatest(PLAYER_PLAY_PAUSE_START,onPlayPauseAsync);
}

export function* onPlayPauseAsync(payload){
    try {
        const response = yield call(playPauseAPI);
        if(response.status===200){
            const data = response.data;
            if(data.status===MEDIA_PLAYER_NULL){
                if(payload.songPlaying!==null){
                    yield put(playASong(payload.songPlaying.songId, payload.playedFrom, payload.currentVolume, payload.currentPlayTime))
                }
            }else{
                yield put(playPauseSucc(data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onPlayASong(){
    yield takeLatest(PLAYER_PLAY_A_SONG_START, onPlayASongAsync);
}

export function* onPlayASongAsync(payload){
    try {
        const response = yield call(playASongAPI,payload.songId, payload.currentVolume, payload.currentPlayTime);
        if(response.status===200){
            const data = response.data;
            if(data.status === "FAILED"){
                if(data.error){
                    yield put(setStatusMessage(data.error));
                }
            }else{
                yield put(playASongSucc(data,payload.playedFrom,payload.currentVolume));
                const pfKey = payload.playedFrom.pfKey;
                if(pfKey && pfKey !== PLAYER){
                    setCookies("playedFrom", JSON.stringify(payload.playedFrom));
                    yield put(setPlayerTracks(GP_PAGE_TRACKS_MAP[payload.playedFrom.pfKey]));
                }
                //if(data.status==="UNKNOWN")fettchCurrentSongStatus();
            }
        }
    }catch (error){
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchCurrentSongStatus(){
    yield takeLatest(PLAYER_CURRENT_SONG_STATUS_START, onFetchCurrentSongStatusAsync);
}

export function* onFetchCurrentSongStatusAsync(){
    try {
        const response = yield call(getCurrentSongStatusAPI);
        if(response.status === 200){
            yield put(fettchCurrentSongStatusSucc(response.data));
        }
    } catch (error) {
        console.log(error)
    }
}

export function* onSetMediaVolume(){
    yield takeEvery(PLAYER_SET_MEDIA_VOLUME_START, onSetMediaVolumeAsync);
}

export function* onSetMediaVolumeAsync(payload){
    try {
        const response = yield call(setMediaVolumeAPI,payload.volume);
        if(response.status === 200){
            if(response.data.gMedia!==null){
                yield put(setMediaVolumeSucc(response.data.gMedia));
                setCookies("currentVolume",response.data.gMedia.currentVolume);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export function* onSetPlayBackTime(){
    yield takeEvery(PLAYER_SET_PB_LENGTH_START, onSetPlayBackTimeAsync);
}

export function* onSetPlayBackTimeAsync(payload){
    try {
        const response = yield call(setPlaybackLengthAPI,payload.pbVal);
        if(response.status === 200){
            yield put(setPlayBackLengthSucc(response.data.gMedia));
        }
    } catch (error) {
        console.log(error);
    }
}

export function* onFetchCurrentSongAndStatus(){
    yield takeLatest(PLAYER_CURRENT_SONG_AND_STATUS_START, onFetchCurrentSongAndStatusAsync);
}

export function* onFetchCurrentSongAndStatusAsync(){
    try {
        const response = yield call(getCurrentSongAndStatusAPI);
        if(response.status === 200){
            const data = response.data;
            if(data.gMedia===null){
                const storedPlayingSongStat = getCookieValue("playingSongStat");
                if(storedPlayingSongStat!==undefined && Object.keys(storedPlayingSongStat).length>0){
                    data.gMedia = JSON.parse(getCookieValue("playingSongStat"))
                }
            }
            yield put(fetchCurrentSontAndStatusSucc(data));
        }
    } catch (error) {
        console.log(error);
    }
}

export function* onUpdateLyrics(){
    yield takeLatest(PLAYER_UPDATE_LYRICS_START, onUpdateLyricsAsync);
}

export function* onUpdateLyricsAsync(payload){
    try {
        const response = yield call(updateLyricsAPI,payload.songId, payload.lyrics);
        if(response.status === 200){
            yield put(updateLyricsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onDeleteLyrics(){
    yield takeLatest(PLAYER_DELETE_LYRICS_START, onDeleteLyricsAsync);
}

export function* onDeleteLyricsAsync(payload){
    try {
        const response = yield call(deleteLyricsAPI,payload.songId);
        if(response.status === 200){
            yield put(deleteLyricsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}