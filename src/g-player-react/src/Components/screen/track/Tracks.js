import React, { useEffect, useState } from "react";
import { TrackList } from "./TrackList";
import { useDispatch, useSelector } from "react-redux";
import { CURRENT_PAGE, SORT_ALBUM, SORT_ARTIST, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_GENRE, SORT_LANGUAGE, SORT_LYRICS_AVAILABLE, SORT_PLAY_COUNT, SORT_YEAR, TRACKS } from "../../redux/GPActionTypes";
import { setCookies } from "../../utilities/util";
import { fetchAllSongs } from "../../redux/library/LibraryActions";

export const Tracks = () => {
    const dispatch = useDispatch();
    const tracks = useSelector(state => state.library.tracks);
    const tracksHistory = useSelector(state => state.library.tracksHistory);
    const globalFilterText = useSelector(state => state.library.globalFilterText);
    const [finalTracks, setFinalTracks] = useState([]);
    useEffect(()=>{
        setCookies(CURRENT_PAGE, JSON.stringify({type:TRACKS}));
        if(tracks.length === 0){
            dispatch(fetchAllSongs());
        }else{
            setFinalTracks(tracks);
        }
    },[tracks]);

    useEffect(() => {
        //if (tracks & tracks.length > 0) {
            if (globalFilterText && globalFilterText.length > 2) {
                let tempFinalTracks = [...tracks];
                tempFinalTracks = tempFinalTracks.filter(track => {
                    return track.title.toLowerCase().includes(globalFilterText)
                        || track.album.toLowerCase().includes(globalFilterText)
                        || track.year === globalFilterText
                        || track.genre.toLowerCase().includes(globalFilterText)
                        || track.artist.toLowerCase().includes(globalFilterText)
                });
                setFinalTracks(tempFinalTracks);
            } else {
                setFinalTracks(tracks)
            }
        //}
    }, [globalFilterText]);

    return(
        <>
            {finalTracks && finalTracks.length>0 &&
                <TrackList tracks={finalTracks} tracksHistory={tracksHistory}
                    trackListInp={
                        {showSort:true, showLKey:true, 
                            lKeyStyle : {position:'absolute',visibility:'hidden'},
                            playedFrom:{pfKey:TRACKS}, 
                            sortSelectors:[SORT_A_TO_Z,SORT_A_TO_Z_DESC, SORT_YEAR, SORT_ARTIST, SORT_LANGUAGE, SORT_ALBUM,SORT_GENRE,SORT_LYRICS_AVAILABLE, SORT_PLAY_COUNT],
                            selectedSortBy:SORT_A_TO_Z,
                            showSortByLabel:true
                        }
                    } 
                />
            }
        </>
    );
}