import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateLyrics } from "../../redux/player/PlayerActions";
import { getMins0 } from "../../utilities/util";
import { MdOutlineSave } from "react-icons/md";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { MdAdsClick } from "react-icons/md";
import { SHOW_LYRICS } from "../../redux/GPActionTypes";
import { FaHourglassStart } from "react-icons/fa6";

export const CreateLyrics = ({ setSection }) => {
    const dispatch = useDispatch();
    const songPlaying = useSelector(state => state.player.songPlaying);
    const playingSongStat = useSelector(state => state.player.playingSongStat);
    const [lyrics, setLyrics] = useState(null);
    const [lyricsP, setLyricsP] = useState({});
    const [selectedLineIndex, setSelectedLineIndex] = useState(0);
    const [isCreateLyricsStarted, setisCreateLyricsStarted] = useState(false);
    const [newLyrics, setNewLyrics] = useState(null);

    useEffect(() => {
        if (newLyrics !== null && newLyrics !== undefined) {
            const tempLyrics = newLyrics.split("\n");
            const tempLyricsObj = {};
            let counter = 0;
            tempLyrics.forEach((line, index) => {
                if (line !== "") {
                    tempLyricsObj[counter] = line;
                    counter++;
                }
            });
            setLyrics(tempLyricsObj);
        }

    }, [newLyrics]);

    const startCreateLyrics = () => {
        const tempNewLyrics = document.getElementById('new_lyrics_ta').value;
        if (tempNewLyrics === "" || tempNewLyrics === null) {
            alert("Please paste lyrics");
            return false;
        }
        setNewLyrics(tempNewLyrics);
        setisCreateLyricsStarted(true);
    }

    const setTime = () => {
        const tempLyricsP = { ...lyricsP }
        //console.log("tempLyricsP : ",tempLyricsP)
        let currentTime = Math.floor(parseInt(playingSongStat.currentTime) / 1000);
        currentTime = getMins0(currentTime);
        if (lyrics[selectedLineIndex] !== undefined) tempLyricsP[currentTime] = lyrics[selectedLineIndex];
        setSelectedLineIndex(selectedLineIndex + 1);
        setLyricsP(tempLyricsP);
    }

    const setExitingTime = (time) => {
        if (!time) return false;
        const tempLyricsP = { ...lyricsP }
        let currentTime = Math.floor(parseInt(playingSongStat.currentTime) / 1000);
        currentTime = getMins0(currentTime);
        delete Object.assign(tempLyricsP, { [currentTime]: tempLyricsP[time] })[time];
        setLyricsP(tempLyricsP);
    }

    const isLineSelected = (index) => {
        return Object.keys(lyricsP)[index];
    }

    const initUpdateLyrics = () => {
        const tempLyricsP = { ...lyricsP };
        let lyrics = "";
        if (songPlaying.artist !== undefined) {
            lyrics = lyrics + "[ar:" + songPlaying.artist + "]\n"
        }
        if (songPlaying.album !== undefined) {
            lyrics = lyrics + "[al:" + songPlaying.album + "]\n"
        }
        if (songPlaying.title !== undefined) {
            lyrics = lyrics + "[ti:" + songPlaying.title + "]\n"
        }
        if (songPlaying.lyricist !== undefined) {
            lyrics = lyrics + "[au:" + songPlaying.lyricist + "]\n"
        }
        if (songPlaying.trackLength !== undefined) {
            lyrics = lyrics + "[length:" + getMins0(songPlaying.trackLength) + "]\n"
        }
        lyrics = lyrics + "[by:g_player]\n"
        Object.keys(tempLyricsP).forEach((time) => {
            lyrics = lyrics + "[" + time + ":00]" + tempLyricsP[time] + "\n"
        });
        ///const lyrics = JSON.stringify(tempLyricsP);
        if (lyrics === "" || lyrics === null) {
            alert("Please paste lyrics");
            return false;
        }
        dispatch(updateLyrics(songPlaying.songId, lyrics));
    }

    const onSetisCreateLyricsStarted = (value) => {
        setisCreateLyricsStarted(value);
        if (!value) {
            setSection(SHOW_LYRICS)
        }
    }

    return (
        <>
            <div className="create-lyrics">
                {isCreateLyricsStarted &&
                    <div className="create-lyrics-btn-container">
                        <div><button onClick={initUpdateLyrics} className="g-btn xs success beige"><MdOutlineSave /></button>
                            <button class="g-btn xs success beige" onClick={setTime}><MdAdsClick /></button>
                            <button onClick={() => onSetisCreateLyricsStarted(false)} className="g-btn xs cancel beige"><MdOutlineCancelPresentation /></button></div>
                    </div>
                }
                {!isCreateLyricsStarted && <div id="new_lyrics_ta_container">
                    <textarea id="new_lyrics_ta" autoFocus></textarea>
                </div>}
                {isCreateLyricsStarted &&
                    <div className="" style={{ display: 'flex', flexDirection: 'column' }}>
                        {lyrics !== null && Object.values(lyrics).map((line, index) =>
                            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                <div style={{ padding: 5 }}>
                                    <span className={isLineSelected(index) !== undefined ? 'text-highlighted-y' : ''}
                                        onClick={() => setExitingTime(isLineSelected(index))}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {isLineSelected(index) !== undefined ? isLineSelected(index) : '00:00'}
                                    </span>

                                </div>
                                <div style={{ padding: 5 }}>
                                    <label style={{ width: '100%', marginBottom: 10 }}>{line}</label>
                                </div>
                            </div>
                        )}
                    </div>

                }


                {!isCreateLyricsStarted && <div className="show-lyrics-btn-container">
                    <button onClick={startCreateLyrics} className="g-btn xs success beige font-size-18" title="Start"><FaHourglassStart /></button>
                    <button
                        onClick={() => setSection(SHOW_LYRICS)}
                        className="g-btn xs cancel beige font-size-18" title="Cancel"
                    >
                        <MdOutlineCancelPresentation />
                    </button>
                </div>}

            </div>

        </>
    );
}