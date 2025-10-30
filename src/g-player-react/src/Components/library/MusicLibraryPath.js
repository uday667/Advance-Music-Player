import React, { useEffect } from "react";
import { MUSIC_PATH } from "../redux/GPActionTypes";
import { useDispatch, useSelector } from "react-redux";
import { deleteMusicPath, saveMusicPath } from "../redux/library/LibraryActions";
import {RiDeleteBinLine} from 'react-icons/ri';
import { LIBRARY_SAVE_MUSIC_PATH_SUCCESS } from "../redux/library/LibraryActionTypes";

export const MusicLibraryPath = () => {
    const dispatch = useDispatch();

    const musicPaths = useSelector(state => state.library.musicPaths);
    const libraryPhase = useSelector(state => state.library.phase);

    useEffect(()=>{
        if(libraryPhase===LIBRARY_SAVE_MUSIC_PATH_SUCCESS){
            document.getElementById('music_path').value = "";
        }
    },[libraryPhase]);
    
    const onSaveMusicPath = () => {
        const mPath =  document.getElementById('music_path').value;
        if(mPath===""){
            alert("Path cannot be empty");
            return;
        }
        const musicPath = {
            name : MUSIC_PATH,
            type: MUSIC_PATH,
            value: mPath
        }
        try {
            dispatch(saveMusicPath(musicPath));
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <div className="library-list">
            <h4>Library List</h4>
            <div className="content">
                <p>Add all the music folders' full path.</p>
                <div className="input-container">
                    <input id="music_path" placeholder="Paste music path" />
                    <a className="library-btn" onClick={onSaveMusicPath}>Add</a>
                </div>
            </div>
            <div className="existing-lib-paths">
                {musicPaths && musicPaths.map((musicPath, index)=>
                    <label key={index}>{musicPath.value}<RiDeleteBinLine onClick={()=>dispatch(deleteMusicPath(musicPath))} /></label>
                )}
            </div>
        </div>
    );
}