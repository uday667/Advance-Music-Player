import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SORT_YEAR, SORT_ARTIST, TRACK_LIST, NO_SORT, SORT_A_TO_Z_DESC, SORT_LYRICS_AVAILABLE, SORT_A_TO_Z, GP_TRACKS_SORT_FIELD_MAPPING, SORT_TRACK_NUMBER, SORT_PLAY_COUNT } from "../../redux/GPActionTypes";
import { scrollToPlaying, sortGroupByField } from "../../utilities/util";
import { SortingContainer } from "../SortingContainer";
import { Spinner } from "../../utilities/Spinner";
import { Track } from "./Track";
import {ViewportList} from "react-viewport-list";
import { useRef } from "react";


export const TrackList = ({tracks, trackListInp, tracksHistory}) => {
    const ref = useRef(null);
    const [trackList, setTrackList] = useState({});
    const isPlaying = useSelector(state => state.player.isPlaying);
    const [trackListKeys, setTrackListKeys] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [trackIndex, setTrackIndex] = useState({});

    useEffect(()=>{
        if(trackListInp)setSortBy(trackListInp.selectedSortBy?trackListInp.selectedSortBy:NO_SORT);
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[tracks])

    useEffect(()=>{
        if(Object.keys(trackList).length>0){
            let tempTrakListKeys = Object.keys(trackList);
            
            if(sortBy === SORT_YEAR || sortBy === SORT_A_TO_Z_DESC || sortBy === SORT_LYRICS_AVAILABLE){
                tempTrakListKeys = tempTrakListKeys.sort((a,b)=>{return a>b?-1:1});
            }if(sortBy === SORT_PLAY_COUNT){
                tempTrakListKeys = tempTrakListKeys.reverse();
            }else if(sortBy === SORT_A_TO_Z || sortBy === SORT_ARTIST){
                tempTrakListKeys = tempTrakListKeys.sort((a,b)=>{return a>b?1:-1});
            }

            setTrackListKeys(tempTrakListKeys);
            if(trackListInp.playedFrom.pfKey !== TRACK_LIST){
                scrollToPlaying(isPlaying);
            }
            
            const tempTrackIndex = {};
            let list = [];
            if(sortBy !== NO_SORT && sortBy !== SORT_TRACK_NUMBER){
                tempTrakListKeys.forEach(tlk =>{
                    list = trackList[tlk];
                        if(list.length){
                            list.forEach(tr =>{
                                tempTrackIndex[tr.songId] = Object.keys(tempTrackIndex).length;
                            })
                        }
                        
                })
            }
            setTrackIndex(tempTrackIndex);
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[trackList, sortBy])

    useEffect(()=>{
        if(sortBy && tracks.length>0){
            if(sortBy===SORT_ARTIST){
                sortByArtist(tracks);
            }else{
                setTrackList(sortGroupByField(tracks, GP_TRACKS_SORT_FIELD_MAPPING[sortBy], tracksHistory));
            }
        }
         // eslint-disable-next-line react-hooks/exhaustive-deps
    },[tracks, sortBy]);

    const sortByArtist = (tracks) => {
        let trackList = {};
        let tempArr = [];
        let indArr;
        tracks.forEach((track) => {
            if (track.artist !== null && track.artist !== undefined && track.artist !== "") {
                let ind = track.artist;
                if(ind.includes(",") || ind.includes(";") || ind.includes("&")){
                    if(ind.includes(";") || ind.includes("&")){
                        ind = ind.replaceAll("&", ",");
                        ind = ind.replaceAll(";", ",");
                        indArr = ind.split(",");
                        indArr.forEach((art)=>{
                            if (trackList[art] !== undefined) {
                                tempArr = trackList[art];
                                tempArr.push(track);
                                trackList[art] = tempArr;
                            } else {
                                trackList[art] = [track];
                            }
                        })
                    }
                }else{
                    if (trackList[ind] !== undefined) {
                        tempArr = trackList[ind];
                        tempArr.push(track);
                        trackList[ind] = tempArr;
                    } else {
                        trackList[ind] = [track];
                    }
                }
            }
        })
        setTrackList(trackList);
    }

    return(
        <>
            {trackListInp.showSort &&<SortingContainer sortListKeys={trackListKeys} setSortBy={setSortBy} sortBy={sortBy} showLKey={trackListInp.showLKey} sortSelectors={trackListInp.sortSelectors} showSortByLabel={trackListInp.showSortByLabel} />}
            <div className="track-list scroll-container" id={TRACK_LIST} style={trackListInp.traskListStyle?trackListInp.traskListStyle:{}} ref={ref}>
                 {trackListKeys && trackListKeys.length > 0 && trackListKeys.map((lKey, index) =>
                    <div key={index}>
                        {(trackListInp.showLKey) && <label id={"lKey" + lKey} className="track-lKey" style={trackListInp.lKeyStyle?trackListInp.lKeyStyle:{}}>{lKey}</label>}
                        {trackList[lKey] && trackList[lKey].length > 0 && Object.keys(trackIndex).length > 0 &&
                            <ViewportList viewportRef={ref} items={trackList[lKey]} itemMinSize={tracks ? tracks.length:50} margin={8}>
                                {(track) => (
                                    <Track track={track} key={track.songId} playedFrom={trackListInp.playedFrom} index={trackIndex[track.songId]} hideTrackNum={trackListInp.hideTrackNum} />
                                )}
                            </ViewportList>
                        }
                    </div>
                )}
                {(sortBy===NO_SORT || sortBy === SORT_TRACK_NUMBER) && tracks && tracks.length > 0 && tracks.map((track, i)=>
                    <Track track={track} key={track.songId} playedFrom={trackListInp.playedFrom} index={i} hideTrackNum={trackListInp.hideTrackNum} />
                )}
            </div>
            <Spinner />
        </>
    );
}