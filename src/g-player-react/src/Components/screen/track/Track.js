import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ALBUM, ARTIST, UNSELECT_TRACKS_LABEL, CURRENT_PAGE, SELECT_TRACKS_LABEL, EDIT_TRACK_INFO_LABEL, PLAYLIST, REMOVE_LABEL, TRACK, TRACK_MENU_BTN_CIRCLE, MULTIPLE_TRACKS } from "../../redux/GPActionTypes";
import { playASong, playPause, setIsPlaying } from "../../redux/player/PlayerActions";
import { getCookieValue, getMins } from "../../utilities/util";
import { FaPlay } from "react-icons/fa";
import { setCheckedTracks, setContextObj, setMetadataPopupObj, setShowContextMenu, setShowTrackCheckBox } from "../../redux/library/LibraryActions";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdOutlineLyrics } from "react-icons/md";
import { fetchAssignedPlaylists, fetchAssignedPlaylistsSucc, removeFromPlaylist } from "../../redux/playlist/PlaylistActions";
import { SplitAndLink } from "../../utilities/SplitAndLink";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useCookies } from "react-cookie";


export const Track = ({track, playedFrom, index, hideTrackNum}) => {
    const dispatch = useDispatch();
    const [cookies] = useCookies();
    const songPlaying = useSelector(state => state.player.songPlaying);
    const currentVolume = useSelector(state => state.player.currentVolume);
    const currentPage = useSelector(state => state.library.currentPage);
    const assignedPlaylists = useSelector(state => state.playlist.assignedPlaylists);
    const showTrackCheckBox = useSelector(state => state.library.showTrackCheckBox);
    const checkedTracks = useSelector(state => state.library.checkedTracks)

    const playSong = async(songId) => {
        if(songPlaying!==null && songId===songPlaying.songId){
            dispatch(playPause(songPlaying, playedFrom, currentVolume));
        }else{
            dispatch(setIsPlaying(true));
            dispatch(playASong(songId,playedFrom,currentVolume));
        }
    }

    const showCOntextMenu = (event) => {
        const position = event.target.getBoundingClientRect();
        event.preventDefault();
        const options = [];
        if(playedFrom.pfKey === PLAYLIST){//this is to identify if current page is plalist page
            options.push({label:REMOVE_LABEL, callBackFunc: removeTrackFromPlaylist});
        }
        options.push({label:EDIT_TRACK_INFO_LABEL, callBackFunc: onSetShowMetadataPopup});
        options.push({label:showTrackCheckBox?UNSELECT_TRACKS_LABEL:SELECT_TRACKS_LABEL, callBackFunc: ()=>dispatch(setShowTrackCheckBox(showTrackCheckBox))});
        const contextObj = {
            position,
            type: checkedTracks?.length>0?MULTIPLE_TRACKS:TRACK,
            obj: checkedTracks?.length>0?checkedTracks:track,
            options,
            rowList:[ALBUM, ARTIST]
        }
        dispatch(setContextObj(contextObj));
        dispatch(setShowContextMenu(true));
    }

    const removeTrackFromPlaylist = () => {
        let tempCurrentObject = currentPage;
        if(!tempCurrentObject){
            tempCurrentObject = getCookieValue(CURRENT_PAGE);
        }
        if(tempCurrentObject && tempCurrentObject.type === PLAYLIST){
            dispatch(removeFromPlaylist(tempCurrentObject.id, track.songId));
        }else{
            alert("Error")
        }
    }

    const onSetShowMetadataPopup = () => {
        const metadataPopupObj = {
            showMetadataPopup : true,
            obj:track,
            objType:TRACK
        }
        dispatch(setMetadataPopupObj(metadataPopupObj));
    }

    const [clearTime, setClearTime] = useState();
    const handleMouseEnter = () => {
        dispatch(fetchAssignedPlaylistsSucc([]))
        let tempClearTime = setTimeout(() => {
            dispatch(fetchAssignedPlaylists(TRACK,track.songId))
        }, 300)
        setClearTime(tempClearTime)
    }

    const handleTrackCheckBoxChange = (event) => {
        const checked = event.target.checked;
        dispatch(setCheckedTracks(track.songId, checked?'ADD':'REMOVE'))
    }
    return(
        <>
            <div className={songPlaying!==null && track.songId===songPlaying.songId?"track text-highlighted-y":"track"} 
                id={"track-"+track.songId} onContextMenu={(event)=>showCOntextMenu(event)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={()=>clearTimeout(clearTime)}
            >
                {!hideTrackNum && !showTrackCheckBox &&
                    <label style={{paddingLeft:'5'}}>{playedFrom.pfKey===ALBUM && track.trackNumber!==undefined && track.trackNumber!==0?track.trackNumber:index+1}</label>
                }
                {showTrackCheckBox &&
                    <input type="checkbox" className="custom-checkbox" style={{marginLeft:10}} onChange={(event)=>handleTrackCheckBoxChange(event)} />
                }
                <label 
                    onClick={()=>playSong(track.songId)} style={{cursor:'pointer'}} className="title" 
                    data-tooltip-id="assigned_playlists_tooltip"
                >
                    <span>{track.title}{track.lyricsAvl && <MdOutlineLyrics title="This track has lyrics" />}</span>
                    <span className="mobile-only-block track-title-artist"><SplitAndLink str={track.artist} url={`/music/artists/`} /></span>
                </label>
                <label className="mobile-only-block song-playing-icon-label">{songPlaying!==null && track.songId===songPlaying.songId ? <FaPlay className="faplay"  />:''}</label>
                <label className="text-overflow-ellipsis" onDoubleClick={()=>playSong(track.songId)} title={track.artist}>
                    <SplitAndLink str={track.artist} url={`/music/artists/`} />
                </label>
                <label onDoubleClick={()=>playSong(track.songId)}>
                <Link to={`/music/albums/${track.album}`}>{track.album}</Link>
                </label>
                <label onDoubleClick={()=>playSong(track.songId)}>{track.year!==0?track.year:''}</label>
                <label className="text-overflow-ellipsis" onDoubleClick={()=>playSong(track.songId)} title={track.language}>
                    <SplitAndLink str={track.language} url={`/music/languages/`} />
                </label>
                <label>{getMins(track.trackLength)}</label>
                <label style={{position:'relative'}}>
                    <div className="track-menu-btn-div">
                        <div id={TRACK_MENU_BTN_CIRCLE} className="track-menu-btn-circle" onClick={(event)=>showCOntextMenu(event)}>
                            <div className="track-menu-btn">
                                <HiOutlineDotsVertical  />
                            </div>
                        </div>
                    </div>
                </label>
            </div>
            <div >
                {cookies.SHOW_ASSIGNED_PLAYLISTS &&  
                    <ReactTooltip
                        id="assigned_playlists_tooltip"
                        place="top-start"
                        delayShow={1500}
                        style={{ position:'fixed', backgroundColor:'#2b2b2b' }}
                        //isOpen
                    >
                        <div style={{ min: 'fit-content', width: 'fit-content', color:'beige'}}>
                            {assignedPlaylists?.length>0
                            ?
                                <>
                                    <h3>Assigned Playlists</h3>
                                    {assignedPlaylists?.map((ap, i) =>
                                            <li key={i} style={{padding:2}}><span>{ap}</span></li>
                                        )}
                                </>
                            :
                            <><h3>No Playlists</h3></>
                            }
                        </div>
                    </ReactTooltip>
                }
            </div>
        </>
    );
}