import React from "react";
import { GP_SORT_SELECTOR_LABEL_MAPPING, SORT_ALBUM, SORT_ARTIST, SORT_GENRE } from "../redux/GPActionTypes";
import { replace_AndCamelize, scrolltoId } from "../utilities/util";

export const SortingContainer = ({sortBy, setSortBy, sortListKeys, sortSelectors, showLKey, showSortByLabel}) => {
    return(
        <>
            <div className="order-container">
                {showSortByLabel && <span>Sort By:</span>}
                <select onChange={(event)=>setSortBy(event.target.value)} className="sortby">
                    {sortSelectors.length > 0 && sortSelectors.map((sortSelector,index)=>
                        <option key={index} value={sortSelector} selected={sortBy===sortSelector?true:false}>{GP_SORT_SELECTOR_LABEL_MAPPING[sortSelector]}</option>
                    )}
                </select>
            </div>
            {showLKey &&<div className="lKey-line">
                {![SORT_ARTIST,SORT_ALBUM, SORT_GENRE].includes(sortBy) && sortListKeys && sortListKeys.length > 0 && sortListKeys.map((lKey, index) =>
                    <span key={index} onClick={() => scrolltoId("lKey" + lKey)} className={lKey.length>8?sortBy+"_25":sortBy+"_10"}>{replace_AndCamelize(lKey)}</span>
                )}
            </div>}
        </>
    );
}