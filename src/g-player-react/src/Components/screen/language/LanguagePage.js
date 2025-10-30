import React, { useEffect, useState } from "react";
import { GroupedThumbImg4 } from "../../GroupedThumbImg4";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CURRENT_PAGE, LANGUAGE, PLAY_ALL_LABEL, SORT_ARTIST, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_LYRICS_AVAILABLE, SORT_YEAR, TRACKS_LABEL, TRACK_LIST } from "../../redux/GPActionTypes";
import { fetchLanguageDetails, fetchSongsByLanguage } from "../../redux/library/LibraryActions";
import { TrackList } from "../track/TrackList";
import { FaPlay } from "react-icons/fa";
import { Lyrics } from "../lyrics/LyricsV2";
import { camelize, getCookieValue, setCookies } from "../../utilities/util";

export const LanguagePage = () => {
    const {language} = useParams();

    const dispatch = useDispatch();
    
    const languageDetails = useSelector(state => state.library.languageDetails);
    let languageSongList = useSelector(state => state.library.languageSongList);
    if(languageSongList.length>0){
        languageSongList = languageSongList.sort((a,b)=>{return a.title>b.title?1:-1});
    }
    const isShuffle = useSelector(state => state.player.isShuffle);
    const  playedFrom = useSelector(state => state.player.playedFrom);

    const[isPlayAll, setIsPlayAll] = useState(true);

    const [languageAlbums, setLanguageAlbums] = useState({});
    const [languageSongCount, setLanguageSongCount] = useState({});
    const [trackListInp, setTrackListInp] = useState({});

    useEffect(()=>{
        dispatch(fetchSongsByLanguage(language));
        if(!languageDetails || (languageDetails && !languageDetails.LANGUAGE_SONG_COUNT)){
            dispatch(fetchLanguageDetails());
        }
        setCookies(CURRENT_PAGE, JSON.stringify({type:LANGUAGE}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[language]);

    useEffect(()=>{
        if(languageDetails){
            if(languageDetails.LANGUAGE_ALBUMS){
                setLanguageAlbums(languageDetails.LANGUAGE_ALBUMS);
            }
            if(languageDetails.LANGUAGE_SONG_COUNT){
                setLanguageSongCount(languageDetails.LANGUAGE_SONG_COUNT);
            }
        }
    },[languageDetails]);

    

    useEffect(()=>{
        let tempPlayedFrom = {...playedFrom};
        if(!tempPlayedFrom.pfKey){
            tempPlayedFrom = getCookieValue("playedFrom");
            if(tempPlayedFrom){
                tempPlayedFrom = JSON.parse(tempPlayedFrom);
            }
        }
        
        if(tempPlayedFrom.pfKey === LANGUAGE && tempPlayedFrom.pfVal=== language){
            setIsPlayAll(false);
        }
    },[language,playedFrom]);

    useEffect(()=>{
        const tempTrackListInp = {
            playedFrom:{
                pfKey:LANGUAGE, 
                pfVal:language
            },
            showSort: false,
            showLKey: false,
            sortSelectors:[SORT_A_TO_Z,SORT_A_TO_Z_DESC, SORT_YEAR, SORT_ARTIST, SORT_LYRICS_AVAILABLE],
            selectedSortBy:SORT_A_TO_Z
        }

        if(languageSongList){
            if(languageSongList.length > 6){
                tempTrackListInp.showSort = true;
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 29em)'
                }
            }
            if(languageSongList.length > 20){
                tempTrackListInp.showLKey = true;
                tempTrackListInp.lKeyStyle = {
                    position:'absolute', 
                    visibility:'hidden'
                }
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 31.8em)'
                }
            }
        }
        setTrackListInp(tempTrackListInp);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[languageSongList]);

    const playAll = () => {
        const tracks = document.getElementById(TRACK_LIST);
        if(tracks && tracks.childElementCount > 0){
            if(isShuffle && languageSongList && languageSongList.length > 1){
                tracks.getElementsByClassName("track")[Math.floor(Math.random() * tracks.getElementsByClassName("track").length)-1].getElementsByClassName("title")[0].click()
            }else{
                tracks.getElementsByClassName("track")[0].getElementsByClassName("title")[0].click();
            }
        }
    }

    return(
        <div className="language-page">
            <div className="language-page-header">
                <GroupedThumbImg4 albumNames={languageAlbums[language]} classPrefix="language" />
                <div className="language-details">
                    <div className="language-name">
                        <h2>{camelize(language)}</h2>
                        <label>{languageSongCount[language]}&nbsp;{TRACKS_LABEL}</label>
                    </div>
                    <div className="language-actions">
                        <div className="play-all">
                            <button onClick={playAll} disabled={!isPlayAll} className="g-btn md violet flexbox-center beige beige-border column-gap-5"><FaPlay className={!isPlayAll ?"rotate-player-button faplay":"faplay"}  />{PLAY_ALL_LABEL}</button>
                        </div>
                    </div>
                </div>
                <div className="language-lyrics">
                    <Lyrics />
                </div>
            </div>
            {languageSongList.length > 0 && trackListInp.playedFrom &&
                <TrackList tracks={languageSongList} trackListInp={trackListInp} />
            }
            
        </div>
    );
}