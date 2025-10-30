import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../header/Header";
import { CURRENT_PAGE, RECENT_PLAYS, RECENT_PLAYS_LABEL } from "../redux/GPActionTypes";
import { fetchAllHistory } from "../redux/library/LibraryActions";
import { AlbumThumbsGrouped } from "../screen/album/AlbumThumbsGrouped";
import { AlbumThumb } from "../screen/album/AlbumThumb";
import { setCookies } from "../utilities/util";
import { TrackList } from "../screen/track/TrackList";

export const RecentPlays = () => {
    const dispatch = useDispatch();
    const historyTracks = useSelector(state => state.library.history.songs);
    const historyAlbums = useSelector(state => state.library.history.albums);
    const [hisAlbumsGrpd_6, setHisAlbumsGrpd_6] = useState([]);
    const [hisAlbumsArr, setHisAlbumsArr] = useState([]);
    const [trackListInp, setTrackListInp] = useState({});

    useEffect(()=>{
        dispatch(fetchAllHistory());
        setCookies(CURRENT_PAGE, JSON.stringify({type:RECENT_PLAYS}));
    },[dispatch])

    useEffect(()=>{
        if(historyAlbums!==undefined){
            const tempHisAlbumsGrpd_6 = historyAlbums.splice(0, 9);
            setHisAlbumsGrpd_6(tempHisAlbumsGrpd_6);
            setHisAlbumsArr(historyAlbums.splice(0, 6));
        }
    },[historyAlbums])

    useEffect(()=>{
        const tempTrackListInp = {
            playedFrom:{
                pfKey:RECENT_PLAYS, 
            },
            showSort: false,
            showLKey: false,
            traskListStyle:{
                maxHeight:'unset',
                overflow:'hidden'
            }
        }
        setTrackListInp(tempTrackListInp);
    },[]);
    
    return(
        <div className="recent-plays">
            <Header headerLbl={RECENT_PLAYS_LABEL} />
            <div className="body">
                {historyAlbums!==undefined && historyAlbums.length>0 &&
                    <div className="albums">
                        <h3>Albums</h3>
                        <div className="album-group">
                            <div className="album-grouped-list">
                                {hisAlbumsGrpd_6 !== undefined && <AlbumThumbsGrouped albums={hisAlbumsGrpd_6} />}
                            </div>
                            <div className="albums">
                                {hisAlbumsArr.map((album, index) =>
                                    <AlbumThumb album={album} key={index} />
                                )}
                            </div>
                        </div>
                    </div>
                }
                {/* {hisAlbumsArr!==undefined && hisAlbumsArr.length>0 &&
                    <div className="albums">
                        <h3>Albums</h3>
                        <div className="album-list">
                            {hisAlbumsArr.map((album, index) =>
                                <AlbumThumb album={album} key={index} />
                            )}
                        </div>
                    </div>
                } */}
                <h3>Tracks</h3>
                {historyTracks && trackListInp && <TrackList trackListInp={trackListInp} tracks={historyTracks} />}
            </div>
        </div>
    );
}