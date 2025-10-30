import React from "react";
import { Link } from "react-router-dom";
import def_album_art from '../../images/def_album_art.png';
import { GP_ARTIST_IMAGE_PATHS_MAP } from "../../redux/GPActionTypes";

export const AlbumArtistThumb = ({albumArtist}) => {
    return(
        <div className="album-artist-thumb">
            <div className="album-artist-thumb-img-div">
            <Link to={`/music/album_artists/${albumArtist.artistName}`}>
                {!albumArtist.imgAvl && <img src={def_album_art} />}
                {albumArtist.imgAvl && <img src={GP_ARTIST_IMAGE_PATHS_MAP[albumArtist.imageSource] + albumArtist.artistName+".jpg"} />}
            </Link>
            </div>
            <div className="album-artist-thumb-details">
                <label><Link to={`/music/album_artists/${albumArtist.artistName}`}>{albumArtist.artistName}</Link></label>
                <label className="album-count">Albums&nbsp;{albumArtist.count}</label>
            </div>
        </div>
    )
}