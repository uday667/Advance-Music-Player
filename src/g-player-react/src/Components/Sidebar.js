import React, { useEffect, useState } from "react";
import { IoIosMusicalNotes } from 'react-icons/io';
import { IoTimeOutline } from 'react-icons/io5';
import { MdLibraryMusic } from 'react-icons/md';
import { AiOutlineMenuFold } from 'react-icons/ai';
import { HiPlusSmall } from 'react-icons/hi2';
import { TbPlaylist } from 'react-icons/tb';
import { Link, useLocation } from "react-router-dom";
import { LIBRARY, LIBRARY_LABEL, MUSIC, MUSIC_LABEL, PLAYLISTS, PLAYLISTS_LABEL, RECENT, RECENT_PLAYS_LABEL } from "./redux/GPActionTypes";
import { SearchInput } from "./search/SearchInput";
import { showHideSideBar } from "./utilities/util";

export const Sidebar = () => {
    const [selectedRow, setSelectedRow] = useState('');
    const locationL = useLocation();
    useEffect(()=>{
        let uri = locationL.pathname;
        if(uri!==null && uri!==''){
            if(uri.startsWith("/recent")){
                setSelectedRow(RECENT);
            }else if(uri.startsWith("/library")){
                setSelectedRow(LIBRARY);
            }else if(uri.startsWith("/playlist")){
                setSelectedRow(PLAYLISTS);
            }else {
                setSelectedRow(MUSIC);
            }
        }
    },[locationL]);
    return(
        <div className="sidebar" id="sidebar">
            <div className="row mobile-only-block ham-burger-hide-row">
                <AiOutlineMenuFold id="MenuSideBarFold" onClick={showHideSideBar} />
            </div>
            <div className="search-row">
                <SearchInput />
            </div>
            <div className={selectedRow===MUSIC?"row sidebar-slected-row":"row"}>
                <Link to='/music' onClick={showHideSideBar}>
                    <label><span><IoIosMusicalNotes className="icon" /></span><span>{MUSIC_LABEL}</span></label>
                </Link>
            </div>
            <div className={selectedRow===PLAYLISTS?"row sidebar-slected-row":"row"}>
                <div className="playlist-link">
                    <Link to='/playlist' onClick={showHideSideBar}>
                        <label><span><TbPlaylist className="icon" /></span><span>{PLAYLISTS_LABEL}</span></label>
                    </Link>
                    
                </div>
            </div>
            <div className={selectedRow===RECENT?"row sidebar-slected-row":"row"}>
                <Link to='/recent' onClick={showHideSideBar}>
                    <label><span><IoTimeOutline className="icon" /></span><span>{RECENT_PLAYS_LABEL}</span></label>
                </Link>
            </div>
            <div className={selectedRow===LIBRARY?"row sidebar-slected-row":"row"}>
                <Link to='/library' onClick={showHideSideBar}>
                    <label><span><MdLibraryMusic className="icon" /></span><span>{LIBRARY_LABEL}</span></label>
                </Link>
            </div>
        </div>
    );
}