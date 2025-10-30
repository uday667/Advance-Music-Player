import { ADD, REMOVE, REMOVE_ALL, SUCCESS } from "../GPActionTypes";
import { FETCH_SONGS_START, FETCH_SONGS_SUCCESS, 
        HISTORY_FETCH_ALL_HISTORY_START, HISTORY_FETCH_ALL_HISTORY_SUCCESS, 
        HISTORY_UPDATE_HISTORY_START, HISTORY_UPDATE_HISTORY_SUCCESS, 
        LIBRARY_DELETE_MUSIC_PATH_START, LIBRARY_DELETE_MUSIC_PATH_SUCCESS, 
        LIBRARY_EDIT_ALBUM_INFO_START, 
        LIBRARY_EDIT_ALBUM_INFO_SUCCESS, 
        LIBRARY_EDIT_TRACK_INFO_START, 
        LIBRARY_EDIT_TRACK_INFO_SUCCESS, 
        LIBRARY_FETCH_ALBUMS_BY_GENRE_START, 
        LIBRARY_FETCH_ALBUMS_BY_GENRE_SUCCESS, 
        LIBRARY_FETCH_ALBUMS_DETAILS_START, LIBRARY_FETCH_ALBUMS_DETAILS_SUCCESS, 
        LIBRARY_FETCH_ALBUMS_START, LIBRARY_FETCH_ALBUMS_SUCCESS, 
        LIBRARY_FETCH_ALBUM_ARTIST_LIST_START, LIBRARY_FETCH_ALBUM_ARTIST_LIST_SUCCESS, 
        LIBRARY_FETCH_ALBUM_IMGS_START, LIBRARY_FETCH_ALBUM_IMGS_SUCCESS, 
        LIBRARY_FETCH_ALBUM_LIST_OF_AA_START, LIBRARY_FETCH_ALBUM_LIST_OF_AA_SUCCESS, 
        LIBRARY_FETCH_ALBUM_START, LIBRARY_FETCH_ALBUM_SUCCESS, 
        LIBRARY_FETCH_ALBUM_TRACKS_START, LIBRARY_FETCH_ALBUM_TRACKS_SUCCESS, 
        LIBRARY_FETCH_ARTIST_LIST_START, LIBRARY_FETCH_ARTIST_LIST_SUCCESS, 
        LIBRARY_FETCH_BUILD_STATUS_START, LIBRARY_FETCH_BUILD_STATUS_SUCCESS, 
        LIBRARY_FETCH_GENRE_DETAILS_START, LIBRARY_FETCH_GENRE_DETAILS_SUCCESS, 
        LIBRARY_FETCH_LANGUAGE_DETAILS_START, 
        LIBRARY_FETCH_LANGUAGE_DETAILS_SUCCESS, 
        LIBRARY_FETCH_MOST_PLAYED_DATA_START, LIBRARY_FETCH_MOST_PLAYED_DATA_SUCCESS, 
        LIBRARY_FETCH_MUSIC_PATH_START, LIBRARY_FETCH_MUSIC_PATH_SUCCESS, 
        LIBRARY_FETCH_SONGS_BY_ARTIST_START, LIBRARY_FETCH_SONGS_BY_ARTIST_SUCCESS, 
        LIBRARY_FETCH_SONGS_BY_GENRE_START, LIBRARY_FETCH_SONGS_BY_GENRE_SUCCESS, 
        LIBRARY_FETCH_SONGS_BY_LANGUAGE_START, 
        LIBRARY_FETCH_SONGS_BY_LANGUAGE_SUCCESS, 
        LIBRARY_INIT_ARTIST_IMG_DOWNLOAD_START, LIBRARY_INIT_ARTIST_IMG_DOWNLOAD_SUCCESS, 
        LIBRARY_INIT_BUILD_DELTA_LIBRARY_START, 
        LIBRARY_INIT_BUILD_DELTA_LIBRARY_SUCESS, 
        LIBRARY_INIT_BUILD_LIBRARY_START, LIBRARY_INIT_BUILD_LIBRARY_SUCESS, 
        LIBRARY_SAVE_MUSIC_PATH_START, LIBRARY_SAVE_MUSIC_PATH_SUCCESS, 
        LIBRARY_SEARCH_BY_KEY_START, LIBRARY_SEARCH_BY_KEY_SUCCESS, 
        LIBRARY_UPLOAD_ARTIST_IMG_START, 
        LIBRARY_UPLOAD_ARTIST_IMG_SUCCESS, 
        MESSAGE_FETCH_BY_TYPE_START, 
        MESSAGE_FETCH_BY_TYPE_SUCCESS, 
        SET_ARTIST_IMGAE_DOWNLOAD_SUMMARY, 
        SET_CHECKED_TRACK, 
        SET_COMMON_POPUP_OBJ, SET_CONTEXT_OBJECT, SET_CURRENT_PAGE, SET_GLOBAL_FILTER_TEXT, SET_IS_CLICKED_ON_CONTEXT_MENU, 
        SET_METADATA_POPUP_OBJ, 
        SET_PLAYER_TRACKS, SET_PLAYLIST_SONGS, SET_SHOW_CONTEXT_MENU, SET_SHOW_PLAY_LIST_SELECTOR, SET_SHOW_TRACK_CHECKBOX, SET_STATUS_MESSAGE 
    } from "./LibraryActionTypes";

export const fetchAllSongs = (isSetPlayerTracks) => ({
    type: FETCH_SONGS_START,
    isSetPlayerTracks
})

export const fetchAllSongsSucc = (tracks) => ({
    type:FETCH_SONGS_SUCCESS,
    tracks
})

export const fetchAllAlbums = () => ({
    type: LIBRARY_FETCH_ALBUMS_START
})

export const fetchAllAlbumsSucc = (albums) => ({
    type: LIBRARY_FETCH_ALBUMS_SUCCESS,
    albums
})

export const fetchAllAlbumsDtls = () => ({ //Not used anymore
    type: LIBRARY_FETCH_ALBUMS_DETAILS_START
})

export const fetchAllAlbumsDtlsSucc = (albumsDetails) => ({//Not used anymore
    type: LIBRARY_FETCH_ALBUMS_DETAILS_SUCCESS,
    albumsDetails
})

export const fetchAlbumImgs = () => ({
    type:LIBRARY_FETCH_ALBUM_IMGS_START
})

export const fetchAlbumImgsScc = (albumImgs) => ({
    type: LIBRARY_FETCH_ALBUM_IMGS_SUCCESS,
    albumImgs
})

export const fetchAlbumTacks = (albumName, language, isSetPlayerTracks) => ({
    type:LIBRARY_FETCH_ALBUM_TRACKS_START,
    albumName,
    language,
    isSetPlayerTracks
})

export const fetchAlbumTacksSucc = (albumTracks) => ({
    type: LIBRARY_FETCH_ALBUM_TRACKS_SUCCESS,
    albumTracks
})

export const fetchAlbum = (albumName) => ({
    type:LIBRARY_FETCH_ALBUM_START,
    albumName
})

export const fetchAlbumSucc = (album) => ({
    type: LIBRARY_FETCH_ALBUM_SUCCESS,
    album
})

// export const setGroupband = (groupBand) => ({
//     type: SET_GROUP_BAND,
//     groupBand
// })

export const fetchAllArtistsDtls = (artistType) => ({
    type: LIBRARY_FETCH_ARTIST_LIST_START,
    artistType
})

export const fetchAllArtistsDtlsSucc = (artistsDetails) => ({
    type: LIBRARY_FETCH_ARTIST_LIST_SUCCESS,
    artistsDetails
})

export const fetchSongsByArtist = (artist,isSetPlayerTracks) => ({
    type: LIBRARY_FETCH_SONGS_BY_ARTIST_START,
    artist,
    isSetPlayerTracks
})

export const fetchSongsByArtistSucc = (artistTracks) => ({
    type: LIBRARY_FETCH_SONGS_BY_ARTIST_SUCCESS,
    artistTracks
})

export const fetchAllAlbumArtistsDtls = (artistType) => ({
    type: LIBRARY_FETCH_ALBUM_ARTIST_LIST_START,
    artistType
})

export const fetchAllAlbumArtistsDtlsSucc = (albumArtistsDetails) => ({
    type: LIBRARY_FETCH_ALBUM_ARTIST_LIST_SUCCESS,
    albumArtistsDetails
})

export const fetchAlbumlistOfAA = (albumArtist) => ({
    type: LIBRARY_FETCH_ALBUM_LIST_OF_AA_START,
    albumArtist
})

export const fetchAlbumlistOfAASucc = (albumListOfAA) => ({
    type: LIBRARY_FETCH_ALBUM_LIST_OF_AA_SUCCESS,
    albumListOfAA
})

export const uploadArtistImg = (artistId,data) => ({
    type: LIBRARY_UPLOAD_ARTIST_IMG_START,
    artistId,
    data
})

export const uploadArtistImgSucc = (artistObj) => ({
    type: LIBRARY_UPLOAD_ARTIST_IMG_SUCCESS,
    artistObj
})

//Genre - Start
export const fetchGenreDetails = () => ({
    type: LIBRARY_FETCH_GENRE_DETAILS_START
})

export const fetchGenreDetailsSucc = (genreDetails) => ({
    type: LIBRARY_FETCH_GENRE_DETAILS_SUCCESS,
    genreDetails
})

export const fetchSongsByGenre = (genre, isSetPlayerTracks) => ({
    type: LIBRARY_FETCH_SONGS_BY_GENRE_START,
    genre,
    isSetPlayerTracks
})

export const fetchSongsByGenreSucc = (genreSongList) => ({
    type: LIBRARY_FETCH_SONGS_BY_GENRE_SUCCESS,
    genreSongList
})

export const fetchAlbumsByGenre = (genre) => ({
    type: LIBRARY_FETCH_ALBUMS_BY_GENRE_START,
    genre
})

export const fetchAlbumsByGenreSucc = (response) => ({
    type: LIBRARY_FETCH_ALBUMS_BY_GENRE_SUCCESS,
    response
})
//Genre - End

//Language - Start
export const fetchLanguageDetails = () => ({
    type: LIBRARY_FETCH_LANGUAGE_DETAILS_START
})

export const fetchLanguageDetailsSucc = (languageDetails) => ({
    type: LIBRARY_FETCH_LANGUAGE_DETAILS_SUCCESS,
    languageDetails
})

export const fetchSongsByLanguage = (language, isSetPlayerTracks) => ({
    type: LIBRARY_FETCH_SONGS_BY_LANGUAGE_START,
    language,
    isSetPlayerTracks
})

export const fetchSongsByLanguageSucc = (languageSongList) => ({
    type: LIBRARY_FETCH_SONGS_BY_LANGUAGE_SUCCESS,
    languageSongList
})
//Language - Start

export const setPlayerTracks = (trackListName, playerTracks) => ({
    type: SET_PLAYER_TRACKS,
    trackListName,
    playerTracks
})

export const setPlaylistSongs = (playlistSongs) => ({
    type: SET_PLAYLIST_SONGS,
    playlistSongs
})

//Genre - End

//Side bar Library
export const initLibraryBuild = (isTakePlBkp) => ({
    type: LIBRARY_INIT_BUILD_LIBRARY_START,
    isTakePlBkp
})

export const initLibraryBuildSucc = (response) => ({
    type: LIBRARY_INIT_BUILD_LIBRARY_SUCESS,
    response
})

export const initDeltaLibraryBuild = () => ({
    type: LIBRARY_INIT_BUILD_DELTA_LIBRARY_START
})

export const initDeltaLibraryBuildSucc = (response) => ({
    type: LIBRARY_INIT_BUILD_DELTA_LIBRARY_SUCESS,
    response
})

export const saveMusicPath = (musicPath) => ({
    type: LIBRARY_SAVE_MUSIC_PATH_START,
    musicPath
})

export const saveMusicPathSucc = (response) => ({
    type: LIBRARY_SAVE_MUSIC_PATH_SUCCESS,
    response
})

export const fetchMusicPath = (musicPath) => ({
    type: LIBRARY_FETCH_MUSIC_PATH_START,
    musicPath
})

export const fetchMusicPathSucc = (response) => ({
    type: LIBRARY_FETCH_MUSIC_PATH_SUCCESS,
    response
})

export const deleteMusicPath = (musicPath) =>({
    type:LIBRARY_DELETE_MUSIC_PATH_START,
    musicPath
})

export const deleteMusicPathSucc = (response, musicPath) =>({
    type:LIBRARY_DELETE_MUSIC_PATH_SUCCESS,
    response,
    musicPath
})

export const searchByKey = (searchKey) => ({
    type: LIBRARY_SEARCH_BY_KEY_START,
    searchKey
})

export const searchByKeySucc = (response) => ({
    type: LIBRARY_SEARCH_BY_KEY_SUCCESS,
    response
})

export const fetchBuildStatus = () => ({
    type: LIBRARY_FETCH_BUILD_STATUS_START
})

export const fetchBuildStatusSucc = (response) => ({
    type: LIBRARY_FETCH_BUILD_STATUS_SUCCESS,
    response
})

export const fetchMostPlayedData = () => ({
    type: LIBRARY_FETCH_MOST_PLAYED_DATA_START
})

export const fetchMostPlayedDataSucc = (response) => ({
    type: LIBRARY_FETCH_MOST_PLAYED_DATA_SUCCESS,
    response
})

export const initiArtistImageDownload = (downloadOption) => ({
    type: LIBRARY_INIT_ARTIST_IMG_DOWNLOAD_START,
    downloadOption
})

export const initiArtistImageDownloadSucc = (response) => ({
    type: LIBRARY_INIT_ARTIST_IMG_DOWNLOAD_SUCCESS,
    response
})

export const editTrackInfo = (payload, objType) => ({
    type: LIBRARY_EDIT_TRACK_INFO_START,
    payload,
    objType
})

export const editTrackInfoSucc = (field, track) => ({
    type: LIBRARY_EDIT_TRACK_INFO_SUCCESS,
    field,
    track
})

export const editAlbumInfo = (payload) => ({
    type: LIBRARY_EDIT_ALBUM_INFO_START,
    payload
})

export const editAlbumInfoSucc = (responseAlbum) => ({
    type: LIBRARY_EDIT_ALBUM_INFO_SUCCESS,
    responseAlbum
})

//History Start
export const fetchAllHistory = (isSetPlayerTracks) => ({
    type: HISTORY_FETCH_ALL_HISTORY_START,
    isSetPlayerTracks
})

export const fetchAllHistorySucc = (response) => ({
    type: HISTORY_FETCH_ALL_HISTORY_SUCCESS,
    response
})

export const updateHistory = (songId) => ({
    type: HISTORY_UPDATE_HISTORY_START,
    songId
})

export const updateHistorySucc = (response) => ({
    type: HISTORY_UPDATE_HISTORY_SUCCESS,
    response
})

//History End

export const fetchMessagesByType = (messageType) => ({
    type: MESSAGE_FETCH_BY_TYPE_START,
    messageType
})

export const fetchMessagesByTypeSucc = (response) => ({
    type: MESSAGE_FETCH_BY_TYPE_SUCCESS,
    response
})

export const setArtistImageDownloadSummary = (artistImageDownloadSummary) =>({
    type: SET_ARTIST_IMGAE_DOWNLOAD_SUMMARY,
    artistImageDownloadSummary
})

export const setShowContextMenu = (showContextMenu) => ({
    type: SET_SHOW_CONTEXT_MENU,
    showContextMenu
})

export const setIsClickedOnCM = (isclickedOnCM) => ({
    type: SET_IS_CLICKED_ON_CONTEXT_MENU,
    isclickedOnCM
})

export const setContextObj = (contextObj) => ({
    type: SET_CONTEXT_OBJECT,
    contextObj
})

export const setCommonPopupObj = (commonPopupObj) => ({
    type: SET_COMMON_POPUP_OBJ,
    commonPopupObj
})

export const setShowPlaylistSelector = (showPlaylistSelector) => ({
    type: SET_SHOW_PLAY_LIST_SELECTOR,
    showPlaylistSelector
})

export const setCurrentPage = (currentPage) => ({
    type: SET_CURRENT_PAGE,
    currentPage
})

export const setStatusMessage = (statusMessage) => ({
    type: SET_STATUS_MESSAGE,
    statusMessage
})

export const setMetadataPopupObj = (metadataPopupObj) => ({
    type: SET_METADATA_POPUP_OBJ,
    metadataPopupObj
})

export const setGlobalFilterText = (globalFilterText) => ({
    type: SET_GLOBAL_FILTER_TEXT,
    globalFilterText
})

export const setShowTrackCheckBox = (showTrackCheckBox) => ({
    type: SET_SHOW_TRACK_CHECKBOX,
    showTrackCheckBox:!showTrackCheckBox
})

export const setCheckedTracks = (songId, action) => ({
    type: SET_CHECKED_TRACK,
    songId,
    action
})

export const filterMusicPath = (response, musicPath,musicPaths) => {
    if(response.status===SUCCESS){
        musicPaths = musicPaths.filter(mPath => {return mPath.messageId!==musicPath.messageId});
    }
    return musicPaths;
}

export const getPlayerTracks = (library, trackListName, playerTracks) => {
    let tempPTracks;
    if(!playerTracks){
        if(trackListName === 'historyTracks'){
            tempPTracks = library['history'].songs;
        }else{
            tempPTracks = library[trackListName];
        }
        if(tempPTracks && trackListName !== 'tracks' && trackListName !== 'trackIds'){
            tempPTracks = tempPTracks.map((track) => { return track.songId});
        }
    }else{
        tempPTracks = playerTracks;
        if(tempPTracks.length > 0 && tempPTracks[0].songId){
            tempPTracks = tempPTracks.map((track) => { return track.songId});
        }
    }
    return tempPTracks;
}

export const updateArtistsDetails = (artistsDetails, artistObj) => {
    artistsDetails.forEach((artist, i) => {
        if(artistObj.artistId === artist.artistId){
            artistsDetails[i] = artistObj; 
        }
    });
    return artistsDetails;
}

export const updateTracksPostEditTrack = (state, track, field) => {
    const tracks = state[field];
    tracks.forEach((elem,i) =>{
        if(elem.songId === track.songId){
            tracks[i] = track;
        }
    });
    return tracks;
}

export const getCheckedTracks = (checkedTracks, songId, action) => {
    if(action===ADD)
        return [...checkedTracks, songId]
    else if(action===REMOVE)
        return checkedTracks.filter(ct=>ct!==songId);
    else if(action===REMOVE_ALL)return []
    else return checkedTracks;
}