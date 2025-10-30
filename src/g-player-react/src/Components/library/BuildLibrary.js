import React, { useEffect, useState } from "react";
import { BUILD_STATUS, COMPONENT, GP_LIBRARY_DESCRIPTION, GP_LIBRARY_DESC_TEXT_1, INIT, INITIATED, LIBRARY_BUILD, RUNNING } from "../redux/GPActionTypes";
import { fetchBuildStatusSucc, initLibraryBuild, setCommonPopupObj } from "../redux/library/LibraryActions";
import { useDispatch, useSelector } from "react-redux";
import { setCookies } from "../utilities/util";
import loading_icon from '../images/Loading.gif';
import { BuildLibraryPopup } from "./BuildLibraryPopup";


export const BuildLibrary = () => {
    const dispatch = useDispatch();

    const buildStatusList = useSelector(state => state.library.buildStatus);

    const [isBuildRunning, setIsBuildRunning] = useState(false);
    const [isBuildInit, setIsBuildInit] = useState(false);
    const [buildStatusL, setBuildStatusL] = useState(null);

    useEffect(()=>{
        if(buildStatusList.length > 0){
            const buildStatus = [...buildStatusList].find(bs=>bs.name===BUILD_STATUS);
            if(buildStatus)setIsBuildRunning(buildStatus.value === RUNNING ? true : false);

            let tempBuildStatusL = {};
            if(buildStatusList.length>0){
                buildStatusList.forEach(element => {
                    tempBuildStatusL[element.name]=element.value;
                });
                setBuildStatusL(tempBuildStatusL);
            }
        }
    },[buildStatusList])

    const onInitLibraryBuild = (isTakePlBkp) => {
        
        if(window.confirm("Build library ?")===true){
            dispatch(initLibraryBuild(isTakePlBkp));
            const tempBuildStatus = [...buildStatusList].filter(bs=>bs.name!==BUILD_STATUS);
            tempBuildStatus.push({
                "name": BUILD_STATUS,
                "value": RUNNING,
                "type": BUILD_STATUS
            });
            dispatch(fetchBuildStatusSucc(tempBuildStatus));
            setCookies(LIBRARY_BUILD, INITIATED);
        }
    }
    const showBuildLibPopup = () => {
        const commonPopupObj = {
            showPopup: true,
            title: "Build Library",
            component:  BuildLibraryPopup,
            contentType: COMPONENT,
            primaryBtnFun: onInitLibraryBuild,
            primaryBtnLabel:"Build",
            args : () => {
                return document.getElementById("build_playlist_backup_chkbox").checked;
            }
    
        }
        const buildStatus = [...buildStatusList].find(bs=>bs.name===BUILD_STATUS);
            buildStatus.value=INIT;
            const tempBuildStatus = [...buildStatusList].filter(bs=>bs.name!==BUILD_STATUS);
            tempBuildStatus.push(buildStatus);
            dispatch(fetchBuildStatusSucc(tempBuildStatus));
        dispatch(setCommonPopupObj(commonPopupObj));
    }
    return(
        <div className="library-build">
            <h4>Build Library</h4>
            <div className="content">
                <p>{GP_LIBRARY_DESCRIPTION}</p>
                <p>{GP_LIBRARY_DESC_TEXT_1}</p>
            </div>
            <div className="status">
                {!isBuildRunning && buildStatusL &&
                    <div className="completed">
                        <label>Summary of current build</label>
                        <label><span>Total tracks</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.TOTAL_TRACKS}</span></label>
                        <label><span>Total albums</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.ALBUM_COUNT}</span></label>
                        <label><span>Artists found</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.ARTIST_COUNT}</span></label>
                        <label><span>Album Artists found</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{buildStatusL.ALBUM_ARTIST_COUNT}</span></label>
                        <label><span>Time took to finish</span><span>:&nbsp;&nbsp;&nbsp;&nbsp;{Math.floor(buildStatusL.FILES_READ_TIME/1000)} Secs</span></label>
                    </div>
                }
                {isBuildRunning && buildStatusL &&
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
            </div>
            <div className="btn-container">
                <a className={!isBuildRunning?"library-btn":"library-btn disabled-click"} onClick={showBuildLibPopup}>Build Library</a>
            </div>
        </div>
    );
}