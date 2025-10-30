import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import def_album_art from '../../images/def_album_art.png';
import { ALBUM, CURRENT_PAGE, EDIT_INFO_LABEL, MULTI_LINGUAL, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_TRACK_NUMBER, TRACKS_LABEL } from ".././../redux/GPActionTypes";
import { Lyrics } from "../lyrics/LyricsV2";
import { fetchAlbum, fetchAlbumTacks, setMetadataPopupObj } from "../../redux/library/LibraryActions";
import { camelize, setCookies } from "../../utilities/util";
import { TrackList } from "../track/TrackList";
import { SplitAndLink } from "../../utilities/SplitAndLink";
import { RiEditLine } from 'react-icons/ri';
import { LIBRARY_EDIT_ALBUM_INFO_SUCCESS } from "../../redux/library/LibraryActionTypes";

export const Album = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { albumName, language } = useParams();
    const album = useSelector(state => state.library.album);
    const libPhase = useSelector(state => state.library.phase);
    let albumTracks = useSelector(state => state.library.albumTracks);
    if(albumTracks.length>0){
        albumTracks = albumTracks.sort((a,b) => a.trackNumber - b.trackNumber);
    }

    const [trackListInp, setTrackListInp] = useState({});

    useEffect(()=>{
        dispatch(fetchAlbumTacks(albumName, language));
        dispatch(fetchAlbum(albumName));
        setCookies(CURRENT_PAGE, JSON.stringify({type:ALBUM}));
    },[albumName, language]);

    useEffect(()=>{
        const tempTrackListInp = {
            playedFrom:{
                pfKey:ALBUM, 
                pfVal:albumName,
            },
            showSort: true,
            showLKey: false,
            sortSelectors:[SORT_TRACK_NUMBER,SORT_A_TO_Z,SORT_A_TO_Z_DESC],
            selectedSortBy:SORT_TRACK_NUMBER
        }

        if(albumTracks){
            if(albumTracks.length > 5){
                tempTrackListInp.showSort = true;
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 27.2em)'
                }
            }
        }

        setTrackListInp(tempTrackListInp);
    },[albumTracks]);

    useEffect(()=>{
        if(libPhase === LIBRARY_EDIT_ALBUM_INFO_SUCCESS 
            && albumName && album && album.albumName 
            && album.albumName !== albumName){
            navigate(`/albums/${album.albumName}`);
        }
    },[libPhase]);

    const onSetShowMetadataPopup = () => {
        const tempAlbum = {...album};
        tempAlbum.albumTracks = [...albumTracks];
        const metadataPopupObj = {
            showMetadataPopup : true,
            obj:tempAlbum,
            objType:ALBUM
        }
        dispatch(setMetadataPopupObj(metadataPopupObj));
    }

    return(
        <div className="album">
            {album["albumName"]!==undefined && <div className="album-img-div-container">
                <div className="album-img-div">
                    {album.albumImgAvl && <img src={"/gp_images/albums/"+album.albumName+".jpg"} alt={album.albumName} />}
                    {!album.albumImgAvl && <img src={def_album_art} alt="no image" />}
                </div>
                    <div className="album-details">
                        <h3>{album.albumName}</h3>
                        <Link to={`/music/album_artists/${album.albumArtist}`} >
                            <label style={{cursor:'pointer'}}>{album.albumArtist}</label>
                        </Link>
                        {album.languageType !== MULTI_LINGUAL &&<label>{album.year} - <SplitAndLink str={album.language} url={`/music/languages/`} /></label>}
                        {albumTracks && <label>{albumTracks.length}&nbsp;{TRACKS_LABEL}</label> }
                        {album.languageType === MULTI_LINGUAL &&
                            <>
                                <label>{album.year} - {language ? <Link to={`/music/languages/${language}`}>{camelize(language)}</Link> : 'All'}</label>
                                <div className="album-multi-genre-select">
                                    <Link className={!language?"selected":""} to={`/music/albums/${album.albumName}`}>All</Link>
                                    {album.languages.split(",").map(lang=>
                                        <Link className={language === lang ? "selected":""} to={`/music/albums/${album.albumName}/${lang}`}>{camelize(lang)}</Link>
                                    )}
                                </div>
                            </>
                        }
                        <div className="edit-info-btn">
                            <button className="g-btn md info beige flex-align-center column-gap-5" onClick={onSetShowMetadataPopup}><RiEditLine />{EDIT_INFO_LABEL}</button>
                        </div>
                    </div>
                <div className="album-lyrics">
                    <Lyrics />
                </div>
            </div>}
            <div className="album-track-list">
                <TrackList trackListInp={trackListInp} tracks={albumTracks}  />
            </div>
        </div>
    );
}