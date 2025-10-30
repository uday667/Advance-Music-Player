import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ARTIST, ARTISTS, CURRENT_PAGE, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_COUNT_TRACKS } from "../../redux/GPActionTypes";
import { fetchAllArtistsDtls } from "../../redux/library/LibraryActions";
import { setCookies, sortGroupByField } from "../../utilities/util";
import { SortingContainer } from "../SortingContainer";
import { ArtistThumb } from "./ArtistThumb";
import { filterArtistDetails, filterArtistDetailsList } from "./artistUtil";

export const ArtistsList = () => {
    const dispatch = useDispatch();
    let artistsDetailsFS = useSelector(state => state.library.artistsDetails);
    const globalFilterText = useSelector(state => state.library.globalFilterText);
    const [artistsDetails, setArtistsDetails] = useState([]);
    const [filteredArtistsDetails, setFilteredArtistsDetails] = useState([]);
    const [artistsDetailsList, setArtistsDetailsList] = useState({});
    const [filteredrtistsDetailsList, setFilteredArtistsDetailsList] = useState({});
    const [artistsDetailsListKeys, setArtistsDetailsListKeys] = useState([]);
    const [sortBy, setSortBy] = useState(SORT_COUNT_TRACKS);
    const [isFilterActive, setFilterActive] = useState(false);
    
    useEffect(()=>{
        dispatch(fetchAllArtistsDtls(ARTIST));
        setCookies(CURRENT_PAGE, JSON.stringify({type:ARTISTS}));
    },[]);

    useEffect(()=>{
        if(artistsDetailsFS.length>0){
            if(sortBy===SORT_A_TO_Z || sortBy===SORT_A_TO_Z_DESC){
                setArtistsDetailsList(sortGroupByField(artistsDetailsFS,'artistName'));
            }
            if(sortBy===SORT_COUNT_TRACKS){
                let tempArtistsDetails = [...artistsDetailsFS];
                tempArtistsDetails = tempArtistsDetails.sort((a, b)=>a.count > b.count?-1:1);
                setArtistsDetails(tempArtistsDetails);
            }
        }
    },[artistsDetailsFS, sortBy]);

    useEffect(()=>{
        if(Object.keys(artistsDetailsList).length>0){
            let tempArtistsDetailsListKeys = Object.keys(artistsDetailsList);
            if(sortBy===SORT_A_TO_Z_DESC){
                tempArtistsDetailsListKeys = tempArtistsDetailsListKeys.sort((a,b)=>{return a>b?-1:1})
            }
            setArtistsDetailsListKeys(tempArtistsDetailsListKeys);
        }
    },[artistsDetailsList]);

    useEffect(() => {
        if (globalFilterText && globalFilterText.length > 2) {
            if(sortBy === SORT_COUNT_TRACKS){
                setFilteredArtistsDetails(filterArtistDetails(globalFilterText, artistsDetails))
            }else{
                setFilteredArtistsDetailsList(filterArtistDetailsList(globalFilterText,artistsDetailsList,artistsDetailsListKeys))
            }
            setFilterActive(true);
        } else {
            setFilteredArtistsDetails(artistsDetails)
            setFilteredArtistsDetailsList(artistsDetailsList)
            setFilterActive(false);
        }
    }, [globalFilterText,artistsDetailsListKeys, artistsDetails,artistsDetailsList, sortBy]);
    
    
    return(
        <>
            {!isFilterActive && <SortingContainer sortListKeys={artistsDetailsListKeys} setSortBy={setSortBy} sortBy={sortBy} sortSelectors={[SORT_A_TO_Z,SORT_A_TO_Z_DESC, SORT_COUNT_TRACKS]} showSortByLabel={true} />}
            <div className="artists-list">
                {sortBy === SORT_COUNT_TRACKS && filteredArtistsDetails?.map((artist, index) =>
                    <ArtistThumb artist={artist} key={index} />
                )}
                {sortBy!==SORT_COUNT_TRACKS && artistsDetailsListKeys?.map((lKey, index) =>
                    <>
                        {!isFilterActive && <label id={"lKey" + lKey} className="artists-lKey" key={index}>{lKey}</label>}
                        {filteredrtistsDetailsList[lKey]?.map((artist, artistIndex) =>
                            <ArtistThumb artist={artist} key={artistIndex} />
                        )}
                    </>
                )}
            </div>
        </>
    );
}