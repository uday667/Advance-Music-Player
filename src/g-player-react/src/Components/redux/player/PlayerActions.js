import { PLAYER_CURRENT_SONG_AND_STATUS_START, PLAYER_CURRENT_SONG_AND_STATUS_SUCCESS, 
        PLAYER_CURRENT_SONG_STATUS_START, PLAYER_CURRENT_SONG_STATUS_SUCCESS, PLAYER_DELETE_LYRICS_START, PLAYER_DELETE_LYRICS_SUCCESS, PLAYER_PLAY_A_SONG_START, 
        PLAYER_PLAY_A_SONG_SUCCESS, PLAYER_PLAY_PAUSE_START, PLAYER_PLAY_PAUSE_SUCCESS, 
        PLAYER_SET_MEDIA_VOLUME_START, PLAYER_SET_MEDIA_VOLUME_SUCCESS, PLAYER_SET_PB_LENGTH_START, 
        PLAYER_SET_PB_LENGTH_SUCCESS, PLAYER_UPDATE_LYRICS_START, PLAYER_UPDATE_LYRICS_SUCCESS, 
        SET_PLAYER_ISPLAYING, SET_PLAYER_ISREPEAT, SET_PLAYER_ISSHUFFLE, SET_PLAYER_PLAYED_FROM 
    } from "./PlayerActionTypes";

export const setIsPlaying = (isPlaying) => ({
    type: SET_PLAYER_ISPLAYING,
    isPlaying
})

export const playPause = (songPlaying, playedFrom, currentVolume, currentPlayTime) => ({
    type: PLAYER_PLAY_PAUSE_START,
    songPlaying,
    playedFrom,
    currentVolume,
    currentPlayTime
})

export const playPauseSucc = (response) => ({
    type: PLAYER_PLAY_PAUSE_SUCCESS,
    response
})

export const playASong = (songId, playedFrom, currentVolume, currentPlayTime) => ({
    type: PLAYER_PLAY_A_SONG_START,
    songId,
    playedFrom,
    currentVolume,
    currentPlayTime
})

export const playASongSucc = (response,playedFrom) => ({
    type: PLAYER_PLAY_A_SONG_SUCCESS,
    response,
    playedFrom
})

export const fettchCurrentSongStatus = () => ({
    type: PLAYER_CURRENT_SONG_STATUS_START
})

export const fettchCurrentSongStatusSucc = (response) => ({
    type: PLAYER_CURRENT_SONG_STATUS_SUCCESS,
    playingSongStat:response.gMedia,
    isPlaying:response.status==="PLAYING"?true:false
})

export const setMediaVolume = (volume) => ({
    type: PLAYER_SET_MEDIA_VOLUME_START,
    volume
})

export const setMediaVolumeSucc = (playingSongStat) => ({
    type: PLAYER_SET_MEDIA_VOLUME_SUCCESS,
    playingSongStat
})

export const setPlayBackLength = (pbVal) => ({
    type: PLAYER_SET_PB_LENGTH_START,
    pbVal
})

export const setPlayBackLengthSucc = (playingSongStat) => ({
    type: PLAYER_SET_PB_LENGTH_SUCCESS,
    playingSongStat
})

export const setPlayedFrom = (playedFrom) => ({
    type: SET_PLAYER_PLAYED_FROM,
    playedFrom
})

export const fetchCurrentSontAndStatus = () => ({
    type: PLAYER_CURRENT_SONG_AND_STATUS_START
})

export const fetchCurrentSontAndStatusSucc = (response) => ({
    type: PLAYER_CURRENT_SONG_AND_STATUS_SUCCESS,
    response
})

export const setRepeat = (repeat) => ({
    type: SET_PLAYER_ISREPEAT,
    repeat
})

export const setIsShuffle = (isShuffle) => ({
    type: SET_PLAYER_ISSHUFFLE,
    isShuffle
})

export const updateLyrics = (songId, lyrics) => ({
    type: PLAYER_UPDATE_LYRICS_START,
    songId,
    lyrics
})

export const updateLyricsSucc = (response) => ({
    type: PLAYER_UPDATE_LYRICS_SUCCESS,
    response
})

export const deleteLyrics = (songId) => ({
    type: PLAYER_DELETE_LYRICS_START,
    songId
})

export const deleteLyricsSucc = (response) => ({
    type: PLAYER_DELETE_LYRICS_SUCCESS,
    response
})