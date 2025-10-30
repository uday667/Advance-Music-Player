import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ARTIST, CURRENT_PAGE, GP_ARTIST_IMAGE_PATHS_MAP, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_YEAR, UPDATE_ARTIST_IMAGE_TEXT, UPDATE_LABEL } from "../../redux/GPActionTypes";
import { fetchAllArtistsDtls, fetchSongsByArtist, uploadArtistImg } from "../../redux/library/LibraryActions";
import { convertDataFileToBase64, fetchArtistDetailsfromWiki, scrolltoId, setCookies } from "../../utilities/util";
import { FilterComp } from "../../FilterComp";
import { TrackList } from "../track/TrackList";
import def_album_art from '../../images/def_album_art.png';

export const Artist = () => {
    const dispatch = useDispatch();
    const { artist } = useParams();

    const artistsDetails = useSelector(state => state.library.artistsDetails);
    let artistTracks = useSelector(state => state.library.artistTracks);
    if(artistTracks.length>0){
        artistTracks = artistTracks.sort((a,b)=>{return a.title>b.title?1:-1});
    }
    const songPlaying = useSelector(state => state.player.songPlaying);
    const playedFrom = useSelector(state => state.player.playedFrom);
    const isPlaying = useSelector(state => state.player.isPlaying);
    const [artistWiki, setArtistWiki] = useState({});
    const [artistWikiImg, setArtistWikiImg] = useState(null);
    const [artistObj, setArtistObj] = useState({});
    const [artistTracksL, setArtistTracksL] = useState([]);
    const [filterTxt, setFilterTxt] = useState(null);
    const [trackListInp, setTrackListInp] = useState(null);
    const [artistImgSrc, setArtistImgSrc] = useState("");
    const [newArtistImgStr, setNewArtistImgStr] = useState(null);
    
    useEffect(()=>{
        setArtistWikiImg(null);
        setArtistWiki({});
        dispatch(fetchSongsByArtist(artist));
        setCookies(CURRENT_PAGE, JSON.stringify({type:ARTIST}));
        fetchWikiData(artist);
    },[artist]);

    useEffect(()=>{
        if(artistsDetails.length>0){
            const artistObj = artistsDetails.find(artistObj => artistObj.artistName===artist);
            setArtistObj(artistObj);
            if(artistObj && artistObj.imageSource)setArtistImgSrc(GP_ARTIST_IMAGE_PATHS_MAP[artistObj.imageSource]);
        }else{
            dispatch(fetchAllArtistsDtls(ARTIST));
        }
    },[artist, artistsDetails]);

    useEffect(()=>{
        setArtistTracksL(artistTracks);
    },[artistTracks]);

    useEffect(()=>{
        if(filterTxt===null){
            setArtistTracksL(artistTracks);
        }else if(filterTxt.length>2){
            let tempArtistTracks = [...artistTracks];
            tempArtistTracks = tempArtistTracks.filter(track => {return track.title.toLowerCase().includes(filterTxt) 
                                                                            || track.album.toLowerCase().includes(filterTxt) 
                                                                            || track.year===filterTxt 
                                                                            || track.genre.toLowerCase().includes(filterTxt)
                                                                    });
            if(tempArtistTracks.length>0){
                setArtistTracksL(tempArtistTracks);
            }else{
                setArtistTracksL([]);
            }
        }
    },[filterTxt]);

    const onSetFilterTxt = (event) => {
        const tempFilterTxt = event.target.value;
        if(tempFilterTxt==="" || tempFilterTxt.length<3){
            setFilterTxt(null);
        }else if(tempFilterTxt.length>2){
            setFilterTxt(tempFilterTxt.toLowerCase());
        }
    }

    useEffect(()=>{
        const tempTrackListInp = {
            playedFrom:{
                pfKey:ARTIST, 
                pfVal:artist,
            },
            showSort: false,
            showLKey: false,
            sortSelectors:[SORT_A_TO_Z,SORT_A_TO_Z_DESC,SORT_YEAR],
            selectedSortBy: SORT_A_TO_Z
        }

        if(artistTracksL){
            if(artistTracksL.length > 6){
                tempTrackListInp.showSort = true;
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 28.5em)'
                }
            }
            if(artistTracksL.length > 20){
                tempTrackListInp.showLKey = true;
                tempTrackListInp.lKeyStyle = {
                    position:'absolute', 
                    visibility:'hidden'
                }
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 30.5em)'
                }
            }
        }

        setTrackListInp(tempTrackListInp);
    },[artistTracksL]);

    const fetchWikiData = async (artist) => {
        const wikiData = await fetchArtistDetailsfromWiki(artist);
        setArtistWiki(wikiData);
        if(wikiData.thumbnail){
            setArtistWikiImg(wikiData.thumbnail.source);
        }
    }

    const scrollToPlaying = ()=>{
        if(isPlaying){
            const trackPlaying = document.getElementsByClassName("text-highlighted-y");
            if(trackPlaying.length>0){
             scrolltoId(trackPlaying[0].id);   
            }
        }
    }

    const handleArtistFileChnage = async (event) => {
        const file = event.target.files[0];
        // console.log("file: ",file);
        // let formData = new FormData();
        // formData.append('file', event.target.value);
        // formData.append('name', 'test')
        //dispatch(uploadArtistImg(artistObj.artistId,formData))
        const fileB64 = await convertDataFileToBase64(file);
        document.getElementById("artist_image").src = fileB64;
        setNewArtistImgStr(fileB64);
        
    }

      const initArtistImgUpload = () => {
        if(newArtistImgStr !== null){
            if(window.confirm("Change picture ?")===true){
                dispatch(uploadArtistImg(artistObj.artistId, newArtistImgStr));
            }
        }else{
            alert("Please select a picture")
        }
      }
    
    return(
        <div className="artist">
            <div className="artist-img-div-container">
                <div className="artist-img-div">
                    {artistObj && artistObj.imgAvl  && <img src={artistImgSrc + artistObj.artistName+".jpg"} id="artist_image" />}
                    {artistObj && !artistObj.imgAvl && artistWikiImg!==null && <img src={artistWikiImg} id="artist_image" />}
                    {artistObj && !artistObj.imgAvl && artistWikiImg===null && <img src={def_album_art} id="artist_image" />}
                    <div className="change-artist-img">
                        <input type="file" onChange={handleArtistFileChnage} title={UPDATE_ARTIST_IMAGE_TEXT} />
                        <button className="g-btn sm success" onClick={initArtistImgUpload}>{UPDATE_LABEL}</button>
                    </div>
                </div>
                <div className="artist-details">
                    <h3>{artist}</h3>
                    {artistTracks!==undefined && artistTracks!==null &&
                        <label>Tracks: {artistTracks.length}</label>
                    }
                    {playedFrom===ARTIST && songPlaying!==undefined && songPlaying!==null && songPlaying.artist.includes(artist) &&
                        <label>Playing:&nbsp;<i onClick={scrollToPlaying} style={{cursor:'pointer',color:'#ef6464'}}>{songPlaying.title}</i>&nbsp;<Link to={`/music/albums/${songPlaying.album}`}>{songPlaying.album!==null?'from '+songPlaying.album:''}</Link></label>
                    }
                    {artistWiki !==null && artistWiki!==undefined && artistWiki["extract"]!==undefined && 
                        <div className="artist-wiki-summary">
                            <p>{artistWiki["extract"]}</p>
                        </div>
                    }
                </div>
            </div>
            <div style={{width:'100%'}}>
                <FilterComp onSetFilterTxt={onSetFilterTxt} />
            </div>
            <div className="artist-track-list">
                {artistTracksL.length > 0 && trackListInp.playedFrom &&
                    <TrackList tracks={artistTracksL} trackListInp={trackListInp} />
                }
            </div>
        </div>
    );
}