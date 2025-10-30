import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPlaylistNames, fetchSongsInPlaylist } from "../redux/playlist/PlaylistActions";
import { TrackList } from "../screen/track/TrackList";
import { CURRENT_PAGE, PLAYLIST, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_YEAR, TRACK_LIST } from "../redux/GPActionTypes";
import { PlaylistPageHeader } from "./PlaylistPageHeader";
import { setCookies } from "../utilities/util";
import { setCurrentPage } from "../redux/library/LibraryActions";

export const PlaylistPage = () => {
    const dispatch = useDispatch();
    const { playlistName, playlistId } = useParams();

    const playlistSongs = useSelector(state => state.playlist.playlistSongs);
    const playlistAlbums = useSelector(state => state.playlist.playlistAlbums);
    const isShuffle = useSelector(state => state.player.isShuffle);
    const [trackListInp, setTrackListInp] = useState({});

    useEffect(()=>{
        dispatch(fetchPlaylistNames());
        dispatch(fetchSongsInPlaylist(playlistId));

        if(playlistId && playlistName){
            const currentPage = {
                id: playlistId,
                name: playlistName,
                type: PLAYLIST
            }
            dispatch(setCurrentPage(currentPage));
            setCookies(CURRENT_PAGE, JSON.stringify(currentPage));
        }

    },[playlistId, playlistName]);

    useEffect(()=>{
        const tempTrackListInp = {
            playedFrom:{
                pfKey:PLAYLIST, 
                pfVal:playlistId,
                pfField:{name:playlistName}
            },
            sortSelectors:[SORT_A_TO_Z,SORT_A_TO_Z_DESC, SORT_YEAR],
            selectedSortBy: SORT_A_TO_Z,
            showSort: false,
            showLKey: false,
        }

        if(playlistSongs){
            if(playlistSongs.length > 6){
                tempTrackListInp.showSort = true;
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 27.8em)'
                }
            }
            if(playlistSongs.length > 20){
                tempTrackListInp.showLKey = true;
                tempTrackListInp.lKeyStyle = {
                    position:'absolute', 
                    visibility:'hidden'
                }
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 30.2em)'
                }
            }
        }

        setTrackListInp(tempTrackListInp);
    },[playlistSongs]);

    const playAll = () => {
        const tracks = document.getElementById(TRACK_LIST);
        if(tracks && tracks.childElementCount > 0){
            if(isShuffle && playlistSongs && playlistSongs.length > 0){
                tracks.getElementsByClassName("track")[Math.floor(Math.random() * playlistSongs.length)-1].getElementsByClassName("title")[0].click()
            }else{
                tracks.getElementsByClassName("track")[0].getElementsByClassName("title")[0].click();
            }
        }
    }

    return(
        <div className="playlist-page">
            <PlaylistPageHeader albumNames={playlistAlbums[playlistId]} songsCount={playlistSongs.length} playAll={playAll} />
            {playlistSongs.length > 0 && trackListInp.playedFrom &&
                <TrackList tracks={playlistSongs} trackListInp={trackListInp} />
            }
        </div>
    );
}