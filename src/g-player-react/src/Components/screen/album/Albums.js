import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CURRENT_PAGE, SOME_PAGE, SORT_ARTIST, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_LANGUAGE, SORT_MULTI_LINGUAL, SORT_YEAR } from "../../redux/GPActionTypes";
import { fetchAllAlbums } from "../../redux/library/LibraryActions";
import { setCookies } from "../../utilities/util";
import { Spinner } from "../../utilities/Spinner";
import { AlbumList } from "./AlbumList";

export const Albums = () => {
    const dispatch = useDispatch();

    let albums = useSelector(state => state.library.albums);
    const [albumListInp, setAlbumListInp] = useState({});

     useEffect(()=>{
         if(albums.length === 0){
            dispatch(fetchAllAlbums());
         }
     },[albums]);

    useEffect(()=>{
        setCookies(CURRENT_PAGE, JSON.stringify({type:SOME_PAGE}));
    },[]);

    useEffect(()=>{
        const tempAlbumListInp = {
            showSort:true,
            showLKey:true,
            selectedSortBy : SORT_YEAR,
            showSortByLabel:true,
            sortSelectors : [SORT_A_TO_Z,SORT_A_TO_Z_DESC,SORT_YEAR,SORT_ARTIST,SORT_LANGUAGE,SORT_MULTI_LINGUAL]
        }
        setAlbumListInp(tempAlbumListInp);
    },[albums]);


    return(
        <>
            <div className="albums-container">
                {albums && albums.length > 0 && Object.keys(albumListInp).length > 0 && 
                    <AlbumList albums={albums} albumListInp={albumListInp} />
                }
            </div>
            <Spinner />
        </>
    );
}