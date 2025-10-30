import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ALBUMS_LABEL, CURRENT_PAGE, GENRES_COUNT_LABEL, GENRE_COUNT, HISTORY_COUNT, HISTORY_COUNT_LABEL, LIBRARY_COUNT, LIBRARY_COUNT_LABEL, MUSIC, POPULAR_COMPOSERS, THIS_MONTH_COUNT, THIS_MONTH_COUNT_LABEL, TIME_PLAYED_THIS_MONTH, TIME_PLAYED_THIS_MONTH_LABEL, TOTAL_TIME_PLAYED, TOTAL_TIME_PLAYED_LABEL, TRACKS_LABEL } from "../redux/GPActionTypes";
import { fetchBuildStatus, fetchMostPlayedData } from "../redux/library/LibraryActions";
import { AlbumThumb } from "./album/AlbumThumb";
import { AlbumArtistThumb } from "./artist/AlbumArtistThumb";
import { ArtistThumb } from "./artist/ArtistThumb";
import { setCookies } from "../utilities/util";
export const Music = () => {
    const dispatch = useDispatch();
    const mostPlayedData = useSelector(state => state.library.mostPlayedData);
    const buildStatus = useSelector(state => state.library.buildStatus);
    const [buildStatusL, setBuildStatusL] = useState(null);
    const [artists, setArtists] = useState([]);
    const [albumArtists, setAlbumArtists] = useState([]);
    const [albums, setAlbums] = useState([]);

    useEffect(()=>{
        dispatch(fetchMostPlayedData());
        dispatch(fetchBuildStatus());
        setCookies(CURRENT_PAGE, JSON.stringify({type:MUSIC}));
    },[]);

    useEffect(()=>{
        if(mostPlayedData["ARTISTS"]!==undefined){
            setArtists(mostPlayedData["ARTISTS"]);
        }
        if(mostPlayedData["ALBUM_ARTISTS"]!==undefined){
            setAlbumArtists(mostPlayedData["ALBUM_ARTISTS"]);
        }
        if(mostPlayedData["ALBUMS"]!==undefined){
            setAlbums(mostPlayedData["ALBUMS"]);
        }
    },[mostPlayedData]);

    useEffect(()=>{
        let tempBuildStatusL = {};
        if(buildStatus.length>0){
            buildStatus.forEach(element => {
                tempBuildStatusL[element.name]=element.value;
            });
            setBuildStatusL(tempBuildStatusL);
        }
    },[buildStatus]);

    return(
        <div className="music">
            <h3>Popular Artists</h3>
            <div className="artists-list">
                {artists.length>0 && artists.map((artist, index)=>
                    <ArtistThumb artist={artist} key={index} />
                )}
            </div>
            <h3>Most Played Albums</h3>
            <div className="albums-list">
                {albums.length>0 && albums.map((album, index)=>
                    <AlbumThumb album={album} key={index} />
                )}
            </div>
            <h3>{POPULAR_COMPOSERS}</h3>
            <div className="album-artists-list">
                {albumArtists.length>0 && albumArtists.map((albumArtist, index)=>
                    <AlbumArtistThumb albumArtist={albumArtist} key={index} />
                )}
            </div>
            <div className="statisticts">
                {buildStatusL!==null &&
                    <div className="groups">
                        <div className="group">
                            <Link to="/music/tracks"><h1>{TRACKS_LABEL}</h1></Link>
                            <Link to="/music/tracks"><h2>{buildStatusL.TOTAL_TRACKS}</h2></Link>
                        </div>
                        <div className="group">
                            <Link to="/music/albums"><h1>{ALBUMS_LABEL}</h1></Link>
                            <Link to="/music/albums"><h2>{buildStatusL.ALBUM_COUNT}</h2></Link>
                        </div>
                        <div className="group">
                            <Link to="/music/album_artists"><h1>Album Artists</h1></Link>
                            <Link to="/music/album_artists"><h2>{buildStatusL.ALBUM_ARTIST_COUNT}</h2></Link>
                        </div>
                        <div className="group">
                            <Link to="/music/artists"><h1>Artists</h1></Link>
                            <Link to="/music/artists"><h2>{buildStatusL.ARTIST_COUNT}</h2></Link>
                        </div>
                        {mostPlayedData[GENRE_COUNT]!==undefined &&
                            <div className="group">
                                <h2>{GENRES_COUNT_LABEL}</h2>
                                <h2>{mostPlayedData[GENRE_COUNT]}</h2>
                            </div>
                        }
                        {mostPlayedData[HISTORY_COUNT]!==undefined &&
                            <div className="group">
                                <h2>{HISTORY_COUNT_LABEL}</h2>
                                <h2>{mostPlayedData[HISTORY_COUNT]}</h2>
                            </div>
                        }
                        {mostPlayedData[LIBRARY_COUNT]!==undefined && mostPlayedData[HISTORY_COUNT]!==undefined &&
                            <div className="group">
                                <h2>{LIBRARY_COUNT_LABEL}</h2>
                                <h2>{mostPlayedData[LIBRARY_COUNT] - mostPlayedData[HISTORY_COUNT]}</h2>
                            </div>
                        }
                        {mostPlayedData[THIS_MONTH_COUNT]!==undefined &&
                            <div className="group">
                                <h2>{THIS_MONTH_COUNT_LABEL}</h2>
                                <h2>{mostPlayedData[THIS_MONTH_COUNT]}</h2>
                            </div>
                        }
                        {mostPlayedData[TOTAL_TIME_PLAYED]!==undefined &&
                            <div className="group">
                                <h2>{TOTAL_TIME_PLAYED_LABEL}</h2>
                                <h2>{Math.floor(mostPlayedData[TOTAL_TIME_PLAYED]/(60*60))} hrs</h2>
                            </div>
                        }
                        <div className="group"></div>
                        {mostPlayedData[TIME_PLAYED_THIS_MONTH]!==undefined &&
                            <div className="group">
                                <h2>{TIME_PLAYED_THIS_MONTH_LABEL}</h2>
                                <h2>{Math.floor(mostPlayedData[TIME_PLAYED_THIS_MONTH]/(60*60))} hrs</h2>
                            </div>
                        }
                    </div>
                }
            </div>
        </div>
    );
}