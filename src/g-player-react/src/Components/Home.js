import React, { useEffect } from "react";
import { Player } from "./player/Player";
import { Sidebar } from "./Sidebar";
import { Screen } from "./screen/Screen";
import { useDispatch, useSelector } from "react-redux";
import { fetchAlbumTacks, fetchAllHistory, fetchAllSongs, fetchSongsByArtist, fetchSongsByGenre, fetchSongsByLanguage, 
    setCheckedTracks, setShowTrackCheckBox } from "./redux/library/LibraryActions";
import { fetchCurrentSontAndStatus, playASongSucc, setIsShuffle, setMediaVolumeSucc, setRepeat } from "./redux/player/PlayerActions";
import { getCookieDetails, setCookies } from "./utilities/util";
import { ALBUM, ARTIST, GENRE, LANGUAGE, MAIN_CONTAINER, PLAYLIST, RECENT_PLAYS, REMOVE_ALL, TRACK_LIST } from "./redux/GPActionTypes";
import { Route, Routes, useLocation } from "react-router-dom";
import { Library } from "./library/LibraryV2";
import { Search } from "./search/Search";
import { RecentPlays } from "./history/RecentPlays";
import { Playlist } from "./playlist/Playlist";
import { fetchPlaylistNames, fetchSongsInPlaylist } from "./redux/playlist/PlaylistActions";
import { PlaylistSelector } from "./playlist/PlayllistSelector";
import { CommonPopup } from "./CommnPopup";
import { GPContexMenu } from "./screen/GPContextMenu";
import { StatusMessage } from "./screen/StatusMessage";
import { MetadataPopup } from "./screen/metadata/MetadataPopup";
import { useCookies } from "react-cookie";

export const Home = () => {
    const dispatch = useDispatch();
    const [cookies] = useCookies();
    
    const showContextMenu = useSelector(state => state.library.showContextMenu);
    const showPlaylistSelector = useSelector(state => state.library.showPlaylistSelector);
    const showMetadataPopup = useSelector(state => state.library.metadataPopupObj.showMetadataPopup);

    useEffect(()=>{
        dispatch(fetchPlaylistNames());
        //dispatch(fetchAllAlbums());
        getSetCookieDetails(); // reads cookie value and store the required values in reducer
        fetchTracks();
    },[]);

    const getSetCookieDetails = () =>{
        const cookieDetails = getCookieDetails();
        if(cookieDetails["repeat"]!==undefined){
            dispatch(setRepeat(cookieDetails["repeat"]));
        }
        if(cookieDetails["isShuffle"]!==undefined){
            dispatch(setIsShuffle(cookieDetails["isShuffle"]==='true'));
        }
        if(cookieDetails["songPlaying"]!==undefined){
            const response={library: atob(JSON.parse(cookieDetails["songPlaying"]))};
            dispatch(playASongSucc(response,cookieDetails["playedFrom"]!==undefined?cookieDetails["playedFrom"]:TRACK_LIST));
        }else{
            dispatch(fetchCurrentSontAndStatus());
        }
        if(cookieDetails["currentVolume"]!==undefined){
            dispatch(setMediaVolumeSucc({currentVolume:cookieDetails["currentVolume"]}));
        }else{
            setCookies("currentVolume",0.6);
        }
    }

    const fetchTracks = () => {
        let playedFrom = cookies.playedFrom;
        switch (playedFrom?.pfKey) {
            case ALBUM:
                dispatch(fetchAlbumTacks(playedFrom.pfVal, undefined, true)); // sending true will set tracks to playertracks
                break;
            case ARTIST:
                dispatch(fetchSongsByArtist(playedFrom.pfVal,true));
                break;
            case RECENT_PLAYS:
                dispatch(fetchAllHistory(true));
                break;
            case PLAYLIST:
                dispatch(fetchSongsInPlaylist(playedFrom.pfVal,true));
                break;
            case GENRE:
                dispatch(fetchSongsByGenre(playedFrom.pfVal,true));
                break;
            case LANGUAGE:
                dispatch(fetchSongsByLanguage(playedFrom.pfVal,true));
                break;
            default:
                dispatch(fetchAllSongs(true));
                break;
        }
    }

    const locationL = useLocation();

    useEffect(()=>{
        dispatch(setCheckedTracks(undefined, REMOVE_ALL));
        dispatch(setShowTrackCheckBox(true));
    },[locationL])

    return(
        <div className="main-container" id={MAIN_CONTAINER}>
            <Sidebar />
            <Routes>
                <Route path="/music/*" element={<Screen/>} />
                <Route path="/search/:searchKey" element={<Search/>} />
                <Route path="/recent" element={<RecentPlays />} />
                <Route path="/library/*" element={<Library/>} />
                <Route path="/playlist/*" element={<Playlist/>} />
                <Route path="/*" element={<Screen/>} />
            </Routes>
            <Player />
            {showContextMenu && <GPContexMenu />}
            {showPlaylistSelector && <PlaylistSelector />}
            <CommonPopup />
            <StatusMessage />
            {showMetadataPopup && <MetadataPopup />}
        </div>
    );
}