import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLyrics } from "../../redux/player/PlayerActions";
import { MdOutlineSave } from "react-icons/md";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { PLAYER_UPDATE_LYRICS_SUCCESS } from "../../redux/player/PlayerActionTypes";
import { SHOW_LYRICS } from "../../redux/GPActionTypes";

export const EditLyrics = ({setSection}) => {
    const dispatch = useDispatch();
    const songPlaying = useSelector(state => state.player.songPlaying);
    const phase = useSelector(state => state.player.phase);

    const initUpdateLyrics = () =>{
        const lyrics = document.getElementById('new_lyrics_ta').value;
        if(lyrics==="" || lyrics===null){
            alert("Please paste lyrics");
            return false;
        }
        dispatch(updateLyrics(songPlaying.songId, lyrics));
    }

    useEffect(()=>{
        document.getElementById('new_lyrics_ta').value = songPlaying.lyrics;
    },[songPlaying])

    useEffect(()=>{
        if(phase===PLAYER_UPDATE_LYRICS_SUCCESS){
            setSection(SHOW_LYRICS)
        }
    },[phase, setSection]);

    return(
        <div className="edit-lyrics">
            <div id="new_lyrics_ta_container">
                <textarea id="new_lyrics_ta" autoFocus></textarea>
            </div>
            <div className="show-lyrics-btn-container">
                <button onClick={initUpdateLyrics} className="g-btn xs success beige font-size-18" title="Save"><MdOutlineSave /></button>
                <button onClick={()=>setSection(SHOW_LYRICS)}
                    className="g-btn xs cancel beige font-size-18" title="Cancel"><MdOutlineCancelPresentation /></button>
            </div>
        </div>
    );
}