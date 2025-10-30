import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { COMMON_POPUP_ERROR_MSG, DELETE_LABEL, INPUT, PLAYLIST, PLAY_ALL_LABEL, RENAME, RENAME_LABEL, 
    RENAME_PLAYLIST_INP, RENAME_PLAYLIST_LABEL, TRACKS_LABEL } from "../redux/GPActionTypes";
import { FaPlay } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiRename } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setCommonPopupObj } from "../redux/library/LibraryActions";
import { deltePlaylist, renamePlaylist } from "../redux/playlist/PlaylistActions";
import { PLAYLIST_DELETE_PLAYLIST_SUCCESS, PLAYLIST_RENAME_PLAYLIST_SUCCESS } from "../redux/playlist/PlaylistActionTypes";
import { PlaylistImg } from "./PlaylistImg";
import { Lyrics } from "../screen/lyrics/LyricsV2";
import { getCookieValue } from "../utilities/util";
import { getShowDeletePlaylistPopup } from "./PlalistUtil";

export const PlaylistPageHeader = ({albumNames, songsCount, playAll}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { playlistName, playlistId } = useParams();
    const plPhase = useSelector(state => state.playlist.phase);
    const  playedFrom = useSelector(state => state.player.playedFrom);

    const[isPlayAll, setIsPlayAll] = useState(true);

    useEffect(()=>{
        let tempPlayedFrom = {...playedFrom};
        if(!tempPlayedFrom.pfKey){
            tempPlayedFrom = getCookieValue("playedFrom");
            if(tempPlayedFrom){
                tempPlayedFrom = JSON.parse(tempPlayedFrom);
            }
        }
        
        if(tempPlayedFrom.pfKey === PLAYLIST && tempPlayedFrom.pfField.name === playlistName){
            setIsPlayAll(false);
        }
    },[playlistName,playedFrom,playlistId]);

    const showDeletePlaylistPopup = () => {
        dispatch(
            setCommonPopupObj(
                getShowDeletePlaylistPopup(onDeletePlaylist)
            )
        );
    }

    const showRenamePlaylistPopup = () => {
        const commonPopupObj = {
            showPopup: true,
            title: RENAME_PLAYLIST_LABEL,
            content: playlistName,
            contentType: INPUT,
            primaryBtnAction: RENAME,
            primaryBtnLabel:RENAME_LABEL,
            className:"rename",
            elementId:RENAME_PLAYLIST_INP,
            primaryBtnFun: onRenamePlaylist

        }
        dispatch(setCommonPopupObj(commonPopupObj));
    }

    const onDeletePlaylist = () => {
        dispatch(deltePlaylist(playlistId))
    }

    const onRenamePlaylist = () => {
        const renameInp = document.getElementById(RENAME_PLAYLIST_INP);
        if(renameInp){
            if(renameInp.value !== playlistName){
                const tempPlaylist = {
                    id : playlistId,
                    name: document.getElementById(RENAME_PLAYLIST_INP).value,
                }
                dispatch(renamePlaylist(tempPlaylist));
            }else{
                const errMsg = document.getElementById(COMMON_POPUP_ERROR_MSG);
                if(errMsg){
                    errMsg.innerHTML = "Please provide name different than current one.";
                }
            }
            
        }
    }

    useEffect(()=>{
        if(plPhase === PLAYLIST_DELETE_PLAYLIST_SUCCESS){
            dispatch(setCommonPopupObj({showPopup:false}));
            navigate("/playlist");
        }
        if(plPhase === PLAYLIST_RENAME_PLAYLIST_SUCCESS){
            const playlistName = document.getElementById(RENAME_PLAYLIST_INP).value;
            navigate(`/playlist/${playlistName}/${playlistId}`);
            dispatch(setCommonPopupObj({showPopup:false}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[plPhase]);

    return(
        <div className="playlist-page-header">
            <PlaylistImg albumNames={albumNames} link={true} />
            <div className="playlist-details">
                <div className="playlist-name">
                    <h2>{playlistName}</h2>
                    <label>{songsCount} {TRACKS_LABEL}</label>
                </div>
                <div className="playlist-actions">
                    <div className="play-all">
                        <button onClick={playAll} disabled={!isPlayAll} className="g-btn md violet beige beige-border flexbox-center"><FaPlay className={!isPlayAll ?"rotate-player-button faplay font-size-16":"faplay font-size-16"}  />{PLAY_ALL_LABEL}</button>
                    </div>
                    <div className="delete-playlist">
                        <button onClick={showDeletePlaylistPopup} className="g-btn md red beige beige-border flexbox-center"><RiDeleteBin6Line className="font-size-16" />{DELETE_LABEL}</button>
                    </div>
                    <div className="rename-playlist">
                        <button onClick={showRenamePlaylistPopup} className="g-btn md cyan beige beige-border flexbox-center"><BiRename className="font-size-16" />{RENAME_LABEL}</button>
                    </div>
                </div>
            </div>
            <div className="playlist-lyrics">
                <Lyrics />
            </div>
        </div>
    );
}