import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLyrics, updateLyrics } from "../../redux/player/PlayerActions";
import { getLyricsFromLRC, getMins0 } from "../../utilities/util";
import {  FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PLAYER_UPDATE_LYRICS_SUCCESS } from "../../redux/player/PlayerActionTypes";
import { CreateLyrics } from "./CreateLyrics";
import { BiExpand } from "react-icons/bi";
import { BiCollapse } from "react-icons/bi";
import { MdModeEdit } from "react-icons/md";
import { TbPencilPlus } from "react-icons/tb";
import { FaRegPaste } from "react-icons/fa6";
import { MdOutlineSave } from "react-icons/md";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { FaHourglassStart } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbWriting } from "react-icons/tb";

// @deprecated
export const Lyrics = () => {
    const dispatch = useDispatch();
    const songPlaying = useSelector(state => state.player.songPlaying);
    const playingSongStat = useSelector(state => state.player.playingSongStat);
    const phase = useSelector(state => state.player.phase);
    const [linePlaying, setLinePlaying] = useState("");
    const [nextLine, setNextLine] = useState("");
    const [previousLine, setPreviousLine] = useState("");
    const [nextLine2, setNextLine2] = useState("");
    const [previousLine2, setPreviousLine2] = useState("");
    const [lyricsObj, setLyricsObj] = useState(null);
    const [lyricsObjKeys, setLyricsObjKeys] = useState(null);
    const [showEditLyrics, setShowEditLyrics] = useState(false);
    const [showCreateLyrics, setShowCreateLyrics] = useState(false);
    const [isCreateLyricsStarted, setisCreateLyricsStarted] = useState(false);
    const [newLyrics, setNewLyrics] = useState(null);
    const [lyricsUIExpanded, setLyricsUIExpanded] = useState(false);

    useEffect(()=>{
        resetLyricsPage();
        const tempNewLyrics = document.getElementById('new_lyrics_ta');
        if(tempNewLyrics!==null){
            tempNewLyrics.value= "";
            tempNewLyrics.innerHTML = "";

        }
        if(songPlaying && songPlaying.lyrics){
            getLyrics(songPlaying.lyrics)
        }
    },[songPlaying])
    
    useEffect(()=>{
        if(lyricsObj){
            try {
                const currentTime = Math.floor(parseInt(playingSongStat.currentTime)/1000);
                const tempLine = lyricsObj[getMins0(currentTime).toString()];
                if(tempLine!==null && tempLine!==undefined && tempLine!==""){
                    setLinePlaying(tempLine);
                    const lineIndex = lyricsObjKeys.findIndex(key => key===getMins0(currentTime).toString());
                    setNextLine(lyricsObj[lyricsObjKeys[lineIndex+1]]);
                    setPreviousLine(lyricsObj[lyricsObjKeys[lineIndex-1]]);
                    if(lyricsUIExpanded){
                        setNextLine2(lyricsObj[lyricsObjKeys[lineIndex+2]]?lyricsObj[lyricsObjKeys[lineIndex+2]]:"");
                        setPreviousLine2(lyricsObj[lyricsObjKeys[lineIndex-2]]?lyricsObj[lyricsObjKeys[lineIndex-2]]:"");
                    }
                }
            } catch (error) {
                console.log("Error in lyrics component while parsing lyrics: ",error);
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[playingSongStat]);

    const getLyrics =(lyrics) => {
        if(!lyrics)return null;
        let time;
        let text;
        const tempLyricObj = {};
        let timeArr;
        if(lyrics!==null && lyrics!==undefined){
            const lyricsArr = lyrics.split("\n");
            lyricsArr.forEach(line => {
                time = line.substring(line.indexOf('[')+1,6);
                timeArr = time.split(":");
                if(!isNaN(timeArr[0])){
                    //time = time.substring(0,time.length-3);
                    text = line.substring(line.indexOf(']')+1,line.length);
                    tempLyricObj[time] = text;
                }
            });
        }
        setLyricsObjKeys(Object.keys(tempLyricObj));
        setLyricsObj(tempLyricObj);
    }

    const initUpdateLyrics = () =>{
        const lyrics = document.getElementById('new_lyrics_ta').value;
        if(lyrics==="" || lyrics===null){
            alert("Please paste lyrics");
            return false;
        }
        dispatch(updateLyrics(songPlaying.songId, lyrics));
    }

    const initEditLyrics = () => {
        document.getElementById('new_lyrics_ta').value = songPlaying.lyrics;
        setShowEditLyrics(true);

    }

    useEffect(()=>{
        if(phase===PLAYER_UPDATE_LYRICS_SUCCESS){
            setShowEditLyrics(false);
            setisCreateLyricsStarted(false);
            setShowCreateLyrics(false);
            if(songPlaying!==null)getLyrics(songPlaying.lyrics);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[phase]);

    const startCreateLyrics = () => {
        const tempNewLyrics = document.getElementById('new_lyrics_ta').value;
        if(tempNewLyrics==="" || tempNewLyrics===null){
            alert("Please paste lyrics");
            return false;
        }
        setNewLyrics(tempNewLyrics);
        setisCreateLyricsStarted(true);
    }

    const onSetisCreateLyricsStarted = (value)=>{
        setisCreateLyricsStarted(value);
        if(!value){
            setShowCreateLyrics(false);
            //setLyrics(null);
            setShowEditLyrics(false);
            setLyricsObj(null);
        }
    }

    const resetLyricsPage = () =>{
        setLinePlaying(null);
        setLyricsObj(null);
        setNextLine(null);
        setPreviousLine(null);
        setNextLine2(null);
        setPreviousLine2(null);
        setNewLyrics(null);
        setShowEditLyrics(false);
        setShowCreateLyrics(false);
    }

    const downLoadLyrics = () => {
        if(window.confirm("Download lyrics ?")!==true){
            return false;
        }
        if(songPlaying && songPlaying.lyrics){
            const lrcFile = new Blob([songPlaying.lyrics], { type: "text/plain" });
            const lyricsFile = new Blob([getLyricsFromLRC(songPlaying.lyrics)], { type: "text/plain" });
            
            //LRC download - start
            const elementLrc = document.createElement("a");
            elementLrc.setAttribute("id", "download_lrc");
            elementLrc.href = URL.createObjectURL(lrcFile);
            elementLrc.download = songPlaying.title+".lrc";

            // simulate link click
            document.body.appendChild(elementLrc); // Required for this to work in FireFox
            elementLrc.click();
            document.body.removeChild(elementLrc);
            //LRC download - end

            //Lyrics file download - start
            const elementLyrics = document.createElement("a");
            elementLyrics.setAttribute("id", "download_lrc");
            elementLyrics.href = URL.createObjectURL(lyricsFile);
            elementLyrics.download = songPlaying.title+".lyrics";

             // simulate link click
             document.body.appendChild(elementLyrics); // Required for this to work in FireFox
             elementLyrics.click();
             document.body.removeChild(elementLyrics);
            //Lyrics file download - end
        }
    }

    const deleteLoadLyrics = () => {
        if(window.confirm("Are you sure to delete lyrics ?")!==true){
            return false;
        }

        if(window.confirm("This action is irreversible.")!==true){
            return false;
        }

        dispatch(deleteLyrics(songPlaying.songId));
    }

    const handleDoubleClickOnLyricsPage = () => {
        setLyricsUIExpanded(!lyricsUIExpanded);
    }
    
    return(
    <div className={lyricsUIExpanded ? "lyrics lyrics-expanded" : "lyrics"}>
        {!lyricsUIExpanded && <BiExpand className="lyrics-ui-expand"  onClick={()=>setLyricsUIExpanded(true)} />}
        {lyricsUIExpanded && <BiCollapse className="lyrics-ui-expand collapse" onClick={()=>setLyricsUIExpanded(false)} />}
    {!isCreateLyricsStarted && <div className="show-lyrics" onDoubleClick={handleDoubleClickOnLyricsPage}>
        {songPlaying && !showEditLyrics && !showCreateLyrics && 
            <Link to={`/music/albums/${songPlaying.album}`}><label className="show-lyrics-song-title"><FaPlay /> {songPlaying.title} from&nbsp;{songPlaying.album}</label></Link>
        }
        {lyricsObj!==null && !showEditLyrics &&
        <>
            {lyricsUIExpanded && <label >{previousLine2}</label>}
            <label >{previousLine}</label>
            <label className="text-highlighted-y" id={linePlaying}>{linePlaying}</label>
            <label>{nextLine}</label>
            {lyricsUIExpanded && <label >{nextLine2}</label>}
        </>
        }
            <div style={{display:'flex',justifyContent:'center'}}>{lyricsObj===null && !showEditLyrics && !showCreateLyrics && <label>Lyrics not found for the song playing.</label>}</div>
            <div style={{display:showEditLyrics || showCreateLyrics?'flex':'none'}} id="new_lyrics_ta_container">
                <textarea id="new_lyrics_ta" autoFocus></textarea>
            </div>

        <div className="show-lyrics-btn-container">
            {!showEditLyrics && lyricsObj===null && !showCreateLyrics &&
                <>
                    <button onClick={()=>setShowEditLyrics(true)} className="g-btn xs success beige font-size-18" title="Add lyrics"><FaRegPaste/></button>
                    <button onClick={()=>{setShowCreateLyrics(true)}} className="g-btn xs success beige font-size-18" title="Create lyrics"><TbPencilPlus /></button>
                </>
            }
            { showEditLyrics && 
                <>
                    <button onClick={initUpdateLyrics} className="g-btn xs success beige font-size-18" title="Save"><MdOutlineSave /></button>
                </>
            }
            { showCreateLyrics && 
                <>
                    <button onClick={startCreateLyrics} className="g-btn xs success beige font-size-18" title="Start"><FaHourglassStart/></button>
                </>
            }
            { (showEditLyrics || showCreateLyrics) && 
                <>
                    <button onClick={()=>{setShowEditLyrics(false);setShowCreateLyrics(false)}} className="g-btn xs cancel beige font-size-18" title="Cancel"><MdOutlineCancelPresentation /></button>
                </>
            }

            {lyricsObj!==null && !showEditLyrics && 
                <>
                    <button onClick={initEditLyrics} className="g-btn xs success beige font-size-18" title="Edit Lyrics"><MdModeEdit /></button>
                    <button onClick={downLoadLyrics} className="g-btn xs success beige font-size-18" title="Download Lyrics"><IoMdDownload /></button>
                    <button onClick={deleteLoadLyrics} className="g-btn xs red red1 font-size-18" title="Delete Lyrics"><RiDeleteBin6Line /></button>
                </>
            }
        </div>
        {songPlaying!==null &&  songPlaying.lyricist!==null && 
            <div className="lyrics-written-by-div">
                <span title={`Lyrics :${songPlaying.lyricist}`} style={{display:'flex',alignItems:'center', justifyContent:'flex-end'}}><TbWriting style={{fontSize:20}}  /><span>&nbsp;: {songPlaying.lyricist}</span></span>
            </div>
        }
    </div>}
    {isCreateLyricsStarted && 
        <div className="show-lyrics" style={{width:'100%'}} onDoubleClick={handleDoubleClickOnLyricsPage}>
            <CreateLyrics onSetisCreateLyricsStarted={onSetisCreateLyricsStarted} newLyrics={newLyrics} />
        </div>
    }
    </div>
    );

}