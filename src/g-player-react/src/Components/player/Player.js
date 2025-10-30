import React, { useEffect, useState } from "react";

import { FaPauseCircle, FaPlay } from "react-icons/fa";
import { MdOutlineLyrics, MdSkipNext, MdSkipPrevious } from "react-icons/md";
import { TiArrowRepeat } from "react-icons/ti";
import { TbArrowsShuffle , TbRepeatOnce} from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { fettchCurrentSongStatus, playASong, playPause, setIsPlaying, setIsShuffle, setPlayBackLength, setRepeat } from "../redux/player/PlayerActions";
import { getMins, scrolltoId, scrollToPlaying, setCookies } from "../utilities/util";
import { VolumeH } from "./VolumeH";
import { Link } from "react-router-dom";
import { fetchAllHistory, updateHistory } from "../redux/library/LibraryActions";
import { SliderRC } from "../SliderRC";
import { ALBUM, ARTIST, CURRENT, GENRE, LANGUAGE, NEXT, PLAYER, PLAYLIST, PREVIOUS, 
    RECENT_PLAYS, REPEAT_ALL, REPEAT_OFF, REPEAT_ONE, TRACKS } from "../redux/GPActionTypes";
import def_album_art from '../images/def_album_art.png';
import { SplitAndLink } from "../utilities/SplitAndLink";
import { RefreshBuild } from "./RefreshBuild";
import { useCookies } from "react-cookie";

export const Player = () => {

    const dispatch = useDispatch();

    const [cookies] = useCookies();

    const playerTracks = useSelector(state => state.library.playerTracks);
    const isPlaying = useSelector(state => state.player.isPlaying);
    const repeat = useSelector(state => state.player.repeat);
    const isShuffle = useSelector(state => state.player.isShuffle);
    let songPlaying = useSelector(state => state.player.songPlaying);
    const playedFrom = useSelector(state => state.player.playedFrom);
    const playingSongStat = useSelector(state => state.player.playingSongStat);
    const playlistSongs = useSelector(state => state.playlist.playlistSongs);
    const currentVolume = useSelector(state => state.player.currentVolume);
    
    const [statClearIntrvl, setStatClearIntrvl] = useState(0);
    const [currentPlayVal, setCurrentplayVal] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlayingL, setIsPlayingL] = useState(false);
    const [playTime, setPlayTime] = useState(0); // Play time is updated every time playingSongStat chnage and is reset every time songPlaying chnages 
    const [pTrackList, setPTrackList] = useState([]);

    useEffect(() => {
        const handleEscape = (event) => {
            var key = event.which || event.keyCode; // keyCode detection
            var ctrl = event.ctrlKey ? event.ctrlKey : ((key === 17) ? true : false); // ctrl detection
            var shift = event.shiftKey ? event.shiftKey : ((key === 16) ? true : false);
            if(ctrl){
                switch (key) {
                    case 32:
                        playPauseFunc();
                        break;
                    case 39:
                        playNextSong(NEXT);
                        break;
                    case 37:
                        playNextSong(PREVIOUS);
                        break;
                    default:
                        break;
                }
            }

            if (shift) {
                if(playingSongStat && playingSongStat.currentTime){
                    if(key === 39){
                        setSlctdPlayBackTime(currentPlayVal+5);
                    }else if(key === 37){
                        setSlctdPlayBackTime(currentPlayVal-5);
                    }
                }
            }
        };
        window.addEventListener('keyup', handleEscape);
        return () => {
            window.removeEventListener('keyup', handleEscape);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [songPlaying,playingSongStat]);

    useEffect(()=>{
        setIsPlayingL(isPlaying);
    },[isPlaying])

    useEffect(()=>{
        clearInterval(statClearIntrvl);
        if(isPlaying)setStatClearIntrvl(setInterval( dispatchFetchStat, 500));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[songPlaying,isPlaying]);

    useEffect(()=>{
        if(isPlaying){
            dispatch(fettchCurrentSongStatus());
        }
        setPlayTime(0);
         const rotatingBtn = [...document.getElementsByClassName('rotate-player-button')];
         rotatingBtn.forEach((rBtn=>{
             rBtn.classList.remove('rotate-player-button');
         }));

        [...document.getElementsByClassName('player-controls')].forEach(pc => {pc.classList.remove('opacity-player-console')});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[songPlaying]);

    useEffect(()=>{
        const tempPlayTime = playTime;
        if(playTime===10000 && songPlaying!==null){
            dispatch(updateHistory(songPlaying.songId));
        }
        if(playTime===12000){
            dispatch(fetchAllHistory());
        }
        if(playTime > 4000 && Number.isInteger(playTime/5000)){
            setCookies("playingSongStat",JSON.stringify(playingSongStat));
        }
        setPlayTime(tempPlayTime+500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[playingSongStat])

    useEffect(()=>{
        if(playingSongStat===null || playingSongStat===undefined || songPlaying===null)return;
       const currentTime = Math.floor(parseInt(playingSongStat.currentTime)/1000);
       setCurrentTime(currentTime);
       const trackLength = songPlaying.trackLength;
       if((trackLength - currentTime)<3){
            clearInterval(statClearIntrvl);
            if(repeat===REPEAT_ALL){
                setTimeout(playNextSong(NEXT),4000);
            }else if(repeat===REPEAT_ONE){
                setTimeout(playNextSong(CURRENT),4000);
            }else{
                dispatch(setIsPlaying(false))
            }
       }else{
            const pBarval = Math.floor((currentTime/trackLength)*100);
            setCurrentplayVal(pBarval);
       }
       // eslint-disable-next-line react-hooks/exhaustive-deps
    },[playingSongStat]);

    const dispatchFetchStat = () => {
        dispatch(fettchCurrentSongStatus());
    }

    useEffect(()=> {
        getSetLibrary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isShuffle, playerTracks]);

    const getSetLibrary = () => {
        let library = [];
        const pfKey = playedFrom.pfKey;

        if(playerTracks && playerTracks.length > 0){
            library= playerTracks;
        }else if(pfKey === PLAYLIST){
            library= playlistSongs.map((track) => { return track.songId});
        }

        //if(library && library.length === 0)library = tracks;

        if(isShuffle && library && library.length>0){
            library = getShuffledTrackList(library);
        }
        setPTrackList(library);
        return library;
    }

    const getShuffledTrackList = (trackList) => {
        if(trackList.length === 0)return [];
        let randomIndex;
        const tempTrackIds = [...trackList];
        const shuffledTracks = [];
        for(let i=0; i<trackList.length;i++){
            randomIndex = Math.floor(Math.random()*tempTrackIds.length);
            shuffledTracks.push(tempTrackIds[randomIndex]);
            tempTrackIds.splice(randomIndex,1);
        }
        return shuffledTracks;
    }

    const playPauseFunc = () => {
        if(isPlayingL){
            setIsPlayingL(false);
            //dispatch(setIsPlaying(false));
        }else{
            setIsPlayingL(true);
            //dispatch(setIsPlaying(true));
        }
        dispatch(playPause(songPlaying, playedFrom, currentVolume, currentTime));
    }

    const playNextSong = (action, event, tempSongPlaying) => {
         if(event!==undefined){
             event.target.parentElement.classList.add('rotate-player-button');
         }

        [...document.getElementsByClassName('player-controls')].forEach(pc => {pc.classList.add('opacity-player-console')});

        if (songPlaying === null) {
            if(tempSongPlaying){
                songPlaying = {...tempSongPlaying};
            }else{
                return false;
            }
        }
        let library;
        let nextSong = {};
        if (action === CURRENT) {
            nextSong = songPlaying.songId;
        } else {
            if (pTrackList.length > 0) {
                library = pTrackList;
            } else {
                library = getSetLibrary();
            }
            const crrntindex = library.findIndex((track) => track === songPlaying.songId);
            if (action === NEXT) {
                if (library[crrntindex + 1] !== undefined) {
                    nextSong = library[crrntindex + 1];
                } else {
                    nextSong = library[0];
                }
            } else if (action === PREVIOUS) {
                if (library[crrntindex - 1] !== undefined) {
                    nextSong = library[crrntindex - 1];
                } else {
                    nextSong = library[library.length - 1];
                }
            }
        }
        let songId = nextSong;
        scrolltoId("track-" + songId);
        dispatch(playASong(songId, {pfKey:PLAYER}, currentVolume));
        dispatch(setIsPlaying(true));
    }

    const setSlctdPlayBackTime = (playBackTime) => {
        
        if(!isPlaying || songPlaying===null)return;
        const pbVal = playBackTime;
        const fPbVal = Math.floor(((songPlaying.trackLength*pbVal)/100)*1000);
        dispatch(setPlayBackLength(fPbVal));
    }

    const setRepeatL = () => {
        let tempRepeat;
        if(repeat===REPEAT_OFF){
            tempRepeat = REPEAT_ALL;
        }else if(repeat===REPEAT_ALL){
            tempRepeat = REPEAT_ONE;
        }else if(repeat===REPEAT_ONE){
            tempRepeat = REPEAT_OFF;
        }
        dispatch(setRepeat(tempRepeat))
        setCookies("repeat", tempRepeat);
    }

    const setIsShuffleL = () => {
        if(isShuffle){
            dispatch(setIsShuffle(false))
            setCookies("isShuffle", false);
        }else {
            dispatch(setIsShuffle(true))
            setCookies("isShuffle", true);
        }
    }

    const getToPageURL = (songPlaying) => {
        let url = '#';
        const playedFrom = cookies['playedFrom'];
        if(playedFrom){
            if(playedFrom.pfKey===PLAYLIST){
                url = `/playlist/${playedFrom.pfField?.name}/${playedFrom.pfVal}`;
            }else if(playedFrom.pfKey===ARTIST){
                url = `music/artists/${playedFrom.pfVal}`;
            }else if(playedFrom.pfKey===ALBUM){
                url = `/music/albums/${songPlaying?.album}`;
            }else if(playedFrom.pfKey===GENRE){
                url = `/music/genres/${playedFrom.pfVal}`;
            }else if(playedFrom.pfKey===LANGUAGE){
                url = `/music/languages/${playedFrom.pfVal}`;
            }else if(playedFrom.pfKey===RECENT_PLAYS){
                url = `/recent`;
            }else if(playedFrom.pfKey===TRACKS){
                url = `/music/tracks`;
            }
        }else if(songPlaying){
            url = `/music/albums/${songPlaying.album}`;
        }
        return url;
    }
    
    return (
        <div className="player">
            <div className="player-container">
                <div className="song-info">
                    <Link to={songPlaying!==null?`/music/albums/${songPlaying.album}`:'#'}>
                        <div className="song-info-img">
                            <img src={songPlaying ?`/gp_images/albums/${songPlaying.album}.jpg`: def_album_art} alt={songPlaying?.album} />
                        </div>
                    </Link>
                    <div className="song-info-title">
                        <Link to={getToPageURL(songPlaying)}>
                            <p onClick={()=>scrollToPlaying(isPlaying)} style={{cursor:'pointer'}}>
                                {songPlaying && songPlaying.title}{songPlaying && songPlaying.lyricsAvl && <span><MdOutlineLyrics title="This track has lyrics" style={{margin:'5px 0 0 5px'}} /></span>}
                            </p>
                        </Link>
                        <p style={{maxHeight: '3em',overflow: 'auto'}}>{songPlaying!==null && <SplitAndLink str={songPlaying.artist} url={`/music/artists/`} />}</p>
                    </div>
                    
                </div>
                <div className="player-controls">
                <div className="player-controls-buttons">
                    <div className="shuffle">
                        <div className={isShuffle?"shuffle-button btn-selected":"shuffle-button"}>
                            <TbArrowsShuffle onClick={setIsShuffleL} />
                        </div>
                    </div>
                    <div className="previous">
                        <div className="previous-button" id="previous-button">
                            <MdSkipPrevious onClick={(event)=>playNextSong(PREVIOUS, event)} />
                        </div>
                    </div>
                    <div className="play">
                        <div className="play-button" onClick={playPauseFunc}>
                            {!isPlayingL && <FaPlay className="faplay"/>}
                            {isPlayingL && <FaPauseCircle className="FaPauseCircle song-is-playing" />}
                        </div>
                    </div>
                    <div className="next">
                        <div className="next-button" id="next-button">
                            <MdSkipNext onClick={(event)=>playNextSong(NEXT, event)} />
                        </div>
                    </div>
                    <div className="repeat">
                        <div className={repeat===REPEAT_ONE || repeat===REPEAT_ALL?"repeat-button btn-selected":"repeat-button"}>
                            {(repeat===REPEAT_OFF || repeat===REPEAT_ALL) && <TiArrowRepeat onClick={setRepeatL} />}
                            {repeat===REPEAT_ONE && <TbRepeatOnce onClick={setRepeatL} />}
                        </div>
                    </div>
                </div>
                <div className="player-controls-status-bar">
                    <div className="play-progress-bar-div">
                        <span className="play-progress-bar-start-time">{getMins(currentTime)}</span>
                        <input type="range" min="1" max="100"  className="play-progress-bar no-display" id="play_progress_bar" value={currentPlayVal}  onChange={(event)=>setSlctdPlayBackTime(event)}></input>
                        <div className="play-progress-bar">
                            <SliderRC value={currentPlayVal} onValChange={setSlctdPlayBackTime} step={0} />
                        </div>
                        <span className="play-progress-bar-end-time">{songPlaying!==null ? getMins(songPlaying.trackLength):'0:00'}</span>
                    </div>
                </div>
                </div>
                <div className="other-actions">
                        <VolumeH />
                        <RefreshBuild />
                </div>
                <div className="mobile-only-block mobile-play-btn">
                    <div className="play">
                        <div className="play-button" onClick={playPauseFunc}>
                            {!isPlayingL && <FaPlay className="faplay"  />}
                            {isPlayingL && <FaPauseCircle className="FaPauseCircle" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}