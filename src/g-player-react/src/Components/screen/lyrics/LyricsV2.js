import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PLAYER_UPDATE_LYRICS_SUCCESS } from "../../redux/player/PlayerActionTypes";
import { CreateLyrics } from "./CreateLyrics";
import { BiExpand } from "react-icons/bi";
import { BiCollapse } from "react-icons/bi";
import { TbWriting } from "react-icons/tb";
import { ShowLyrics } from "./ShowLyrics";
import { SHOW_CREATE_LYRICS, SHOW_EDIT_LYRICS, SHOW_LYRICS } from "../../redux/GPActionTypes";
import { EditLyrics } from "./EditLyrics";

export const Lyrics = () => {
    const songPlaying = useSelector(state => state.player.songPlaying);
    const phase = useSelector(state => state.player.phase);
    const [newLyrics, setNewLyrics] = useState(null);
    const [lyricsUIExpanded, setLyricsUIExpanded] = useState(false);
    const [section, setSection] = useState(SHOW_LYRICS);

    useEffect(()=>{
        resetLyricsPage();
        const tempNewLyrics = document.getElementById('new_lyrics_ta');
        if(tempNewLyrics!==null){
            tempNewLyrics.value= "";
            tempNewLyrics.innerHTML = "";
        }
    },[songPlaying])

    useEffect(()=>{
        if(phase===PLAYER_UPDATE_LYRICS_SUCCESS){
            setSection(SHOW_LYRICS)
        }
    },[phase]);

    const resetLyricsPage = () =>{
        setNewLyrics(null);
        setSection(SHOW_LYRICS)
    }

    const handleDoubleClickOnLyricsPage = () => {
        setLyricsUIExpanded(!lyricsUIExpanded);
    }
    
    return(
    <div className={lyricsUIExpanded ? "lyrics lyrics-expanded" : "lyrics"}>
        {lyricsUIExpanded ? 
            <BiCollapse className="lyrics-ui-expand collapse" onClick={()=>setLyricsUIExpanded(false)} />
            :
            <BiExpand className="lyrics-ui-expand"  onClick={()=>setLyricsUIExpanded(true)} />
        }
        {section === SHOW_LYRICS ?
            <ShowLyrics 
                {...{
                    handleDoubleClickOnLyricsPage,
                    setSection,
                }}
            />
            : section === SHOW_EDIT_LYRICS ?
                <EditLyrics
                    {...{setSection}}
                />
            : section === SHOW_CREATE_LYRICS ?
                <CreateLyrics 
                    {...{newLyrics, setSection}}
                />
            :null
        }
        {songPlaying?.lyricist && 
            <div className="lyrics-written-by-div">
                <span title={`Lyrics :${songPlaying.lyricist}`}>
                    <TbWriting style={{fontSize:20}}  /><span>&nbsp;: {songPlaying.lyricist}</span>
                </span>
            </div>
        }
    </div>
    );
}