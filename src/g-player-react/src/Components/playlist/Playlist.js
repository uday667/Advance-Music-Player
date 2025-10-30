import React from "react";
import { Header } from "../header/Header";
import { PLAYLISTS_LABEL } from "../redux/GPActionTypes";
import { Route, Routes } from "react-router-dom";
import { Playlists } from "./Playlists";
import { PlaylistPage } from "./PlaylistPage";

export const Playlist = () => {
    
    return(
        <div className="playlist">
            <Header linkTO="/playlist" headerLbl={PLAYLISTS_LABEL} showGlobalFilter={true} filterPH="Playlists" />
            <Routes>
                <Route path='/' element={<Playlists />} />
                <Route path='/:playlistName/:playlistId' element={<PlaylistPage />} />
            </Routes>
        </div>
    );
}