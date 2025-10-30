import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchAlbumlistOfAA, fetchAllAlbumArtistsDtls, uploadArtistImg } from "../../redux/library/LibraryActions";
import { convertDataFileToBase64, fetchArtistDetailsfromWiki, scrollToPlaying } from "../../utilities/util";
import { AlbumThumb } from "../album/AlbumThumb";
import { ALBUM_ARTIST, GP_ARTIST_IMAGE_PATHS_MAP, UPDATE_ARTIST_IMAGE_TEXT, UPDATE_LABEL } from "../../redux/GPActionTypes";
import def_album_art from '../../images/def_album_art.png';

export const AlbumArtist = () => {
    const {albumArtist} = useParams();
    const dispatch = useDispatch();
    let albumListOfAA = useSelector(state => state.library.albumListOfAA);//AA -> Album Artist
    if(albumListOfAA.length>0){
        albumListOfAA = albumListOfAA.sort((a,b)=>{return a.year>b.year?-1:1});
    }
    const albumArtistsDetails = useSelector(state => state.library.albumArtistsDetails);
    const songPlaying = useSelector(state => state.player.songPlaying);
    const playedFrom = useSelector(state => state.player.playedFrom);
    const [artistWiki, setArtistWiki] = useState({});
    const [artistWikiImg, setArtistWikiImg] = useState(null);
    const [albumArtistObj, setAlbumArtistObj] = useState({});
    //const [albumCount, setAlbumCount] = useState(0);
    const [newArtistImgStr, setNewArtistImgStr] = useState(null);
    
    useEffect(()=>{
        setArtistWikiImg(null);
        setArtistWiki({});
        dispatch(fetchAlbumlistOfAA(albumArtist));
        fetchWikiData(albumArtist);
    },[albumArtist]);

    // useEffect(()=>{
    //     if(albumListOfAA){
    //         let tempAlbumCount = 0;
    //         albumListOfAA.forEach(element => {
    //             if(element.genreType === MULTI_GENRE){
    //                 tempAlbumCount+= element.genres.split(",").length;
    //             }else{
    //                 tempAlbumCount++;
    //             }
    //         });
    //         setAlbumCount(tempAlbumCount);
    //     }
    // },[albumListOfAA])

    useEffect(()=>{
        if(albumArtistsDetails.length>0){
            setAlbumArtistObj(albumArtistsDetails.find(albumArtistObj => albumArtistObj.artistName===albumArtist));
        }else{
            dispatch(fetchAllAlbumArtistsDtls(ALBUM_ARTIST));
        }
    },[albumArtist, albumArtistsDetails]);

    const fetchWikiData = async (artist) => {
        const wikiData = await fetchArtistDetailsfromWiki(artist);
        setArtistWiki(wikiData);
        if(wikiData.thumbnail){
            setArtistWikiImg(wikiData.thumbnail.source);
        }
    }

    const handleArtistFileChnage = async (event) => {
        const file = event.target.files[0];
        const fileB64 = await convertDataFileToBase64(file);
        document.getElementById("artist_image").src = fileB64;
        setNewArtistImgStr(fileB64);
        
    }

    const initArtistImgUpload = () => {
        if(newArtistImgStr !== null){
            if(window.confirm("Change picture ?")===true){
                dispatch(uploadArtistImg(albumArtistObj.artistId, newArtistImgStr));
            }
        }else{
            alert("Please select a picture")
        }
    }

    return(
        <div className="album-artist">
            {albumArtistObj &&
                <>
                    <div className="album-artist-img-div-container">
                        <div className="album-artist-img-div">
                            {albumArtistObj.imgAvl  && <img id="artist_image" src={GP_ARTIST_IMAGE_PATHS_MAP[albumArtistObj.imageSource] + albumArtistObj.artistName+".jpg"} alt={albumArtistObj.artistName} />}
                            {!albumArtistObj.imgAvl && artistWikiImg!==null &&  <img id="artist_image" src={artistWikiImg} alt={albumArtistObj.artistName} />}
                            {!albumArtistObj.imgAvl && artistWikiImg===null &&<img id="artist_image" src={def_album_art} alt={albumArtistObj.artistName} />}
                            <div className="change-artist-img">
                                <input type="file" onChange={handleArtistFileChnage} title={UPDATE_ARTIST_IMAGE_TEXT} />
                                <button className="g-btn sm success" onClick={initArtistImgUpload}>{UPDATE_LABEL}</button>
                            </div>
                        </div>
                        <div className="album-artist-details">
                            <h3>{albumArtist}</h3>
                            <label>Albums: {albumArtistObj.count}</label>
                            {playedFrom===ALBUM_ARTIST && songPlaying!==undefined && songPlaying!==null && songPlaying.albumArtist.includes(albumArtist) &&
                                <label>Playing:&nbsp;<i onClick={scrollToPlaying} style={{cursor:'pointer',color:'#ef6464'}}>{songPlaying.title}</i>&nbsp;<Link to={`/music/albums/${songPlaying.album}`}>{songPlaying.album!==null?'from '+songPlaying.album:''}</Link></label>
                            }
                            {artistWiki !==null && artistWiki!==undefined && artistWiki["extract"]!==undefined && 
                                <div className="album-artist-wiki-summary">
                                    <p>{artistWiki["extract"]}</p>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="album-artist-albums">
                        {albumListOfAA.length>0 && albumListOfAA.map((album, index) =>
                            <AlbumThumb album={album} key={index} />
                        )}
                    </div>
                </>
            }
        </div>
    );
}