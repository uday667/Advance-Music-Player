import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { getCookieValue, handleAPIError } from "../../utilities/util";
import { deleteMusicPathAPI, editAlbumInfoAPI, editTrackInfoAPI, fetchAlbumAPI, fetchAlbumImgsAPI,
         fetchalbumListOfAAAPI,
         fetchAlbumsByGenreAPI,
         fetchAlbumtracksAPI,
         fetchAllAlbumDtlsAPI, fetchAllAlbumsAPI, fetchAllArtistsDtlsAPI, 
         fetchAllHistoryAPI, 
         fetchBuildStatusAPI, 
         fetchGenreDetailsAPI, 
         fetchLanguageDetailsAPI, 
         fetchMostPlayedDataAPI, 
         fetchMusicpathAPI, 
         fetchSongsByArtistAPI, fetchSongsByGenreAPI, fetchSongsByLanguageAPI, getAllSongsAPI, getMessagesByType, initDeltaLibraryBuildAPI, initiateArtistImageDownload, initLibraryBuildAPI, saveMusicpathAPI, searchByKeyAPI, updateHistoryAPI, uploadArtistImgAPI 
    } from "../GPApis";
import { deleteMusicPathSucc, fetchAlbumImgsScc, fetchAlbumlistOfAASucc, fetchAlbumSucc, 
        fetchAlbumTacksSucc, 
        fetchAllAlbumArtistsDtlsSucc, fetchAllAlbumsDtlsSucc, fetchAllAlbumsSucc, 
        fetchAllArtistsDtlsSucc, fetchAllHistorySucc, fetchBuildStatusSucc, fetchGenreDetailsSucc, fetchMostPlayedDataSucc, 
        fetchMusicPathSucc, fetchSongsByArtistSucc, fetchAllSongsSucc, initiArtistImageDownloadSucc, initLibraryBuildSucc, 
        saveMusicPathSucc, searchByKeySucc, updateHistorySucc, fetchSongsByGenreSucc, setPlayerTracks, uploadArtistImgSucc, 
        setStatusMessage, fetchLanguageDetailsSucc, fetchSongsByLanguageSucc, editTrackInfoSucc, setMetadataPopupObj, 
        setArtistImageDownloadSummary, fetchMessagesByTypeSucc, editAlbumInfoSucc, initDeltaLibraryBuildSucc, 
        fetchAlbumsByGenreSucc 
    } from "./LibraryActions";
import { FETCH_SONGS_START, HISTORY_FETCH_ALL_HISTORY_START, HISTORY_UPDATE_HISTORY_START, LIBRARY_DELETE_MUSIC_PATH_START, LIBRARY_EDIT_ALBUM_INFO_START, LIBRARY_EDIT_TRACK_INFO_START, LIBRARY_FETCH_ALBUMS_DETAILS_START, LIBRARY_FETCH_ALBUMS_START, 
    LIBRARY_FETCH_ALBUM_ARTIST_LIST_START, 
    LIBRARY_FETCH_ALBUM_IMGS_START, LIBRARY_FETCH_ALBUM_LIST_OF_AA_START, LIBRARY_FETCH_ALBUM_START, LIBRARY_FETCH_ALBUM_TRACKS_START, LIBRARY_FETCH_ARTIST_LIST_START, 
    LIBRARY_FETCH_BUILD_STATUS_START, 
    LIBRARY_FETCH_GENRE_DETAILS_START, 
    LIBRARY_FETCH_LANGUAGE_DETAILS_START, 
    LIBRARY_FETCH_MOST_PLAYED_DATA_START, 
    LIBRARY_FETCH_MUSIC_PATH_START, 
    LIBRARY_FETCH_SONGS_BY_ARTIST_START, 
    LIBRARY_FETCH_SONGS_BY_GENRE_START, 
    LIBRARY_FETCH_SONGS_BY_LANGUAGE_START, 
    LIBRARY_INIT_ARTIST_IMG_DOWNLOAD_START, 
    LIBRARY_INIT_BUILD_DELTA_LIBRARY_START, 
    LIBRARY_INIT_BUILD_LIBRARY_START,
    LIBRARY_SAVE_MUSIC_PATH_START,
    LIBRARY_SEARCH_BY_KEY_START,
    LIBRARY_UPLOAD_ARTIST_IMG_START,
    MESSAGE_FETCH_BY_TYPE_START
} from "./LibraryActionTypes";
import { ARTIST_IMG_DOWNLOAD_STATUS, CURRENT_PAGE, GP_PAGE_TRACKS_MAP, SUCCESS } from "../GPActionTypes";

export function* onFetchAllSongs(){
    yield takeEvery(FETCH_SONGS_START, onFetchAllSongsAsnc);
}

export function* onFetchAllSongsAsnc(payload){
    try {
        const response = yield call(getAllSongsAPI);
        if(response.status===200){
            const data = response.data;
            if(payload.isSetPlayerTracks){
                yield put(setPlayerTracks(null,data.SONG_IDS));
            }else{
                yield put(fetchAllSongsSucc(data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }

}

export function* onFetchAllAlbums(){
    yield takeLatest(LIBRARY_FETCH_ALBUMS_START, onFetchAllAlbumsAsync);
}

export function* onFetchAllAlbumsAsync(){
    try {
        const response = yield call(fetchAllAlbumsAPI);
        if(response.status === 200){
            yield put(fetchAllAlbumsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAllAlbumDtls(){
    yield takeLatest(LIBRARY_FETCH_ALBUMS_DETAILS_START, onFetchAllAlbumDtlsAsync);
}

export function* onFetchAllAlbumDtlsAsync(){
    try {
        const response = yield call(fetchAllAlbumDtlsAPI);
        if(response.status === 200){
            yield put(fetchAllAlbumsDtlsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAlbumimgs(){
    yield takeLatest(LIBRARY_FETCH_ALBUM_IMGS_START, onFetchAlbumimgsAsync);
}

export function* onFetchAlbumimgsAsync(){
    try {
        const response = yield call(fetchAlbumImgsAPI);
        if(response.status === 200){
            yield put(fetchAlbumImgsScc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAlbumTracks(){
    yield takeEvery(LIBRARY_FETCH_ALBUM_TRACKS_START, onFetchAlbumTracksAsync);
}

export function* onFetchAlbumTracksAsync(payload){
    try {
        const response = yield call(fetchAlbumtracksAPI,payload.albumName, payload.language);
        if(response.status === 200){
            if(payload.isSetPlayerTracks){
                yield put(setPlayerTracks(null,response.data));
            }else{
                yield put(fetchAlbumTacksSucc(response.data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAlbum(){
    yield takeLatest(LIBRARY_FETCH_ALBUM_START, onFetchAlbumAsync);
}

export function* onFetchAlbumAsync(payload){
    try {
        const response = yield call(fetchAlbumAPI,payload.albumName);
        if(response.status === 200){
            yield put(fetchAlbumSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAllArtistsDtls(){
    yield takeLatest(LIBRARY_FETCH_ARTIST_LIST_START, onFetchAllArtistsDtlsAsync);
}

export function* onFetchAllArtistsDtlsAsync(payload){
    try {
        const response = yield call(fetchAllArtistsDtlsAPI,payload.artistType);
        if(response.status === 200){
            yield put(fetchAllArtistsDtlsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchSongsByArtist(){
    yield takeEvery(LIBRARY_FETCH_SONGS_BY_ARTIST_START, onFetchSongsByArtistAsync);
}

export function* onFetchSongsByArtistAsync(payload){
    try {
        const response = yield call(fetchSongsByArtistAPI,payload.artist);
        if(response.status === 200){
            if(payload.isSetPlayerTracks){
                yield put(setPlayerTracks(null,response.data));
            }else{
                yield put(fetchSongsByArtistSucc(response.data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAllAlbumArtistsDtls(){
    yield takeLatest(LIBRARY_FETCH_ALBUM_ARTIST_LIST_START, onFetchAllAlbumArtistsDtlsAsync);
}

export function* onFetchAllAlbumArtistsDtlsAsync(payload){
    try {
        const response = yield call(fetchAllArtistsDtlsAPI,payload.artistType);
        if(response.status === 200){
            yield put(fetchAllAlbumArtistsDtlsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAlbumListOfAA(){
    yield takeLatest(LIBRARY_FETCH_ALBUM_LIST_OF_AA_START, onFetchAlbumListOfAAAsync);
}

export function* onFetchAlbumListOfAAAsync(payload){
    try {
        const response = yield call(fetchalbumListOfAAAPI,payload.albumArtist);
        if(response.status === 200){
            yield put(fetchAlbumlistOfAASucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onUploadArtistImg(){
    yield takeLatest(LIBRARY_UPLOAD_ARTIST_IMG_START, onUploadArtistImgAsync);
}

export function* onUploadArtistImgAsync(payload){
    try {
        const response = yield call(uploadArtistImgAPI,payload.artistId,payload.data);
        if(response.status === 200){
            const data = response.data;
            if(data.status === SUCCESS){
                yield put(uploadArtistImgSucc(data.response));
                yield put(setStatusMessage("Updated image successfully"))
            }else{
                yield put(setStatusMessage("Unable to change picture. Please try again later or select different picture."))
            }
            
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

//Genre - Start
export function* onFetchGenreDetails(){
    yield takeLatest(LIBRARY_FETCH_GENRE_DETAILS_START, onFetchGenreDetailsAsync);
}

export function* onFetchGenreDetailsAsync(){
    try {
        const response = yield call(fetchGenreDetailsAPI);
        if(response.status === 200){
            yield put(fetchGenreDetailsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchSongsByGenre(){
    yield takeEvery(LIBRARY_FETCH_SONGS_BY_GENRE_START, onFetchSongsByGenreAsync);
}

export function* onFetchSongsByGenreAsync(payload){
    try {
        const response = yield call(fetchSongsByGenreAPI, payload.genre);
        if(response.status === 200){
            if(payload.isSetPlayerTracks){
                yield put(setPlayerTracks(null,response.data));
            }else{
                yield put(fetchSongsByGenreSucc(response.data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchAlbumsByGenre(){
    yield takeEvery(LIBRARY_FETCH_SONGS_BY_GENRE_START, onFetchAlbumsByGenreAsync);
}

export function* onFetchAlbumsByGenreAsync(payload){
    try {
        const response = yield call(fetchAlbumsByGenreAPI, payload.genre);
        if(response.status === 200){
            yield put(fetchAlbumsByGenreSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}
//Genre - End

//Language - Start
export function* onFetchLanguageDetails(){
    yield takeLatest(LIBRARY_FETCH_LANGUAGE_DETAILS_START, onFetchLanguageDetailsAsync);
}

export function* onFetchLanguageDetailsAsync(){
    try {
        const response = yield call(fetchLanguageDetailsAPI);
        if(response.status === 200){
            yield put(fetchLanguageDetailsSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchSongsByLanguage(){
    yield takeEvery(LIBRARY_FETCH_SONGS_BY_LANGUAGE_START, onFetchSongsByLanguageAsync);
}

export function* onFetchSongsByLanguageAsync(payload){
    try {
        const response = yield call(fetchSongsByLanguageAPI, payload.language);
        if(response.status === 200){
            if(payload.isSetPlayerTracks){
                yield put(setPlayerTracks(null,response.data));
            }else{
                yield put(fetchSongsByLanguageSucc(response.data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}
//Language - End

//Side bar library
export function* onInitLibraryBuild(){
    yield takeLatest(LIBRARY_INIT_BUILD_LIBRARY_START, onInitLibraryBuildAsync);
}

export function*onInitLibraryBuildAsync(payload){
    try {
        const response = yield call(initLibraryBuildAPI, payload.isTakePlBkp);
        if(response.status === 200){
            yield put(initLibraryBuildSucc(response.data.response));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onInitDeltaLibraryBuild(){
    yield takeLatest(LIBRARY_INIT_BUILD_DELTA_LIBRARY_START, onInitDeltaLibraryBuildAsync);
}

export function* onInitDeltaLibraryBuildAsync(){
    try {
        const response = yield call(initDeltaLibraryBuildAPI);
        if(response.status === 200){
            if(response.data.error){
                yield put(setStatusMessage(response.data.error));
            }else{
                if(response.data.status){yield put(setStatusMessage(response.data.status));}
                yield put(initDeltaLibraryBuildSucc(response.data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onsaveMusicPath(){
    yield takeLatest(LIBRARY_SAVE_MUSIC_PATH_START, onsaveMusicPathAsync);
}

export function* onsaveMusicPathAsync(payload){
    try {
        const response = yield call(saveMusicpathAPI, payload.musicPath);
        if(response.status === 200){
            yield put(saveMusicPathSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchMusicPath(){
    yield takeLatest(LIBRARY_FETCH_MUSIC_PATH_START, onFetchMusicPathAsync);
}

export function* onFetchMusicPathAsync(){
    try {
        const response = yield call(fetchMusicpathAPI);
        if(response.status === 200){
            yield put(fetchMusicPathSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onDeleteMusicPath(){
    yield takeLatest(LIBRARY_DELETE_MUSIC_PATH_START, onDeleteMusicPathAsync);
}

export function* onDeleteMusicPathAsync(payload){
    try {
        const response = yield call(deleteMusicPathAPI, payload.musicPath.messageId);
        if(response.status === 200){
            yield put(deleteMusicPathSucc(response.data, payload.musicPath));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onSearchByKey(){
    yield takeLatest(LIBRARY_SEARCH_BY_KEY_START, onSearchByKeyAsync);
}

export function* onSearchByKeyAsync(payload){
    try {
        const response = yield call(searchByKeyAPI, payload.searchKey);
        if(response.status === 200){
            yield put(searchByKeySucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchBuildStatus(){
    yield takeLatest(LIBRARY_FETCH_BUILD_STATUS_START, onFetchBuildStatusAsync);
}

export function* onFetchBuildStatusAsync(){
    try {
        const response = yield call(fetchBuildStatusAPI);
        if(response.status === 200){
            yield put(fetchBuildStatusSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onFetchMostPlayedData(){
    yield takeLatest(LIBRARY_FETCH_MOST_PLAYED_DATA_START, onFetchMostPlayedDataAsync);
}

export function* onFetchMostPlayedDataAsync(){
    try {
        const response = yield call(fetchMostPlayedDataAPI);
        if(response.status === 200){
            yield put(fetchMostPlayedDataSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onInitArtistImgDownload(){
    yield takeLatest(LIBRARY_INIT_ARTIST_IMG_DOWNLOAD_START, onInitArtistImgDownloadAsync);
}

export function* onInitArtistImgDownloadAsync(payload){
    try {
        const response = yield call(initiateArtistImageDownload,payload.downloadOption);
        if(response.status === 200){
            yield put(initiArtistImageDownloadSucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onEditTrackInfo (){
    yield takeLatest(LIBRARY_EDIT_TRACK_INFO_START, onEditTrackInfoAsync);
}

export function* onEditTrackInfoAsync(payload){
    try {
        const response = yield call(editTrackInfoAPI, payload.payload, payload.objType);
        if(response.status === 200){
            const data = response.data;
            
            if(data.status === SUCCESS){
                let currentPage = getCookieValue(CURRENT_PAGE);
                if(currentPage){
                    currentPage = JSON.parse(currentPage);
                    const field = GP_PAGE_TRACKS_MAP[currentPage.type];
                    yield put(editTrackInfoSucc(field, data.library));
                }
                yield put(setMetadataPopupObj({showMetadataPopup:false}));
                yield put(setStatusMessage("Updated info successfully"));
            }else{
                yield put(setStatusMessage(data.status1));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onEditAlbumInfo (){
    yield takeLatest(LIBRARY_EDIT_ALBUM_INFO_START, onEditAlbumInfoAsync);
}

export function* onEditAlbumInfoAsync(payload){
    try {
        const response = yield call(editAlbumInfoAPI, payload.payload);
        if(response.status === 200){
            const data = response.data;
            if(data.status === SUCCESS){
                yield put(editAlbumInfoSucc(data.response.RESPONSE_ALBUM));
                yield put(setMetadataPopupObj({showMetadataPopup:false}));
                yield put(setStatusMessage("Updated info successfully"));
            }else{
                yield put(setStatusMessage(data.status1));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

//History Start
export function* onFetchAllHistory(){
    yield takeEvery(HISTORY_FETCH_ALL_HISTORY_START, onFetchAllHistoryAsync);
}

export function* onFetchAllHistoryAsync(payload){
    try {
        const response = yield call(fetchAllHistoryAPI);
        if(response.status === 200){
            if(payload.isSetPlayerTracks){
                yield put(setPlayerTracks(null,response.data.songs));
            }else{
                yield put(fetchAllHistorySucc(response.data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}

export function* onUpdateHistory(){
    yield takeLatest(HISTORY_UPDATE_HISTORY_START, onUpdateHistoryAsync);
}

export function* onUpdateHistoryAsync(payload){
    try {
        const response = yield call(updateHistoryAPI, payload.songId);
        if(response.status === 200){
            yield put(updateHistorySucc(response.data));
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}
//History End


export function* onFetchMessagesByType(){
    yield takeLatest(MESSAGE_FETCH_BY_TYPE_START, onFetchMessagesByTypeAsync);
}

export function* onFetchMessagesByTypeAsync(payload){
    try {
        const response = yield call(getMessagesByType, payload.messageType);
        if(response.status === 200){
            if(payload.messageType === ARTIST_IMG_DOWNLOAD_STATUS){
                yield put(setArtistImageDownloadSummary(response.data))
            }else{
                yield put(fetchMessagesByTypeSucc(response.data));
            }
        }
    } catch (error) {
        console.log(error);
        handleAPIError(error);
    }
}