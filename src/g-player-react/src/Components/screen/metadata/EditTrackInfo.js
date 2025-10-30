import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ALBUM_ARTIST_LABEL, ALBUM_LABEL, ARTIST_LABEL, CANCEL_LABEL, FILE_LOCATION_LABEL, GENRE_LABEL, LABEL_LABEL, LANGUAGE_LABEL, LYRICIST_LABEL, SAVE_LABEL, TITLE_LABEL, TRACK, TRACK_NUMBER_LABEL, YEAR_LABEL } from "../../redux/GPActionTypes";
import { camelize } from "../../utilities/util";
import { editTrackInfo, setMetadataPopupObj } from "../../redux/library/LibraryActions";

export const EditTrackInfo = () => {
    const dispatch = useDispatch();

    const metadataPopupObj = useSelector(state => state.library.metadataPopupObj);
    const track = metadataPopupObj.obj;

    const [modifiedTrack, setModifiedTrack] = useState({});

    useEffect(()=>{
        const tempModifiedTrack = {
            songId: track.songId
        }
        setModifiedTrack(tempModifiedTrack);
    },[track]);

    const updateModifiedTrack = (event, field) => {
        const target = event.target;
        const tempModifiedTrack = {...modifiedTrack};
        tempModifiedTrack[field] = target.value;
        setModifiedTrack(tempModifiedTrack);
    }

    const initTrackInfoUpdate = () => {
        const tempModifiedTrack = {...modifiedTrack};
        if(Object.keys(tempModifiedTrack).length > 1){
            dispatch(editTrackInfo(tempModifiedTrack, TRACK));
        }
    }

    return(
        <div className="edit-track-info edit-info">
            <div className="header">
                <h3>Edit Track Info</h3>
                <button className="close" onClick={()=>dispatch(setMetadataPopupObj({showMetadataPopup:false}))}>x</button>
            </div>
            <div className="body">
                <div className="track-details">
                    <div className="row">
                        <label>{TITLE_LABEL}</label>
                        <input type="text" defaultValue={track.title} onChange={(event)=>updateModifiedTrack(event,'title')} />
                    </div>
                    <div className="row">
                        <label>{ARTIST_LABEL}</label>
                        <input type="text" defaultValue={track.artist} onChange={(event)=>updateModifiedTrack(event,'artist')} />
                    </div>
                    <div className="row">
                        <label>{ALBUM_LABEL}</label>
                        <input type="text" defaultValue={track.album} onChange={(event)=>updateModifiedTrack(event,'album')} />
                    </div>
                    <div className="row">
                        <label>{ALBUM_ARTIST_LABEL}</label>
                        <input type="text" defaultValue={track.albumArtist} onChange={(event)=>updateModifiedTrack(event,'albumArtist')} />
                    </div>
                    <div className="row">
                        <label>{TRACK_NUMBER_LABEL}</label>
                        <input type="text" defaultValue={track.trackNumber} onChange={(event)=>updateModifiedTrack(event,'trackNumber')} />
                    </div>
                    <div className="row">
                        <label>{YEAR_LABEL}</label>
                        <input type="text" defaultValue={track.year} onChange={(event)=>updateModifiedTrack(event,'year')} />
                    </div>
                    <div className="row">
                        <label>{LANGUAGE_LABEL}</label>
                        <input type="text" defaultValue={track.language} onChange={(event)=>updateModifiedTrack(event,'language')} />
                    </div>
                    <div className="row">
                        <label>{GENRE_LABEL}</label>
                        <input type="text" defaultValue={camelize(track.genre)} onChange={(event)=>updateModifiedTrack(event,'genre')} />
                    </div>
                    <div className="row">
                        <label>{LYRICIST_LABEL}</label>
                        <input type="text" defaultValue={track.lyricist} onChange={(event)=>updateModifiedTrack(event,'lyricist')} />
                    </div>
                    <div className="row">
                        <label>{LABEL_LABEL}</label>
                        <input type="text" defaultValue={track.label} onChange={(event)=>updateModifiedTrack(event,'label')} />
                    </div>
                    <div className="row song-path">
                        <label>{FILE_LOCATION_LABEL}</label>
                        <p>{track.songPath}</p>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="buttons">
                    <button className="g-btn md success beige" onClick={()=>dispatch(setMetadataPopupObj({showMetadataPopup:false}))}>{CANCEL_LABEL}</button>
                    <button className="g-btn md success beige" onClick={initTrackInfoUpdate}>{SAVE_LABEL}</button>
                </div>
            </div>
        </div>
    );
}