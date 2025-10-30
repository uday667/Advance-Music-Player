import React, { useEffect, useState } from "react";
import { editAlbumInfo, setMetadataPopupObj } from "../../redux/library/LibraryActions";
import { useDispatch, useSelector } from "react-redux";
import def_album_art from '../../images/def_album_art.png';
import { ALBM_ART_IMG_EDIT, ALBUM, ALBUM_ART, ALBUM_ARTIST_LABEL, ALBUM_LABEL, CANCEL_LABEL, GENRE_LABEL, LABEL_LABEL, 
    LANGUAGE_LABEL, LYRICIST_LABEL, MULTI_LINGUAL, MULTI_LINGUAL_LABEL, SAVE_LABEL, TOTAL_TRACKS_LABEL, TRACK, TRACKS, 
    YEAR_LABEL } from "../../redux/GPActionTypes";
import { convertDataFileToBase64, selectFocusedText, trimInputText } from "../../utilities/util";

export const EditAlbumInfo = () => {
    const dispatch = useDispatch();

    const metadataPopupObj = useSelector(state => state.library.metadataPopupObj);
    const album = metadataPopupObj.obj;
    const albumTracks = album.albumTracks;

    const [modifiedAlbum, setModifiedAlbum] = useState({});
    const [isMutltiLingual, setIsMultiLingual] = useState(false)

    useEffect(()=>{
        const tempModifiedAlbum = {
            albumId: album.albumId
        }
        setModifiedAlbum(tempModifiedAlbum);
        if(album && album.languageType === MULTI_LINGUAL){
            setIsMultiLingual(true);
        }else{
            setIsMultiLingual(false);
        }
    },[album]);

    const updateModifiedAlbum = async (event, field, type, songId) => {
        const target = event.target;
        let targetValue = "";
        if(target.type !== "file"){
            targetValue = target.value.trim();
        }
        const tempModifiedAlbum = {...modifiedAlbum};
        if(type === ALBUM){
            tempModifiedAlbum[field] = targetValue;
        }else if(type === TRACK){
            let tempAlbumTracks = tempModifiedAlbum.albumTracks;
            let track = {};
            if(!tempAlbumTracks){
                tempAlbumTracks = [];
                track[field] = targetValue;
                track['songId'] = songId;
                tempAlbumTracks.push(track);
            }else{
                track = tempAlbumTracks.find(elem => {return elem.songId === songId});
                if(track){
                    track[field] = targetValue;
                    tempAlbumTracks.forEach((element,i) => {
                        if(element.songId === songId){
                            tempAlbumTracks[i] = track;
                        }
                    });
                }else{
                    track = {};
                    track[field] = targetValue;
                    track['songId'] = songId;
                    tempAlbumTracks.push(track);
                }
            }
            tempModifiedAlbum["albumTracks"] = tempAlbumTracks;
        }else if(type === TRACKS){
            let tempAlbumTracks = [];//= [...tempModifiedAlbum.albumTracks];
            if(tempModifiedAlbum.albumTracks){
                tempAlbumTracks = [...tempModifiedAlbum.albumTracks]
            }
            const albumTracks1 = [...albumTracks];
            let track;
            let trackIndex;
            albumTracks1.forEach(elem => {
                if(tempAlbumTracks){
                    track = tempAlbumTracks.find(tTrack => {return tTrack.songId === elem.songId});
                }
                if(track){
                    trackIndex = tempAlbumTracks.findIndex(elem1=> elem1.songId === track.songId);
                    track[field] = targetValue;
                    tempAlbumTracks[trackIndex] = track;
                }else{
                    track = {
                        songId : elem.songId,
                    }
                    track[field] = targetValue;
                    tempAlbumTracks.push(track);
                }
            });
            tempModifiedAlbum["albumTracks"] = tempAlbumTracks;
        }else if(type === ALBUM_ART){
            const file = event.target.files[0];
            const fileB64 = await convertDataFileToBase64(file);
            tempModifiedAlbum[field] = fileB64;
            tempModifiedAlbum["albumImgAvl"] = true;
            document.getElementById(ALBM_ART_IMG_EDIT).src = fileB64;
        }
        setModifiedAlbum(tempModifiedAlbum);
    }



    const initAlbumInfoUpdate = () => {
        const tempModifiedAlbum = {...modifiedAlbum};
        if(Object.keys(tempModifiedAlbum).length > 1){
            dispatch(editAlbumInfo(tempModifiedAlbum));
        }
    }

    const handleMultiLingualChkboxChange = (event) => {
        if(event.target.checked){
            setIsMultiLingual(true);
        }else{
            setIsMultiLingual(false);
        }
    }

    return(
        <div className="edit-album-info edit-info">
            <div className="header">
                <h3>Edit Album Info</h3>
                <button className="close" onClick={()=>dispatch(setMetadataPopupObj({showMetadataPopup:false}))}>x</button>
            </div>
            <div className="body">
                <div className="album-details">
                    <div className="row">
                        <label>{ALBUM_LABEL}</label>
                        <input type="text" defaultValue={album.albumName} onChange={(event)=>updateModifiedAlbum(event,'albumName',ALBUM)} />
                    </div>
                    <div className="row" style={{gridRow:'span 5',marginRight:'-5',position:"relative", paddingTop:10, maxWidth:250,maxHeight:250}}>
                        {album.albumImgAvl && <img src={"/gp_images/albums/"+album.albumName+".jpg"} id={ALBM_ART_IMG_EDIT} alt={album.albumName} />}
                        {!album.albumImgAvl && <img src={def_album_art} id={ALBM_ART_IMG_EDIT} alt="no image" />}
                        <div style={{display:'grid',rowGap:10, margin:'5px 0'}}>
                            <label>Change Album Art</label>
                            <input type="file" onChange={(event)=>updateModifiedAlbum(event,'albumArt',ALBUM_ART)} style={{cursor:'pointer'}} />
                        </div>
                    </div>
                    <div className="row">
                        <label>{ALBUM_ARTIST_LABEL}</label>
                        <input type="text" defaultValue={album.albumArtist} onChange={(event)=>updateModifiedAlbum(event,'albumArtist',ALBUM)} />
                    </div>
                    <div className="row">
                        <label>{GENRE_LABEL}</label>
                        <input type="text" defaultValue={album.genre} onChange={(event)=>updateModifiedAlbum(event,'genre',ALBUM)} />
                    </div>
                    <div className="row">
                        <label>{YEAR_LABEL}</label>
                        <input type="text" defaultValue={album.year} onChange={(event)=>updateModifiedAlbum(event,'year',ALBUM)} />
                    </div>
                    <div className="row">
                        <label>{LANGUAGE_LABEL}</label>
                        <input type="text" defaultValue={album.language} onChange={(event)=>updateModifiedAlbum(event,'language',ALBUM)} />
                    </div>
                    <div className="row">
                        <label>{TOTAL_TRACKS_LABEL}</label>
                        <input type="text" defaultValue={album.totaltracks} onChange={(event)=>updateModifiedAlbum(event,'totaltracks',ALBUM)} />
                    </div>
                    <div className="row">
                        <label>{LYRICIST_LABEL}</label>
                        <input type="text" defaultValue={albumTracks && albumTracks.length>0 ? albumTracks[0].lyricist:""} onChange={(event)=>updateModifiedAlbum(event,'lyricist',TRACKS)} />
                    </div>
                    <div className="row">
                        <label>{LABEL_LABEL}</label>
                        <input type="text" defaultValue={albumTracks && albumTracks.length>0 ? albumTracks[0].label:""} onChange={(event)=>updateModifiedAlbum(event,'label',TRACKS)} />
                    </div>
                    <div className="row" style={{display: 'flex',flexDirection: 'row',alignItems: 'end',columnGap: 10, position:'relative'}}>
                        <input type="checkbox" checked={isMutltiLingual} className="custom-checkbox" onChange={(event)=>handleMultiLingualChkboxChange(event)} />
                        <label>{MULTI_LINGUAL_LABEL}</label>
                    </div>
                    <div className="row" style={{gridColumn:'span 2',marginTop:15}}>
                        <div className="album-track-details">
                            <div className="header">
                                <div>
                                    <label>Track</label>
                                </div>
                                <div>
                                    <label>Title</label>
                                </div>
                                <div>
                                    <label>Artist</label>
                                </div>
                            </div>
                            <div className={isMutltiLingual?'body multi-lingual':'body'} style={{marginTop:10}}>
                                {albumTracks && albumTracks.map((track,i)=>
                                    <>
                                        <div>
                                            <input defaultValue={track.trackNumber} style={{width:'4em'}} onChange={(event)=>updateModifiedAlbum(event,'trackNumber',TRACK, track.songId)} />
                                        </div>
                                        <div>
                                            <input defaultValue={track.title} onChange={(event)=>updateModifiedAlbum(event,'title',TRACK, track.songId)} />
                                        </div>
                                        <div>
                                            <input defaultValue={track.artist} onChange={(event)=>{updateModifiedAlbum(event,'artist',TRACK, track.songId);trimInputText(event)}} onFocus={(event)=>selectFocusedText(event)} />
                                        </div>
                                        {isMutltiLingual &&
                                            <div>
                                                <input defaultValue={track.language} onChange={(event)=>updateModifiedAlbum(event,'language',TRACK, track.songId)} />
                                            </div>
                                        }
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="buttons">
                    <button className="g-btn md success beige" onClick={()=>dispatch(setMetadataPopupObj({showMetadataPopup:false}))}>{CANCEL_LABEL}</button>
                    <button className="g-btn md success beige" onClick={initAlbumInfoUpdate}>{SAVE_LABEL}</button>
                </div>
            </div>
        </div>
    );
}