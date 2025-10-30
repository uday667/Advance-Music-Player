import axios from "axios";

//const baseURL = 'http://gplayer.test.com:8080';
const baseURL = 'http://localhost:8085';
const iAxios = axios.create({
    baseURL:baseURL,
    headers:{
        'Content-Type':'application/json'
    },
    timeout:120000
});

export const getAllSongsAPI = () =>{
    return iAxios.get('/library/songs-and-ids').then(response => response);
}

export const fetchAlbumtracksAPI = (albumName, language) => {
    if(language){
        return iAxios.get(`/library/songs/album-name/${albumName}/language/${language}`).then(response => response);
    }else{
        return iAxios.get(`/library/songs/album-name/${albumName}`).then(response => response);
    }
}

export const fetchSongsByArtistAPI = (artist) => {
    return iAxios.get(`/library/songs/artist/${artist}`).then(response => response);
}

export const fetchAlbumAPI = (albumName) => {
    return iAxios.get(`/library/album/album-name/${albumName}`).then(response => response);
}

export const fetchAllAlbumsAPI = () => {
    return iAxios.get('/library/albums').then(response => response);
}

export const fetchalbumListOfAAAPI = (albumArtist) => {
    return iAxios.get(`/library/albums/album-artist/${albumArtist}`).then(response => response);
}

export const fetchAllArtistsDtlsAPI = (artistType) => {
    return iAxios.get(`/library/artists/type/${artistType}`).then(response => response);
}

export const fetchSongsByGenreAPI = (genre) => {
    return iAxios.get(`/library/songs/genre/${genre}`).then(response => response);
}

export const fetchSongsByLanguageAPI = (language) => {
    return iAxios.get(`/library/songs/language/${language}`).then(response => response);
}

export const updateLyricsAPI = (songId, lyrics) => {
    return iAxios.put(`/library/song/lyrics/id/${songId}`,lyrics).then(response => response);
}

export const deleteLyricsAPI = (songId) => {
    return iAxios.delete(`/library/song/lyrics/id/${songId}`).then(response => response);
}

export const fetchAlbumsByGenreAPI = (genre) => {
    return iAxios.get(`/library/albums/genre/${genre}`).then(response => response);
}

export const fetchGenreDetailsAPI = () => {
    return iAxios.get(`/library/genre-details`).then(response => response);
}

export const fetchLanguageDetailsAPI = () => {
    return iAxios.get(`/library/language-details`).then(response => response);
}

export const initiateArtistImageDownload = (downloadOption) => {
    return iAxios.get(`/library/artists/download-artist-images/${downloadOption}`).then(response => response);
}

export const uploadArtistImgAPI = (artistId,data) => {
    return iAxios.put(`/library/upload-artist-image/${artistId}`,data
    // , {
    //     headers:{
    //     'Content-Type': 'multipart/form-data',
    //     'Content-Disposition': 'form-data; name="file"'
    //     }
    // }
    ).then(response => response);
}

export const fetchAllAlbumDtlsAPI = () => {//Not used anymore
    return iAxios.get('/library/getAllAlbumDetails').then(response => response);
}

export const fetchAlbumImgsAPI = () => {//Not used anymore
    return iAxios.get('/library/getAlbumImgs').then(response => response);
}

//Sidebar library
export const initLibraryBuildAPI = (isTakePlBkp) => {
    return iAxios.post(`/library/build-library`, JSON.stringify({isTakePlBkp})).then(response => response);
}

export const initDeltaLibraryBuildAPI = () => {
    return iAxios.get(`/library/build-init-delta-library`).then(response => response);
}

export const searchByKeyAPI = (searchKey) => {
    return iAxios.get(`/library/search/key/${searchKey}`).then(response => response);
}

export const saveMusicpathAPI = (musicpath) => {
    return iAxios.post(`/message/save-music-path`,musicpath).then(response => response);
}

export const fetchMusicpathAPI = () => {
    return iAxios.get(`/message/music-paths`).then(response => response);
}

export const deleteMusicPathAPI = (messageId) => {
    return iAxios.delete(`/message/remove-music-path/${messageId}`, ).then(response => response);
}

export const fetchBuildStatusAPI = () => {
    return iAxios.get(`/message/build-status`).then(response => response);
}

//Media
export const playPauseAPI = () => {
    return iAxios.get('/media/play-pause').then(response => response);
}

export const playASongAPI = (songId, currentVolume, currentPlayTime) => {
    if(currentVolume===undefined)currentVolume=0.5;
    let uri = `/media/play-song/${songId}`;
    if(currentPlayTime!==undefined){
        uri+=`?currentPlayTime=${currentPlayTime*1000}`;
    }else{
        uri+=`?currentPlayTime=`
    }
    return iAxios.put(uri,currentVolume).then(response => response);
}

export const getCurrentSongStatusAPI = () => {
    return iAxios.get(`/media/current-song-status`).then(response => response);
}

export const getCurrentSongAndStatusAPI = () => {
    return iAxios.get(`/media/current-song-and-status`).then(response => response);
}

export const setMediaVolumeAPI = (volume) => {
    return iAxios.get(`/media/volume/${volume}`).then(response => response);
}

export const setPlaybackLengthAPI = (pbVal) => {
    return iAxios.get(`/media/forward/${pbVal}`).then(response => response);
}

//History Start
export const fetchAllHistoryAPI = () => {
    return iAxios.get(`/history/all-grouped-history`).then(response => response);
}

export const updateHistoryAPI = (songId) => {
    return iAxios.put(`/history/add-to-history/${songId}`).then(response => response);
}

export const fetchMostPlayedDataAPI = () => {
    return iAxios.get(`/history/most-played-data`).then(response => response);
}
//History End

//Playlist - Start

export const fetchPlaylistNamesAPI = () => {
    return iAxios.get(`/playlist/`).then(response => response);
}

export const fetchSongsInPlaylistAPI = (playListId) => {
    return iAxios.get(`/playlist/${playListId}/songs`).then(response => response);
}

export const addToPlaylistAPI = (reqPLObj) => {
    return iAxios.post(`/playlist/add-to-playlist/`,reqPLObj).then(response => response);
}

export const removeFromPlaylistAPI = (playlistId, songId) => {
    return iAxios.delete(`/playlist/remove-from-playlist/${playlistId}/${songId}`).then(response => response);
}

export const createPlaylistAPI = (playlist) => {
    return iAxios.post(`/playlist/${playlist.name}`).then(response => response);
}

export const deletePlaylistAPI = (playlistId) => {
    return iAxios.delete(`/playlist/${playlistId}`).then(response => response);
}

export const renamePlaylistAPI = (playlist) => {
    return iAxios.put(`/playlist/`,playlist).then(response => response);
}

export const exportPlaylistsAPI = () => {
    return iAxios.put(`/playlist/export`).then(response => response);
}

export const importPlaylistsAPI = (payload, fileType) => {
    return iAxios.post(`/playlist/import/${fileType}`, JSON.stringify(payload)).then(response => response);
}

export const fetchAssignedPlaylistsAPI = (payload) => {
    return iAxios.get(`/playlist/playlists/${payload.objType}/identifier/${payload.identifier}`).then(response => response);
}
//Playlist - End

//Edit metadata - start
export const editTrackInfoAPI = (payload, onbType) => {
    return iAxios.post(`/library/edit-track-info/${onbType}`, payload).then(response => response);
}

export const editAlbumInfoAPI = (payload) => {
    return iAxios.post(`/library/edit-album-info`, payload).then(response => response);
}
//Edit metadata - end

export const getMessagesByType = (messageType) => {
    return iAxios.get(`/message/type/${messageType}`).then(response => response);
}