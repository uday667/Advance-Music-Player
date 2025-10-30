import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteLyrics } from "../../redux/player/PlayerActions";
import { getLyricsFromLRC, getMins0 } from "../../utilities/util";
import {  FaPlay } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { TbPencilPlus } from "react-icons/tb";
import { FaRegPaste } from "react-icons/fa6";
import { IoMdDownload } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { SHOW_CREATE_LYRICS, SHOW_EDIT_LYRICS } from "../../redux/GPActionTypes";

export const ShowLyrics = ({
    handleDoubleClickOnLyricsPage,
    setSection,
}) => {
    const dispatch = useDispatch();
    const songPlaying = useSelector(state => state.player.songPlaying);
    const playingSongStat = useSelector(state => state.player.playingSongStat);
    const [currentTime, setCurrentTime] = useState("");
    const [lyricsObj, setLyricsObj] = useState(null);

    useEffect(()=>{
        const tempNewLyrics = document.getElementById('new_lyrics_ta');
        if(tempNewLyrics!==null){
            tempNewLyrics.value= "";
            tempNewLyrics.innerHTML = "";
        }
        if(songPlaying && songPlaying.lyrics){
            readLyrics(songPlaying.lyrics)
        }else setLyricsObj(null)
    },[songPlaying])
    
    useEffect(()=>{
        if(lyricsObj){
            try {
                const currentTime = Math.floor(parseInt(playingSongStat.currentTime)/1000);
                const tempLine = lyricsObj[getMins0(currentTime).toString()];
                if(tempLine && tempLine!==""){
                    setCurrentTime(currentTime);
                }
            } catch (error) {
                console.log("Error in lyrics component while parsing lyrics: ",error);
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[playingSongStat]);

    const readLyrics =(lyrics) => {
        if(!lyrics)return null;
        let time;
        let text;
        const tempLyricObj = {};
        let timeArr;
        const lyricsArr = lyrics.split("\n");
        lyricsArr.forEach(line => {
            time = line.substring(line.indexOf('[')+1,6);
            timeArr = time.split(":");
            if(!isNaN(timeArr[0])){
                text = line.substring(line.indexOf(']')+1,line.length);
                tempLyricObj[time] = text;
            }
        });
        setLyricsObj(tempLyricObj);
    }

    const initEditLyrics = () => {
        setSection(SHOW_EDIT_LYRICS)
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

    useEffect(()=>{
        const spEle = [...document.getElementsByClassName("line-playing")]?.at(0);
        if(spEle && spEle!==null){
            spEle.scrollIntoView({block: "center",behavior: 'smooth'});
        }
    },[currentTime]);

    return (
        <div className="show-lyrics" onDoubleClick={handleDoubleClickOnLyricsPage}>
            {songPlaying &&
                <Link to={`/music/albums/${songPlaying.album}`}>
                    <label className="show-lyrics-song-title"><FaPlay /> {songPlaying.title} from&nbsp;{songPlaying.album}</label>
                </Link>
            }
            {lyricsObj !== null ?
                <div className="lyrics-lines">
                    {Object.keys(lyricsObj)?.map(time =>
                        <label className={getMins0(currentTime).toString() === time ? 'text-highlighted-y line-playing' : ''}>{lyricsObj[time]}</label>
                    )}
                </div>
                :
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <label>Lyrics not found for the song playing.</label>
                </div>
            }
            <div className="show-lyrics-btn-container">
                {lyricsObj === null ?
                    <>
                        <button onClick={() => setSection(SHOW_EDIT_LYRICS)} className="g-btn xs success beige font-size-18" title="Add lyrics"><FaRegPaste /></button>
                        <button onClick={() => { setSection(SHOW_CREATE_LYRICS) }} className="g-btn xs success beige font-size-18" title="Create lyrics"><TbPencilPlus /></button>
                    </>
                    :
                    <>
                        <button onClick={initEditLyrics} className="g-btn xs success beige font-size-18" title="Edit Lyrics"><MdModeEdit /></button>
                        <button onClick={downLoadLyrics} className="g-btn xs success beige font-size-18" title="Download Lyrics"><IoMdDownload /></button>
                        <button onClick={deleteLoadLyrics} className="g-btn xs red red1 font-size-18" title="Delete Lyrics"><RiDeleteBin6Line /></button>
                    </>
                }
            </div>
        </div>
    );
}