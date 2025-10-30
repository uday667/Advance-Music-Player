import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ALBUMS, ALBUMS_LABEL, ALBUM_ARTISTS, ALBUM_ARTISTS_LABEL, ARTISTS, ARTISTS_LABEL, GENRES, GENRES_LABEL, 
    TRACKS_LABEL, TRACKS, LANGUAGES, LANGUAGES_LABEL, ALBUM } from "../redux/GPActionTypes";
import { FilterComp } from "../FilterComp";

export const GroupBand = () => {
    const [selectedBand, setSelectedBand] = useState('');
    const locationL = useLocation();
    useEffect(()=>{
        let uri = locationL.pathname;
        if(uri!==null && uri!==''){
            if(uri.startsWith("/music/tracks")){
                setSelectedBand(TRACKS);
            }else if(uri.startsWith("/music/albums/")){
                setSelectedBand(ALBUM);
            }else if(uri.startsWith("/music/albums")){
                setSelectedBand(ALBUMS);
            }else if(uri.startsWith("/music/album_artists")){
                setSelectedBand(ALBUM_ARTISTS);
            }else if(uri.startsWith("/music/artists")){
                setSelectedBand(ARTISTS);
            }else if(uri.startsWith("/music/genres")){
                setSelectedBand(GENRES);
            }else if(uri.startsWith("/music/languages")){
                setSelectedBand(LANGUAGES);
            }else{
                setSelectedBand('');
            }
        }
    },[locationL]);
    
    return(
        <div className="group-band">
            <div className={selectedBand===TRACKS?"band traks-band group-band-highlight":"band traks-band"}>
                <Link to="/music/tracks"><h3>{TRACKS_LABEL}</h3></Link>
            </div>
            <div className={[ALBUM, ALBUMS].includes(selectedBand)?"band albums-band group-band-highlight":"band albums-band"}>
                <Link to="/music/albums"><h3>{ALBUMS_LABEL}</h3></Link>
            </div>
            <div className={selectedBand===ALBUM_ARTISTS?"band album_artists-band group-band-highlight":"band album_artists-band"}>
                <Link to="/music/album_artists"><h3>{ALBUM_ARTISTS_LABEL}</h3></Link>
            </div>
            <div className={selectedBand===ARTISTS?"band artists-band group-band-highlight":"band artists-band"}>
                <Link to="/music/artists"><h3>{ARTISTS_LABEL}</h3></Link>
            </div>
            <div className={selectedBand===GENRES?"band genres-band group-band-highlight":"band genres-band"}>
                <Link to="/music/genres"><h3>{GENRES_LABEL}</h3></Link>
            </div>
            <div className={selectedBand===LANGUAGES?"band languages-band group-band-highlight":"band languages-band"}>
                <Link to="/music/languages"><h3>{LANGUAGES_LABEL}</h3></Link>
            </div>
            {[TRACKS, ALBUMS, ARTISTS].includes(selectedBand) && <FilterComp isSetToStore={true} placeHolder={selectedBand} />}
        </div>
    );
}