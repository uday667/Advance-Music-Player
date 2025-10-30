import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ALBUM_ARTIST, CURRENT_PAGE, SOME_PAGE, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_COUNT_ALBUMS } from "../../redux/GPActionTypes";
import { fetchAllAlbumArtistsDtls } from "../../redux/library/LibraryActions";
import { setCookies, sortGroupByField } from "../../utilities/util";
import { AlbumArtistThumb } from "../artist/AlbumArtistThumb";
import { SortingContainer } from "../SortingContainer";

export const AlbumArtistList = () => {
    const dispatch = useDispatch();
    let albumArtistsDetailsFS = useSelector(state => state.library.albumArtistsDetails);
    const [albumArtistsDetails, setAlbumArtistsDetails] = useState([]);
    const [albumArtistsDetailsList, setAlbumArtistsDetailsList] = useState({});
    const [albumArtistsDetailsListKeys, setAlbumArtistsDetailsListKeys] = useState([]);
    const [sortBy, setSortBy] = useState(SORT_COUNT_ALBUMS);

    useEffect(()=>{
        dispatch(fetchAllAlbumArtistsDtls(ALBUM_ARTIST));
        setCookies(CURRENT_PAGE, JSON.stringify({type:SOME_PAGE}));
    },[]);

    useEffect(()=>{
        if(albumArtistsDetailsFS.length>0){
            if(sortBy===SORT_A_TO_Z || sortBy===SORT_A_TO_Z_DESC){
                setAlbumArtistsDetailsList(sortGroupByField(albumArtistsDetailsFS,'artistName'));
            }
            if(sortBy===SORT_COUNT_ALBUMS){
                let tempAlbumArtistsDetails = [...albumArtistsDetailsFS];
                tempAlbumArtistsDetails = tempAlbumArtistsDetails.sort((a, b)=>a.count > b.count?-1:1);
                //tempAlbumArtistsDetails = tempAlbumArtistsDetails.sort((a, b)=>b.imgAvl?1:-1);
                setAlbumArtistsDetails(tempAlbumArtistsDetails);
            }
        }
    },[albumArtistsDetailsFS, sortBy]);

    useEffect(()=>{
        if(Object.keys(albumArtistsDetailsList).length>0){
            let tempAlbumArtistsDetailsListKeys = Object.keys(albumArtistsDetailsList);
            if(sortBy===SORT_A_TO_Z_DESC){
                tempAlbumArtistsDetailsListKeys.sort((a,b)=>{return a>b?-1:1})
            }
            setAlbumArtistsDetailsListKeys(tempAlbumArtistsDetailsListKeys);
        }
    },[albumArtistsDetailsList]);

    return(
        <>
            <SortingContainer sortListKeys={albumArtistsDetailsListKeys} setSortBy={setSortBy} sortBy={sortBy} sortSelectors={[SORT_A_TO_Z,SORT_A_TO_Z_DESC, SORT_COUNT_ALBUMS]} showSortByLabel={true} />
            <div className="album-artists-list">
                {sortBy===SORT_COUNT_ALBUMS && albumArtistsDetails!==null && albumArtistsDetails!==undefined && albumArtistsDetails.length>0 && albumArtistsDetails.map((albumArtist, index) =>
                    <AlbumArtistThumb albumArtist={albumArtist} key={index} />
                )}
                {sortBy!==SORT_COUNT_ALBUMS && albumArtistsDetailsListKeys !== undefined && albumArtistsDetailsListKeys.length > 0 && albumArtistsDetailsListKeys.map((lKey, index) =>
                    <>
                        <label id={"lKey" + lKey} className="album-artists-lKey">{lKey}</label>
                        {albumArtistsDetailsList[lKey] !== undefined && albumArtistsDetailsList[lKey].length > 0 && albumArtistsDetailsList[lKey].map((albumArtist, albumArtistIndex) =>
                            <AlbumArtistThumb albumArtist={albumArtist} key={albumArtistIndex} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}