import React from "react";
import { Link } from "react-router-dom";
import def_album_art from '../../images/def_album_art.png';
import { ARTIST, ARTIST_LABEL, GP_ARTIST_IMAGE_PATHS_MAP } from "../../redux/GPActionTypes";
import { ThumbnailActionBtn } from "../../ThumbnailActionBtn";

export const ArtistThumb = ({artist}) => {
    return(
        <div className="artist-thumb">
            <div className="artist-thumb-img-div">
                <Link to={`/music/artists/${artist.artistName}`}>
                    {!artist.imgAvl && <img src={def_album_art} alt="no image" />}
                    {artist.imgAvl && <img src={GP_ARTIST_IMAGE_PATHS_MAP[artist.imageSource] +artist.artistName+".jpg"} alt={artist.artistName} />}
                </Link>
                <ThumbnailActionBtn rowList={[]} options={[{label:ARTIST_LABEL, link: `/music/artists/${artist.artistName}`}]} type={ARTIST} obj={artist.artistName} />
            </div>
            <div className="artist-thumb-details">
                <label><Link to={`/music/artists/${artist.artistName}`}>{artist.artistName}</Link></label>
                <label className="track-count">Tracks&nbsp;{artist.count}</label>
            </div>
        </div>
    )
}