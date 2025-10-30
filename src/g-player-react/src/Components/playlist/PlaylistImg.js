import React, { useEffect, useState } from "react";
import def_album_art from '../images/def_album_art.png';
import { Link } from "react-router-dom";

export const PlaylistImg = ({albumNames, link}) => {
    const [albumNameList, setAlbumNameList] = useState([]);

    useEffect(()=>{
        if(albumNames && albumNames.length > 0){
            const tempAlbumNameList = albumNames.slice(0,4);
            setAlbumNameList(tempAlbumNameList);
        }else{
            setAlbumNameList([]);
        }
    },[albumNames])
    return (
        <div className="playlist-img-container">
            {albumNameList.length > 0 &&
                <div className="playlist-img">
                    {link && albumNameList.map((albumName, i) =>
                        <Link key={i} to={`/music/albums/${albumName}`}>
                            <img src={`/gp_images/albums/${albumName}.jpg`} alt={albumName} />
                        </Link>
                    )}
                    {!link && albumNameList.map((albumName, i) =>
                        <img src={`/gp_images/albums/${albumName}.jpg`} key={i} alt={albumName} />
                    )}
                </div>
            }
            {albumNameList.length === 0 &&
                <div className="playlist-no-img">
                    <img src={def_album_art} alt="no image" />
                </div>
            }
        </div>
    );
}