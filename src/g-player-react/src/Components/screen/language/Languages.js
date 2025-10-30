import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLanguageDetails } from "../../redux/library/LibraryActions";
import { Link } from "react-router-dom";
import { GroupedThumbImg4 } from "../../GroupedThumbImg4";
import { CURRENT_PAGE, LANGUAGE, LANGUAGES, LANGUAGE_LABEL, SORT_A_TO_Z, SORT_A_TO_Z_DESC, SORT_COUNT_TRACKS, TRACKS_LABEL } from "../../redux/GPActionTypes";
import { ThumbnailActionBtn } from "../../ThumbnailActionBtn";
import { camelize, setCookies } from "../../utilities/util";
import { SortingContainer } from "../SortingContainer";

export const Languages = () => {
    const dispatch = useDispatch();

    const languageDetails = useSelector(state => state.library.languageDetails);

    const [languageAlbums, setLanguageAlbums] = useState({});
    const [languages, setLanguages] = useState([]);
    const [languageSongCount, setLanguageSongCount] = useState({});
    const [sortBy, setSortBy] = useState(SORT_COUNT_TRACKS);

    useEffect(()=>{
        if(!languageDetails || (languageDetails && !languageDetails.LANGUAGE_SONG_COUNT)){
            dispatch(fetchLanguageDetails());
        }
        setCookies(CURRENT_PAGE, JSON.stringify({type:LANGUAGES}));
    },[]);

    useEffect(()=>{
        if(languageDetails){
            if(languageDetails.LANGUAGE_ALBUMS){
                setLanguageAlbums(languageDetails.LANGUAGE_ALBUMS);
            }
            if(languageDetails.LANGUAGES){
                setLanguages(languageDetails.LANGUAGES);
            }
            if(languageDetails.LANGUAGE_SONG_COUNT){
                setLanguageSongCount(languageDetails.LANGUAGE_SONG_COUNT);
            }
        }
    },[languageDetails]);

    useEffect(()=>{
        if(languages && languages.length>0){
            let sortedLanguages = [...languages];
            if(sortBy === SORT_A_TO_Z){
                sortedLanguages = sortedLanguages.sort((a,b)=>{return a>b?1:-1});
            }
            if(sortBy === SORT_A_TO_Z_DESC){
                sortedLanguages = sortedLanguages.sort((a,b)=>{return a>b?-1:1});
            }
            if(sortBy === SORT_COUNT_TRACKS){
                sortedLanguages = sortedLanguages.sort((a,b)=>{return languageSongCount[a]>languageSongCount[b]?-1:1});
            }
            setLanguages(sortedLanguages);
        }
    },[sortBy])

    return(
        <div className="languages">
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
            <div className="language-list">
                {languages.length > 0 && languages.map(language =>
                    <div className="language-thumb">
                        <div className="language-thumb-img-div">
                            <Link to={`/music/languages/${language}`}>
                                <GroupedThumbImg4 albumNames={languageAlbums[language]} classPrefix="language" />
                            </Link>
                            <ThumbnailActionBtn rowList={[]} options={[{label:LANGUAGE_LABEL, link: `/music/languages/${language}`}]} type={LANGUAGE} obj={language} />
                        </div>
                        <div className="language-thumb-details">
                            <Link to={`/music/languages/${language}`}>
                                <label>{camelize(language)}</label>
                                <br />
                                <label>{languageSongCount[language]}&nbsp;{TRACKS_LABEL}</label>
                            </Link>
                        </div>
                    </div>    
                )}
            </div>
        </div>
    );
}