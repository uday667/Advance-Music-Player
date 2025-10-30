import React, { useEffect, useState } from "react";
import { GroupedThumbImg4 } from "../../GroupedThumbImg4";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ALBUMS, CURRENT_PAGE, GENRE, PLAY_ALL_LABEL, SORT_ALBUM, SORT_ARTIST, SORT_A_TO_Z, SORT_A_TO_Z_DESC, 
    SORT_LYRICS_AVAILABLE, SORT_MULTI_LINGUAL, SORT_YEAR, TRACKS, TRACKS_LABEL, TRACK_LIST } from "../../redux/GPActionTypes";
import { fetchAlbumsByGenre, fetchGenreDetails, fetchSongsByGenre } from "../../redux/library/LibraryActions";
import { TrackList } from "../track/TrackList";
import { FaPlay } from "react-icons/fa";
import { Lyrics } from "../lyrics/LyricsV2";
import { camelize, setCookies } from "../../utilities/util";
import { MdOutlineArtTrack } from "react-icons/md";
import { IoAlbums } from "react-icons/io5";
import { AlbumList } from "../album/AlbumList";

export const GenrePage = () => {
    const {genre} = useParams();

    const dispatch = useDispatch();
    
    const genreDetails = useSelector(state => state.library.genreDetails);
    let genreSongList = useSelector(state => state.library.genreSongList);
    if(genreSongList.length>0){
        genreSongList = genreSongList.sort((a,b)=>{return a.title>b.title?1:-1});
    }

    const [genreAlbumNames, setGenreAlbumNames] = useState({});
    const [genreAlbums, setGenreAlbums] = useState([]);
    const [genreSongCount, setGenreSongCount] = useState({});
    const [trackListInp, setTrackListInp] = useState({});
    const [viewType, setViewType] = useState(TRACKS);
    const [albumListInp, setAlbumListInp] = useState({});

    useEffect(()=>{
        dispatch(fetchSongsByGenre(genre));
        if(!genreDetails || (genreDetails && !genreDetails.GENRE_SONG_COUNT)){
            dispatch(fetchGenreDetails());
        }
        setCookies(CURRENT_PAGE, JSON.stringify({type:GENRE}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[genre,dispatch]);

    useEffect(() => {
        if(genre && viewType === ALBUMS){
            dispatch(fetchAlbumsByGenre(genre));
        }
    },[viewType, genre, dispatch]);

    useEffect(()=>{
        if(genreAlbums && genreAlbums.length > 0){
            const tempAlbumListInp = {...albumListInp};

            tempAlbumListInp.styles = {maxHeight : 'calc(100vh - 27.2em)'}
            
            if(genreAlbums.length > 12){
                tempAlbumListInp.showSort = true;
                tempAlbumListInp.styles = {maxHeight : 'calc(100vh - 29.3em)'}
                tempAlbumListInp.sortSelectors = [SORT_A_TO_Z,SORT_A_TO_Z_DESC,SORT_YEAR,SORT_ARTIST,SORT_MULTI_LINGUAL];
                tempAlbumListInp.selectedSortBy = SORT_YEAR
            }

            if(genreAlbums.length > 50){
                tempAlbumListInp.showLKey = true;
                tempAlbumListInp.styles = {maxHeight : 'calc(100vh - 31.5em)'}
            }
            setAlbumListInp(tempAlbumListInp);
        }
    },[genreAlbums, albumListInp])

    useEffect(()=>{
        if(genreDetails){
            if(genreDetails.GENRE_ALBUMS){
                setGenreAlbumNames(genreDetails.GENRE_ALBUMS);
            }
            if(genreDetails.GENRE_SONG_COUNT){
                setGenreSongCount(genreDetails.GENRE_SONG_COUNT);
            }
            if(genreDetails.ALBUMS_BY_GENRE){
                setGenreAlbums(genreDetails.ALBUMS_BY_GENRE);
            }
        }
    },[genreDetails]);

    useEffect(()=>{
        const tempTrackListInp = {
            playedFrom:{
                pfKey:GENRE, 
                pfVal:genre
            },
            showSort: false,
            showLKey: false,
            sortSelectors:[SORT_A_TO_Z,SORT_A_TO_Z_DESC, SORT_YEAR, SORT_ARTIST, SORT_LYRICS_AVAILABLE, SORT_ALBUM],
            selectedSortBy:SORT_YEAR
        }

        if(genreSongList){
            if(genreSongList.length > 6){
                tempTrackListInp.showSort = true;
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 29em)'
                }
            }
            if(genreSongList.length > 20){
                tempTrackListInp.showLKey = true;
                tempTrackListInp.lKeyStyle = {
                    position:'absolute', 
                    visibility:'hidden'
                }
                tempTrackListInp.traskListStyle = {
                    maxHeight : 'calc(100vh - 31.8em)'
                }
            }
        }
        setTrackListInp(tempTrackListInp);
    },[genreSongList, genre]);

    const playAll = () => {
        const tracks = document.getElementById(TRACK_LIST);
        if(tracks && tracks.childElementCount > 0){
            tracks.getElementsByClassName("track")[0].children[0].click()
        }
    }

    return(
        <div className="genre-page">
            <div className="genre-page-header">
                <GroupedThumbImg4 albumNames={genreAlbumNames[genre]} classPrefix="genre" />
                <div className="genre-details">
                    <div className="genre-name">
                        <h2>{camelize(genre)}</h2>
                        <label>{genreSongCount[genre]}&nbsp;{TRACKS_LABEL}</label>
                    </div>
                    <div className="genre-actions">
                        <div className="play-all">
                            <button onClick={playAll} className="g-btn md beige violet beige-border flexbox-center column-gap-5"><FaPlay className="faplay"  />{PLAY_ALL_LABEL}</button>
                        </div>
                        <div className={viewType===TRACKS ? "selected view-type":"view-type"}>
                            <MdOutlineArtTrack style={{fontSize:28}} onClick={()=>setViewType(TRACKS)} title="Track list" />
                        </div>
                        <div className={viewType===ALBUMS ? "selected view-type":"view-type"}>
                            <IoAlbums style={{fontSize:28}} onClick={()=>setViewType(ALBUMS)} title="Albums" />
                        </div>
                        
                    </div>
                </div>
                <div className="genre-lyrics">
                    <Lyrics />
                </div>
            </div>
            {viewType === TRACKS &&
                <>
                {genreSongList.length > 0 && Object.keys(trackListInp).length > 0 &&
                    <TrackList tracks={genreSongList} trackListInp={trackListInp} />
                }
                </>
            }

            {viewType === ALBUMS && genreAlbums.length > 0 && Object.keys(albumListInp).length > 0 &&
                <AlbumList albums={genreAlbums} albumListInp={albumListInp} />
            }
        </div>
    );
}