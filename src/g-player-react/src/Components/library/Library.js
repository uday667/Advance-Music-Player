import React, { useEffect, useState } from "react";
import {RiDeleteBinLine} from 'react-icons/ri';
import { useDispatch, useSelector } from "react-redux";
import { deleteMusicPath, fetchBuildStatus, fetchMessagesByType, fetchMusicPath, initiArtistImageDownload, initLibraryBuild, saveMusicPath, setCommonPopupObj } from "../redux/library/LibraryActions";
import { ARTIST_IMG_DOWNLOAD_STATUS, BUILD_STATUS, COMPLETED, COMPONENT, CURRENT_PAGE, GP_LIBRARY_DESCRIPTION, GP_LIBRARY_DESC_TEXT_1, LIBRARY, LIBRARY_LABEL, MUSIC_PATH, RUNNING } from "../redux/GPActionTypes";
import { LIBRARY_SAVE_MUSIC_PATH_SUCCESS } from "../redux/library/LibraryActionTypes";
import loading_icon from '../images/Loading.gif';
import { Header } from "../header/Header";
import { setCookies } from "../utilities/util";
import { ArtistDownloadPopupComponent } from "./ArtistDownloadPopupComponent";

export const Library = () => {
    const dispatch = useDispatch();
    const musicPaths = useSelector(state => state.library.musicPaths);
    const libraryPhase = useSelector(state => state.library.phase);
    const buildStatus = useSelector(state => state.library.buildStatus);
    const artistImageDownloadSummary = useSelector(state => state.library.artistImageDownloadSummary);
    const [buildStatusL, setBuildStatusL] = useState(null);
    const [bStatus, setBStatus] = useState(null);
    const [statClearIntrvl, setStatClearIntrvl] = useState(0);
    const [isFetchBStat, setIsFetchBStat] = useState(false);
    const [isBuildInit, setIsBuildInit] = useState(false);
    const [artistIImgDownloadStat, setArtistIImgDownloadStat] = useState({});
    const [artistImgPopupObj, setArtistImgPopupObj] = useState({});

    
    
    const onInitLibraryBuild = () => {
        if(window.confirm("Build library ?")===true){
            setIsFetchBStat(true);
            setBuildStatusL(null);
            dispatch(initLibraryBuild());
        }
    }

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

    useEffect(()=>{
        dispatch(fetchMusicPath());
        dispatch(fetchBuildStatus());
        setCookies(CURRENT_PAGE, JSON.stringify({type:LIBRARY}));
        dispatch(fetchMessagesByType(ARTIST_IMG_DOWNLOAD_STATUS));

        //Initialize artist image popup object
        const tempArtistImgPopupObj = {
            showPopup: true,
            title: "Download Artist Images",
            contentType: COMPONENT,
            component: ArtistDownloadPopupComponent,
            primaryBtnFun: initiateArtistImageDownload,
            primaryBtnLabel: "Download"
            
        }
        setArtistImgPopupObj(tempArtistImgPopupObj);

    },[])

    useEffect(()=>{
        if(libraryPhase===LIBRARY_SAVE_MUSIC_PATH_SUCCESS){
            document.getElementById('music_path').value = "";
        }
    },[libraryPhase]);

    useEffect(()=>{
        let tempBuildStatusL = {};
        if(buildStatus.length>0){
            buildStatus.forEach(element => {
                tempBuildStatusL[element.name]=element.value;
                if(element.name===BUILD_STATUS){
                    setBStatus(element.value);
                }
            });
            setBuildStatusL(tempBuildStatusL);
        }
    },[buildStatus]);

    useEffect(()=>{
        clearInterval(statClearIntrvl);
        if(isFetchBStat){
            if(isBuildInit){
                if(bStatus===RUNNING){
                    setIsBuildInit(false);
                }
                setStatClearIntrvl(setInterval( dispatch(fetchBuildStatus()), 2000));
            }else{
                if(bStatus===COMPLETED)setIsFetchBStat(false);
                setStatClearIntrvl(setInterval( dispatch(fetchBuildStatus()), 2000));
            }  
        }
    },[buildStatus, bStatus, isFetchBStat, isBuildInit])

    useEffect(()=>{
        if(artistImageDownloadSummary && artistImageDownloadSummary.length > 0){
            const status = artistImageDownloadSummary.find(elem => {return elem.name === ARTIST_IMG_DOWNLOAD_STATUS});
            setArtistIImgDownloadStat(status);
        }
    },[artistImageDownloadSummary]);

    useEffect(()=>{
        if(artistIImgDownloadStat && artistIImgDownloadStat.value){
            if(artistIImgDownloadStat.value === RUNNING){
                clearInterval(statClearIntrvl);
                setStatClearIntrvl(setInterval(() => {
                    dispatch(fetchMessagesByType(ARTIST_IMG_DOWNLOAD_STATUS));
                },5000));
            }
        }
    },[artistIImgDownloadStat]);

    const initiateArtistImageDownload = () => {
        const artistImgDownloadOtnSlct = document.getElementById("ARTIST_IMAGE_DOWNLOAD_OPTIONS_SELECT");
        if(!artistImgDownloadOtnSlct){
            return false;
        }
        if(window.confirm("Initiate Download ?")===true){
            const tempArtistIImgDownloadStat = {
                "name": "ARTIST_IMG_DOWNLOAD_STATUS",
                "value": "RUNNING",
                "type": "ARTIST_IMG_DOWNLOAD_STATUS"
                }
            setArtistIImgDownloadStat(tempArtistIImgDownloadStat);
            dispatch(initiArtistImageDownload(artistImgDownloadOtnSlct.value));
            dispatch(setCommonPopupObj({showPopup: false}));
        }
    }

    return(
        <div className="library">
            <Header headerLbl={LIBRARY_LABEL} />
            <div className="body">
                <div className="library-build">
                    <h4>Build Library</h4>
                    <div className="content">
                        <p>{GP_LIBRARY_DESCRIPTION}</p>
                        <p>{GP_LIBRARY_DESC_TEXT_1}</p>
                    </div>
                    <div className="status">
                        {bStatus!==null && buildStatusL!==null &&
                            <>
                            {bStatus===COMPLETED &&
                                <div className="completed">
                                    <label>Summary of current build</label>
                                    <label><span>Total tracks</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.TOTAL_TRACKS}</span></label>
                                    <label><span>Total albums</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.ALBUM_COUNT}</span></label>
                                    <label><span>Artists found</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.ARTIST_COUNT}</span></label>
                                    <label><span>Album Artists found</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.ALBUM_ARTIST_COUNT}</span></label>
                                    <label><span>Time took to finish</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{Math.floor(buildStatusL.FILES_READ_TIME/1000)} Secs</span></label>
                                </div>
                            }
                            {bStatus===RUNNING &&
                                <div className="running">
                                    <label>Status</label>
                                    {!isBuildInit && <>
                                        <label><span>Rading files:</span><span>{buildStatusL.FILES_TO_READ} remaining.</span></label>
                                        <label><span>Build status:</span><span>{buildStatusL.BUILD_STATUS}&nbsp;<img src={loading_icon} style={{height:12}} /></span></label>
                                        <label><span style={{width:'100%'}}>{buildStatusL.BUILD_STATUS_STEP}</span></label>
                                    </>}
                                    {isBuildInit && <label><span>Build Initiated</span></label>}
                                </div>
                            }
                            </>
                        }
                    </div>
                    <div className="btn-container">
                        <a className={bStatus===null || bStatus===COMPLETED?"library-btn":"library-btn disabled-click"} onClick={onInitLibraryBuild}>Build Library</a>
                    </div>
                </div>
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
                <div className="library-artist-download">
                        <label>Download Artist Images</label>
                        <p style={{marginTop:10}}>Download Status: &nbsp;
                            <>
                                {artistIImgDownloadStat && artistIImgDownloadStat.value === RUNNING && <>{RUNNING} <img src={loading_icon} style={{height:12}} /></>}
                                {artistIImgDownloadStat && artistIImgDownloadStat.value === COMPLETED && COMPLETED}
                            </>
                        </p>
                        <div className="btn-container">
                            <a className="library-btn" onClick={()=>dispatch(setCommonPopupObj(artistImgPopupObj))}>Initiate Download</a>
                        </div>
                </div>
            </div>
        </div>
    );
}