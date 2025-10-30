import React, { useEffect, useState } from "react";
import def_album_art from './images/def_album_art.png';

export const GroupedThumbImg4 = ({albumNames, classPrefix}) => {
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
        <div className={classPrefix+"-img-container"}>
            {albumNameList.length > 0 &&
                <div className={classPrefix+"-img"}>
                    {albumNameList.map(albumName =>
                        <img src={`/gp_images/albums/${albumName}.jpg`} alt={albumName} />
                    )}
                </div>
            }
            {albumNameList.length === 0 &&
                <div className={classPrefix+"-no-img"}>
                    <img src={def_album_art} alt="no album" />
                </div>
            }
        </div>
    );
}