import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import def_album_art from '../../images/def_album_art.png';

export const AlbumThumbsGrouped = ({albums}) => {
    const [albumArr, setAlbumArr] = useState([]);
    useEffect(()=>{
        const tempAlbumArr = albums;//.splice(0, 6);
        setAlbumArr(tempAlbumArr);
    },[albums])
    return(
        <div className="album-thumbs-grouped">
            {albumArr.length>0 && albumArr.map((album, index)=>
                <>
                    <div className="album-thumb-img-div">
                        <Link to={`/music/albums/${album.albumName}`}>
                            {album.albumImgAvl && <img src={"/gp_images/albums/" + album.albumName + ".jpg"} alt={album.albumName} />}
                            {!album.albumImgAvl && <img src={def_album_art} alt="no image" />}
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}