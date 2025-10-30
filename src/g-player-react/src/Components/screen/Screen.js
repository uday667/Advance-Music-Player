import React from "react";
import { Route, Routes } from "react-router-dom";
import { AlbumArtistList } from "./artist/AlbumArtistList";
import { Artist } from "./artist/Artist";
import { ArtistsList } from "./artist/ArtistsList";
import { AlbumArtist } from "./artist/AlbumArtist";
import { Music } from "./Music";
import { Header } from "../header/Header";
import { MUSIC_LABEL } from "../redux/GPActionTypes";
import { Tracks } from "./track/Tracks";
import { Album } from "./album/Album";
import { Genres } from "./genre/Genres";
import { GenrePage } from "./genre/GenrePage";
import { LanguagePage } from "./language/LanguagePage";
import { Languages } from "./language/Languages";
import { Albums } from "./album/Albums";

export const Screen = () => {
    return(
        <div className="screen">
            <Header showGB={true} linkTO="/music" headerLbl={MUSIC_LABEL} />
            <Routes>
                <Route path='/' element={<Music />} />
                <Route path='tracks' element={<Tracks />} />
                <Route path='albums/:albumName/:language' element={<Album />} />
                <Route path='albums/:albumName' element={<Album />} />
                <Route path='albums' element={<Albums />} />
                <Route path='artists/:artist' element={<Artist />} />
                <Route path='artists' element={<ArtistsList />} />
                <Route path='album_artists/:albumArtist' element={<AlbumArtist />} />
                <Route path='album_artists' element={<AlbumArtistList />} />
                <Route path='genres/:genre' element={<GenrePage />} />
                <Route path='genres' element={<Genres />} />
                <Route path='languages/:language' element={<LanguagePage />} />
                <Route path='languages' element={<Languages />} />
            </Routes>
        </div>
    );
}