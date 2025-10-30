import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchBuildStatus, fetchMessagesByType, fetchMusicPath} from "../redux/library/LibraryActions";
import { ARTIST_IMG_DOWNLOAD_STATUS, CURRENT_PAGE, LIBRARY, LIBRARY_LABEL} from "../redux/GPActionTypes";

import { Header } from "../header/Header";
import { setCookies } from "../utilities/util";
import { ArtistImageDownload } from "./ArtistImageDownload";
import { MusicLibraryPath } from "./MusicLibraryPath";
import { BuildLibrary } from "./BuildLibrary";
import { ShowAssignedPlaylists } from "./ShowAssignedPlaylists";

export const Library = () => {

    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(fetchMusicPath());
        dispatch(fetchBuildStatus());
        setCookies(CURRENT_PAGE, JSON.stringify({type:LIBRARY}));
        dispatch(fetchMessagesByType(ARTIST_IMG_DOWNLOAD_STATUS));
    },[])


    return(
        <div className="library-v2">
            <Header headerLbl={LIBRARY_LABEL} />
            <div className="body">
                <BuildLibrary />
                <MusicLibraryPath />
                <ArtistImageDownload />
                <ShowAssignedPlaylists />
            </div>
        </div>
    );
}