import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { CURRENT_PAGE, GP_ALBUMS_SORT_FIELD_MAPPING, NO_SORT, SOME_PAGE, SORT_YEAR } from "../../redux/GPActionTypes";
import { replace_AndCamelize, setCookies, sortGroupByField } from "../../utilities/util";
import { AlbumThumb } from "./AlbumThumb";
import { SortingContainer } from "../SortingContainer";
import { filterAlbums, sortAlbumKeys } from "./albumUtil";

export const AlbumList = ({albums, albumListInp}) => {

    const globalFilterText = useSelector(state => state.library.globalFilterText);
    
    const [sortedAlbums, setSortedAlbums] = useState({});
    const [filteredAlbums, setFilteredAlbums] = useState({});
    const [albumListKeys, setAlbumListKeys] = useState([]);
    const [sortBy, setSortBy] = useState(SORT_YEAR);
    const [isFilterActive, setFilterActive] = useState(false);

    useEffect(()=>{
        setCookies(CURRENT_PAGE, JSON.stringify({type:SOME_PAGE}));
    },[]);

    useEffect(()=>{
        albumListInp && albumListInp.selectedSortBy ? setSortBy(albumListInp.selectedSortBy) : setSortBy(NO_SORT);
    },[albumListInp]);

    useEffect(()=>{
        if(sortBy && albums.length>0){
            setAlbumListKeys([]);
            setSortedAlbums(sortGroupByField(albums,GP_ALBUMS_SORT_FIELD_MAPPING[sortBy]))
        }
    },[sortBy]);

    useEffect(()=>{
        if(Object.keys(sortedAlbums).length>0){
            setAlbumListKeys(sortAlbumKeys(sortBy, sortedAlbums));
            setFilteredAlbums(sortedAlbums);
        }
    },[sortedAlbums]);

    useEffect(() => {
        if (globalFilterText && globalFilterText.length > 2) {
            setFilteredAlbums(filterAlbums(globalFilterText, sortedAlbums, albumListKeys));
            setFilterActive(true);
        } else {
            setFilteredAlbums(sortedAlbums)
            setFilterActive(false);
        }
    }, [globalFilterText,albumListKeys]);
    return(
        <div className="album-list">
            {albumListInp.showSort && !isFilterActive && <SortingContainer sortListKeys={albumListKeys} showLKey={albumListInp.showLKey} setSortBy={setSortBy} sortBy={sortBy} sortSelectors={albumListInp.sortSelectors} showSortByLabel={albumListInp.showSortByLabel} />}
            <div className="albums" style={albumListInp.styles?albumListInp.styles:{}}>
                {albumListKeys && albumListKeys.length > 0 && albumListKeys.map((lKey, index) =>
                        <>
                            {!isFilterActive && albumListInp.showLKey && <label id={"lKey" + lKey} className="album-lKey" key={index}>{replace_AndCamelize(lKey)}</label>}
                            {filteredAlbums[lKey] !== undefined && filteredAlbums[lKey].length > 0 && filteredAlbums[lKey].map((album, albumIndex) =>
                                <AlbumThumb album={album} key={albumIndex} />
                            )}
                        </>
                )}
            </div>
        </div>
    );
}