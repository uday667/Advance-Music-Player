import React, { useEffect, useState } from "react";
import { BUILD_STATUS, COMPLETED, INIT,RUNNING } from "../redux/GPActionTypes";
import { setCommonPopupObj } from "../redux/library/LibraryActions";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "../utilities/Spinner";

export const BuildLibraryPopup = () => {
    const dispatch = useDispatch();

    const buildStatusList = useSelector(state => state.library.buildStatus);
    const [isBuildRunning, setIsBuildRunning] = useState(false);
    const [isBuildCompleted, setIsBuildCompleted] = useState(false);
    //const [isBuildInit, setIsBuildInit] = useState(false);

    useEffect(()=>{
        if(buildStatusList.length > 0){
            const buildStatus = [...buildStatusList].find(bs=>bs.name===BUILD_STATUS);
            if(buildStatus){
                setIsBuildRunning(buildStatus.value === RUNNING ? true : false);
            setIsBuildCompleted(buildStatus.value === COMPLETED ? true : false);
            //setIsBuildInit(buildStatus.value === INIT ? true : false);
            }
        }
    },[buildStatusList])

    useEffect(()=>{
        if(isBuildCompleted)dispatch(setCommonPopupObj({
            showPopup: false
        }));
    },[isBuildCompleted])
    return (
        <>
            {!isBuildRunning &&
                <div className="flexbox-align-center" style={{columnGap:10}}>
                    <span>Take backup of playlists before build ?</span>
                    <input type="checkbox" id="build_playlist_backup_chkbox" className="custom-checkbox" style={{border:'1px solid', borderRadius:3}} />
                </div>
            }
            {(isBuildRunning) && <div className="flex-align-center-100"><Spinner spinnerInp={{classSize:'sm', text:"Builing"}} /></div>}
        </>
    );
}