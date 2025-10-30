import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenreDetails } from "../../redux/library/LibraryActions";
import { Link } from "react-router-dom";
import { GroupedThumbImg4 } from "../../GroupedThumbImg4";
import { CURRENT_PAGE, GENRE, GENRES, GENRE_LABEL, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_COUNT_TRACKS, TRACKS_LABEL } from "../../redux/GPActionTypes";
import { ThumbnailActionBtn } from "../../ThumbnailActionBtn";
import { camelize, setCookies } from "../../utilities/util";
import { SortingContainer } from "../SortingContainer";

export const Genres = () => {
    const dispatch = useDispatch();

    const genreDetails = useSelector(state => state.library.genreDetails);

    const [genreAlbums, setGenreAlbums] = useState({});
    const [genres, setGenres] = useState([]);
    const [genreSongCount, setGenreSongCount] = useState({});
    const [sortBy, setSortBy] = useState(SORT_A_TO_Z);

    useEffect(()=>{
        if(!genreDetails || (genreDetails && !genreDetails.GENRE_SONG_COUNT)){
            dispatch(fetchGenreDetails());
        }
        setCookies(CURRENT_PAGE, JSON.stringify({type:GENRES}));
    },[]);

    useEffect(()=>{
        if(genreDetails){
            if(genreDetails.GENRE_ALBUMS){
                setGenreAlbums(genreDetails.GENRE_ALBUMS);
            }
            if(genreDetails.GENRES){
                setGenres(genreDetails.GENRES);
            }
            if(genreDetails.GENRE_SONG_COUNT){
                setGenreSongCount(genreDetails.GENRE_SONG_COUNT);
            }
        }
    },[genreDetails]);
    
    useEffect(()=>{
        if(genres && genres.length>0){
            let sortedGenres = [...genres];
            if(sortBy === SORT_A_TO_Z){
                sortedGenres = sortedGenres.sort((a,b)=>{return a>b?1:-1});
            }
            if(sortBy === SORT_A_TO_Z_DESC){
                sortedGenres = sortedGenres.sort((a,b)=>{return a>b?-1:1});
            }
            if(sortBy === SORT_COUNT_TRACKS){
                sortedGenres = sortedGenres.sort((a,b)=>{return genreSongCount[a]>genreSongCount[b]?-1:1});
            }
            setGenres(sortedGenres);
        }
    },[sortBy])

    return(
        <div className="genres">
            <SortingContainer 
                setSortBy={setSortBy} 
                sortBy={sortBy} 
                showLKey={false} 
                sortSelectors={
                    [
                        SORT_COUNT_TRACKS,
                        SORT_A_TO_Z,
                        SORT_A_TO_Z_DESC,
                    ]
                } 
            />
            <div className="genre-list">
                {genres.length > 0 && genres.map((genre,i) =>
                    <div className="genre-thumb" key={i}>
                        <div className="genre-thumb-img-div">
                            <Link to={`/music/genres/${genre}`}>
                                <GroupedThumbImg4 albumNames={genreAlbums[genre]} classPrefix="genre" />
                            </Link>
                            <ThumbnailActionBtn rowList={[]} options={[{label:GENRE_LABEL, link: `/music/genres/${genre}`}]} type={GENRE} obj={genre} />
                        </div>
                        <div className="genre-thumb-details">
                            <Link to={`/music/genres/${genre}`}>
                                <label>{camelize(genre)}</label>
                                <br />
                                <label>{genreSongCount[genre]}&nbsp;{TRACKS_LABEL}</label>
                            </Link>
                        </div>
                    </div>    
                )}
            </div>
        </div>
    );
}