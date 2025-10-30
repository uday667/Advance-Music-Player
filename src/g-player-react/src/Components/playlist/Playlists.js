import React, { useEffect, useState } from "react";
import { CreatePlayListBtn } from "./CreatePlayListBtn";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { PlaylistImg } from "./PlaylistImg";
import { ImportExportPlaylistBtn } from "./ImportExportPlaylistBtn";
import { CURRENT_PAGE, PLAYLISTS, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_COUNT_TRACKS, SORT_CREATED_DATE_NEW, SORT_CREATED_DATE_OLD, SORT_UPDATED_DATE_NEW, SORT_UPDATED_DATE_OLD } from "../redux/GPActionTypes";
import { setCookies } from "../utilities/util";
import { SortingContainer } from "../screen/SortingContainer";
import { ThumbnailActionBtn } from "../ThumbnailActionBtn";
import { deltePlaylist } from "../redux/playlist/PlaylistActions";
import { setCommonPopupObj } from "../redux/library/LibraryActions";
import { getShowDeletePlaylistPopup } from "./PlalistUtil";

export const Playlists = () => {
    const dispatch = useDispatch();
    const playlists = useSelector(state => state.playlist.playlists);
    const playlistAlbums = useSelector(state => state.playlist.playlistAlbums);
    const playlistSongsCount = useSelector(state => state.playlist.playlistSongsCount);

    const [sortBy, setSortBy] = useState(SORT_UPDATED_DATE_NEW);

    const globalFilterText = useSelector(state => state.library.globalFilterText);

    const [sortedPlaylistNames, setSortedPlaylistNames] = useState([]);
    const [filteredPlaylistNames, setFilteredPlaylistNames] = useState([]);

    useEffect(()=>{
        setCookies(CURRENT_PAGE, JSON.stringify({type:PLAYLISTS}));
    },[]);

    useEffect(()=>{
        let tempPlaylists = [...playlists];
        if(sortBy === SORT_A_TO_Z){
            tempPlaylists = tempPlaylists.sort((a,b)=>{return a.name>b.name?1:-1});
        }else if(sortBy === SORT_A_TO_Z_DESC){
            tempPlaylists = tempPlaylists.sort((a,b)=>{return a.name>b.name?-1:1});
        }else if(sortBy === SORT_CREATED_DATE_NEW){
            tempPlaylists = tempPlaylists.sort((a,b)=>{return new Date(a.createdDate)>new Date(b.createdDate)?-1:1});
        }else if(sortBy === SORT_CREATED_DATE_OLD){
            tempPlaylists = tempPlaylists.sort((a,b)=>{return new Date(a.createdDate)>new Date(b.createdDate)?1:-1});
        }else if(sortBy === SORT_UPDATED_DATE_NEW){
            tempPlaylists = tempPlaylists.sort((a,b)=>{return new Date(a.lastUpdated)>new Date(b.lastUpdated)?-1:1});
        }else if(sortBy === SORT_UPDATED_DATE_OLD){
            tempPlaylists = tempPlaylists.sort((a,b)=>{return new Date(a.lastUpdated)>new Date(b.lastUpdated)?1:-1});
        }else if(sortBy === SORT_COUNT_TRACKS){
            tempPlaylists = tempPlaylists.sort((a,b)=>{return playlistSongsCount[a.id]>playlistSongsCount[b.id]?-1:1})
        }
        setSortedPlaylistNames(tempPlaylists);
    },[playlists, sortBy]);

    useEffect(() => {
        if (globalFilterText && globalFilterText.length > 2) {
            let tempFilteredPlaylistNames = [...sortedPlaylistNames];
            setFilteredPlaylistNames(tempFilteredPlaylistNames.filter(tpln=>tpln.name.toLowerCase().includes(globalFilterText)));
        } else {
            setFilteredPlaylistNames(sortedPlaylistNames);
        }
    }, [globalFilterText,sortedPlaylistNames]);

    const onDeletePlaylist = (args) => {
        dispatch(deltePlaylist(args.playlistId));
    }

    const showDeletePlaylistPopup = (args) => {      
        dispatch(
            setCommonPopupObj(
                getShowDeletePlaylistPopup(onDeletePlaylist, args)
            )
        );
    }

    return(
        <div className="playlists">
            <div className="body">
                <div className="playlists-action">
                    <SortingContainer 
                        setSortBy={setSortBy} 
                        sortBy={sortBy} 
                        showLKey={false} 
                        sortSelectors={
                            [
                                SORT_UPDATED_DATE_NEW,
                                SORT_CREATED_DATE_NEW,
                                SORT_UPDATED_DATE_OLD,
                                SORT_COUNT_TRACKS,
                                SORT_A_TO_Z,
                                SORT_A_TO_Z_DESC,
                            ]
                        } 
                    />
                    <CreatePlayListBtn />
                    <ImportExportPlaylistBtn />
                </div>
                <div className="playlist-list">
                    {filteredPlaylistNames && filteredPlaylistNames.length > 0 && filteredPlaylistNames.map((plName, i)=>
                        <div className="plalist-thumb" key={i}>
                            <Link to={`/playlist/${plName.name}/${plName.id}`}>
                                <div className="playlist-thumb-img-div">
                                    <PlaylistImg albumNames={playlistAlbums[plName.id]} />
                                </div>
                            </Link>
                            <ThumbnailActionBtn rowList={[]} type={{}} obj={{}} options={[{callBackFunc:showDeletePlaylistPopup,label:'Delete Playlist', args:{playlistId:plName.id}}]} />
                            <div className="playlist-thumb-details">
                                <Link to={`/playlist/${plName.name}/${plName.id}`}>
                                    <label>{plName.name}</label><br />
                                    <label>{playlistSongsCount[plName.id]} songs</label>
                                </Link>
                            </div>
                        </div>
                    )
                    }
                </div>               
            </div>
        </div>
    );
}