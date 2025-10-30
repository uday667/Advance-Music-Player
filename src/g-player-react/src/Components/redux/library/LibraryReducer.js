import { INIT, LOADING, SUCCESS, TRACK_LIST } from "../GPActionTypes";
import { filterMusicPath, getCheckedTracks, getPlayerTracks, updateArtistsDetails, updateTracksPostEditTrack } from "./LibraryActions";
import { 
    FETCH_SONGS_START, FETCH_SONGS_SUCCESS,
     HISTORY_FETCH_ALL_HISTORY_START, HISTORY_FETCH_ALL_HISTORY_SUCCESS, 
     LIBRARY_DELETE_MUSIC_PATH_START, LIBRARY_DELETE_MUSIC_PATH_SUCCESS, 
     LIBRARY_EDIT_ALBUM_INFO_START, LIBRARY_EDIT_ALBUM_INFO_SUCCESS,
     LIBRARY_EDIT_TRACK_INFO_START, LIBRARY_EDIT_TRACK_INFO_SUCCESS, 
     LIBRARY_FETCH_ALBUMS_BY_GENRE_START, LIBRARY_FETCH_ALBUMS_BY_GENRE_SUCCESS, 
     LIBRARY_FETCH_ALBUMS_DETAILS_START, LIBRARY_FETCH_ALBUMS_DETAILS_SUCCESS, 
     LIBRARY_FETCH_ALBUMS_START, LIBRARY_FETCH_ALBUMS_SUCCESS, 
     LIBRARY_FETCH_ALBUM_ARTIST_LIST_START, LIBRARY_FETCH_ALBUM_ARTIST_LIST_SUCCESS, 
     LIBRARY_FETCH_ALBUM_DETAILS_BY_ALBUM_ARTIST_START, LIBRARY_FETCH_ALBUM_DETAILS_BY_ALBUM_ARTIST_SUCCESS, 
     LIBRARY_FETCH_ALBUM_IMGS_START, LIBRARY_FETCH_ALBUM_IMGS_SUCCESS, 
     LIBRARY_FETCH_ALBUM_LIST_OF_AA_START, LIBRARY_FETCH_ALBUM_LIST_OF_AA_SUCCESS, 
     LIBRARY_FETCH_ALBUM_START, LIBRARY_FETCH_ALBUM_SUCCESS, 
     LIBRARY_FETCH_ALBUM_TRACKS_START, LIBRARY_FETCH_ALBUM_TRACKS_SUCCESS, 
     LIBRARY_FETCH_ARTIST_LIST_START, LIBRARY_FETCH_ARTIST_LIST_SUCCESS, 
     LIBRARY_FETCH_BUILD_STATUS_START, LIBRARY_FETCH_BUILD_STATUS_SUCCESS, 
     LIBRARY_FETCH_GENRE_DETAILS_START, LIBRARY_FETCH_GENRE_DETAILS_SUCCESS, 
     LIBRARY_FETCH_LANGUAGE_DETAILS_START, LIBRARY_FETCH_LANGUAGE_DETAILS_SUCCESS, 
     LIBRARY_FETCH_MOST_PLAYED_DATA_START, LIBRARY_FETCH_MOST_PLAYED_DATA_SUCCESS, 
     LIBRARY_FETCH_MUSIC_PATH_START, LIBRARY_FETCH_MUSIC_PATH_SUCCESS, 
     LIBRARY_FETCH_SONGS_BY_ARTIST_START, LIBRARY_FETCH_SONGS_BY_ARTIST_SUCCESS, 
     LIBRARY_FETCH_SONGS_BY_GENRE_START, LIBRARY_FETCH_SONGS_BY_GENRE_SUCCESS, 
     LIBRARY_FETCH_SONGS_BY_LANGUAGE_START, LIBRARY_FETCH_SONGS_BY_LANGUAGE_SUCCESS, 
     LIBRARY_INIT_BUILD_DELTA_LIBRARY_START, LIBRARY_INIT_BUILD_DELTA_LIBRARY_SUCESS, 
     LIBRARY_INIT_BUILD_LIBRARY_START, LIBRARY_INIT_BUILD_LIBRARY_SUCESS, 
     LIBRARY_SAVE_MUSIC_PATH_START, LIBRARY_SAVE_MUSIC_PATH_SUCCESS, 
     LIBRARY_SEARCH_BY_KEY_START, LIBRARY_SEARCH_BY_KEY_SUCCESS, 
     LIBRARY_UPLOAD_ARTIST_IMG_START, LIBRARY_UPLOAD_ARTIST_IMG_SUCCESS, 
     SET_ARTIST_IMGAE_DOWNLOAD_SUMMARY, SET_CHECKED_TRACK, SET_COMMON_POPUP_OBJ, SET_CONTEXT_OBJECT, SET_CURRENT_PAGE, 
     SET_GLOBAL_FILTER_TEXT, SET_GROUP_BAND, SET_IS_CLICKED_ON_CONTEXT_MENU, SET_METADATA_POPUP_OBJ, SET_PLAYER_TRACKS, 
     SET_PLAYLIST_SONGS, SET_SHOW_CONTEXT_MENU, SET_SHOW_PLAY_LIST_SELECTOR, SET_SHOW_TRACK_CHECKBOX, SET_STATUS_MESSAGE 
} from "./LibraryActionTypes";

export const initialState = {
    tracks:[],
    trackIds:[],
    tracksHistory:[],
    albumTracks:[],
    album:{},
    albums : [],
    albumImgs: null,
    albumsDetails:[],
    albumListOfAA:[],
    artistsDetails:[],
    artistTracks:[],
    playerTracks: [],
    playlistSongs: [],
    albumArtistsDetails:[],
    genreDetails: {},
    genreSongList:[],
    languageDetails: {},
    languageSongList:[],
    musicPaths:[],
    searchResult:{},
    history:[],
    buildStatus:[],
    mostPlayedData: {},
    groupBand:"",
    contextObj:{},
    showContextMenu:false,
    showPlaylistSelector:false,
    isclickedOnCM:true,
    commonPopupObj:{},
    currentPage: {type: TRACK_LIST},
    statusMessage:"",
    metadataPopupObj: {},
    artistImageDownloadSummary:[],
    globalFilterText:"",
    showTrackCheckBox:false,
    checkedTracks:[],
    phase:INIT
}

const libraryReducer = (state = initialState, action) => {
    switch(action.type){
        case LIBRARY_INIT_BUILD_LIBRARY_START:
            return{
                ...state,
                phase: LOADING
            }
        case LIBRARY_INIT_BUILD_LIBRARY_SUCESS:
            return{
                ...state,
                buildStatus: action.response,
                phase: LIBRARY_INIT_BUILD_LIBRARY_SUCESS
            }
        case FETCH_SONGS_START:
            return{
                ...state,
                phase: LOADING
            }
        case FETCH_SONGS_SUCCESS:
            return{
                ...state,
                tracks:action.tracks.SONGS.filter((track=>track.title!==null)),
                trackIds:action.tracks.SONG_IDS,
                tracksHistory: action.tracks.HISTORY,
                phase:FETCH_SONGS_SUCCESS
            }
        case LIBRARY_FETCH_ALBUMS_START:
            return{
                ...state,
                phase: LOADING
            }
        case LIBRARY_FETCH_ALBUMS_SUCCESS:
            return{
                ...state,
                albums:action.albums,
                phase:SUCCESS
            }
        case LIBRARY_FETCH_ALBUMS_DETAILS_START:
            return{
                ...state,
                phase: LOADING
            }
        case LIBRARY_FETCH_ALBUMS_DETAILS_SUCCESS:
            return{
                ...state,
                albumsDetails:action.albumsDetails,
                phase:SUCCESS
            }
        case LIBRARY_FETCH_ALBUM_IMGS_START:
            return{
                ...state,
                phase: LOADING
            }
        case LIBRARY_FETCH_ALBUM_IMGS_SUCCESS:
            return{
                ...state,
                albumImgs:action.albumImgs,
                phase:SUCCESS
            }
        case LIBRARY_FETCH_ALBUM_TRACKS_START:
            return{
                ...state,
                phase: LOADING
            }
        case LIBRARY_FETCH_ALBUM_TRACKS_SUCCESS:
            return{
                ...state,
                albumTracks:action.albumTracks,
                phase:LIBRARY_FETCH_ALBUM_TRACKS_SUCCESS
            }
        case LIBRARY_FETCH_ALBUM_START:
            return{
                ...state,
                phase: LOADING
            }
        case LIBRARY_FETCH_ALBUM_SUCCESS:
            return{
                ...state,
                album:action.album,
                phase:LIBRARY_FETCH_ALBUM_SUCCESS
            }
        case SET_GROUP_BAND:
            return{
                ...state,
                groupBand: action.groupBand,
                phase:SUCCESS
            }
            case LIBRARY_FETCH_ARTIST_LIST_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_FETCH_ARTIST_LIST_SUCCESS:
                return{
                    ...state,
                    artistsDetails:action.artistsDetails,
                    //artistsImgsDetails:action.artistsImgsDetails,
                    phase:SUCCESS
                }
            case LIBRARY_FETCH_SONGS_BY_ARTIST_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_FETCH_SONGS_BY_ARTIST_SUCCESS:
                return{
                    ...state,
                    artistTracks:action.artistTracks,
                    phase:LIBRARY_FETCH_SONGS_BY_ARTIST_SUCCESS
                }
            case LIBRARY_FETCH_ALBUM_ARTIST_LIST_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_FETCH_ALBUM_ARTIST_LIST_SUCCESS:
                return{
                    ...state,
                    albumArtistsDetails:action.albumArtistsDetails,
                    //albumArtistsImgsDetails:action.albumArtistsImgsDetails,
                    phase:SUCCESS
                }
            case LIBRARY_FETCH_ALBUM_LIST_OF_AA_START:
                return{
                    ...state,
                    phase: LOADING

                }
            case LIBRARY_FETCH_ALBUM_LIST_OF_AA_SUCCESS:
                return{
                    ...state,
                    albumListOfAA: action.albumListOfAA,
                    phase:SUCCESS
                }
            case LIBRARY_UPLOAD_ARTIST_IMG_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_UPLOAD_ARTIST_IMG_SUCCESS:
                return{
                    ...state,
                    artistsDetails: updateArtistsDetails([...state.artistsDetails], action.artistObj),
                    phase: LIBRARY_UPLOAD_ARTIST_IMG_SUCCESS
                }
            case LIBRARY_FETCH_GENRE_DETAILS_START:
                return{
                    ...state,
                    phase:LOADING
                }
            case LIBRARY_FETCH_GENRE_DETAILS_SUCCESS:
                return{
                    ...state,
                    genreDetails: action.genreDetails,
                    phase: SUCCESS
                }
            case LIBRARY_FETCH_SONGS_BY_GENRE_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_FETCH_SONGS_BY_GENRE_SUCCESS:
                return{
                    ...state,
                    genreSongList: action.genreSongList,
                    phase: LIBRARY_FETCH_SONGS_BY_GENRE_SUCCESS
                }
            
            case LIBRARY_FETCH_LANGUAGE_DETAILS_START:
                return{
                    ...state,
                    phase:LOADING
                }
            case LIBRARY_FETCH_LANGUAGE_DETAILS_SUCCESS:
                return{
                    ...state,
                    languageDetails: action.languageDetails,
                    phase: SUCCESS
                }
            case LIBRARY_FETCH_SONGS_BY_LANGUAGE_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_FETCH_SONGS_BY_LANGUAGE_SUCCESS:
                return{
                    ...state,
                    languageSongList: action.languageSongList,
                    phase: LIBRARY_FETCH_SONGS_BY_LANGUAGE_SUCCESS
                }
            case LIBRARY_SAVE_MUSIC_PATH_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_SAVE_MUSIC_PATH_SUCCESS:
                return{
                    ...state,
                    musicPaths: [...state.musicPaths, action.response],
                    phase:LIBRARY_SAVE_MUSIC_PATH_SUCCESS
                }
            case LIBRARY_FETCH_MUSIC_PATH_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_FETCH_MUSIC_PATH_SUCCESS:
                return{
                    ...state,
                    musicPaths: action.response,
                    phase:SUCCESS
                }
            case LIBRARY_DELETE_MUSIC_PATH_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_DELETE_MUSIC_PATH_SUCCESS:
                return{
                    ...state,
                    musicPaths: filterMusicPath(action.response, action.musicPath, [...state.musicPaths]),
                    phase:SUCCESS
                }
            case LIBRARY_SEARCH_BY_KEY_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_SEARCH_BY_KEY_SUCCESS:
                return{
                    ...state,
                    searchResult: action.response,
                    phase:SUCCESS
                }
            case HISTORY_FETCH_ALL_HISTORY_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case HISTORY_FETCH_ALL_HISTORY_SUCCESS:
                return{
                    ...state,
                    history: action.response,
                    phase:HISTORY_FETCH_ALL_HISTORY_SUCCESS
                }
            case LIBRARY_FETCH_BUILD_STATUS_START:
                    return{
                        ...state,
                        phase: LOADING
                    }
            case LIBRARY_FETCH_BUILD_STATUS_SUCCESS:
                    return{
                        ...state,
                        buildStatus: action.response,
                        phase:SUCCESS
                    }
            case LIBRARY_FETCH_MOST_PLAYED_DATA_START:
                    return{
                        ...state,
                        phase: LOADING
                    }
            case LIBRARY_FETCH_MOST_PLAYED_DATA_SUCCESS:
                    return{
                        ...state,
                        mostPlayedData: action.response,
                        phase:SUCCESS
                    }
            case LIBRARY_FETCH_ALBUMS_BY_GENRE_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_FETCH_ALBUMS_BY_GENRE_SUCCESS:
                return{
                    ...state,
                    genreDetails: {...state.genreDetails, ALBUMS_BY_GENRE:action.response},
                    phase: SUCCESS
                }
            case SET_SHOW_CONTEXT_MENU:
                return{
                    ...state,
                    showContextMenu: action.showContextMenu
                }
                
            case SET_CONTEXT_OBJECT:
                return{
                    ...state,
                    contextObj: action.contextObj
                }
            case SET_SHOW_PLAY_LIST_SELECTOR:
                return{
                    ...state,
                    showPlaylistSelector: action.showPlaylistSelector
                }
            case SET_IS_CLICKED_ON_CONTEXT_MENU:
                return{
                    ...state,
                    isclickedOnCM: action.isclickedOnCM
                }
            case SET_COMMON_POPUP_OBJ:
                return{
                    ...state,
                    commonPopupObj: action.commonPopupObj
                }
            case SET_CURRENT_PAGE:
                return{
                    ...state,
                    currentPage: action.currentPage
                }
            case SET_STATUS_MESSAGE:
                return{
                    ...state,
                    statusMessage: action.statusMessage
                }
            case SET_PLAYER_TRACKS:
                return{
                    ...state,
                    playerTracks: getPlayerTracks({...state}, action.trackListName, action.playerTracks)
                }
            case SET_PLAYLIST_SONGS:
                return{
                    ...state,
                    playlistSongs: action.playlistSongs
                }
            case SET_METADATA_POPUP_OBJ:
                return{
                    ...state,
                    metadataPopupObj: action.metadataPopupObj
                }
            case LIBRARY_EDIT_TRACK_INFO_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_EDIT_TRACK_INFO_SUCCESS:
                return{
                    ...state,
                    phase:LIBRARY_EDIT_TRACK_INFO_SUCCESS,
                    [action.field]: updateTracksPostEditTrack({...state}, action.track, action.field)
                }
            case LIBRARY_EDIT_ALBUM_INFO_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_EDIT_ALBUM_INFO_SUCCESS:
                return{
                    ...state,
                    phase:LIBRARY_EDIT_ALBUM_INFO_SUCCESS,
                    album: action.responseAlbum,
                    albumTracks:action.responseAlbum.albumTracks
                }
            case LIBRARY_INIT_BUILD_DELTA_LIBRARY_START:
                return{
                    ...state,
                    phase: LOADING
                }
            case LIBRARY_INIT_BUILD_DELTA_LIBRARY_SUCESS:
                return{
                    ...state,
                    buildStatus:action.response.response,
                    phase:LIBRARY_INIT_BUILD_DELTA_LIBRARY_SUCESS
                }
            case SET_ARTIST_IMGAE_DOWNLOAD_SUMMARY:
                return{
                    ...state,
                    artistImageDownloadSummary: action.artistImageDownloadSummary
                }
            case SET_GLOBAL_FILTER_TEXT:
                return{
                    ...state,
                    globalFilterText: action.globalFilterText
                }
            case SET_SHOW_TRACK_CHECKBOX:
                return{
                    ...state,
                    showTrackCheckBox: action.showTrackCheckBox
                }
            case SET_CHECKED_TRACK:
                return{
                    ...state,
                    checkedTracks:getCheckedTracks([...state.checkedTracks],action.songId, action.action)
                }
        default:
            return {
                ...state,
                //phase:INIT
            }
    }
}

export default libraryReducer;