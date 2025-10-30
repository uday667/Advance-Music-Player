import React, { useEffect, useState } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { BUILD_STATUS, INIT, RUNNING } from "../redux/GPActionTypes";
import { fetchBuildStatus, initDeltaLibraryBuild } from "../redux/library/LibraryActions";

export const RefreshBuild = () => {
    const dispatch = useDispatch();

    const buildStatus = useSelector(state => state.library.buildStatus);

    const [bStatus, setBStatus] = useState(null);
    const [statClearIntrvl, setStatClearIntrvl] = useState(0);

    useEffect(()=>{
        let tempBuildStatusL = {};
        if(buildStatus.length>0){
            buildStatus.forEach(element => {
                tempBuildStatusL[element.name]=element.value;
                if(element.name===BUILD_STATUS){
                    setBStatus(element.value);
                }
            });
            //setBuildStatusL(tempBuildStatusL);
        }
        setBStatus(buildStatus);
    },[buildStatus]);

    useEffect(()=>{
        const refresh_build_button = document.getElementById("refresh_build_button");
        if(bStatus === INIT || bStatus === RUNNING){
            if(refresh_build_button){
                refresh_build_button.classList.add("rotate-player-button");
            }
            clearInterval(statClearIntrvl);
            setStatClearIntrvl(setInterval( dispatch(fetchBuildStatus()), 2000));
        }else{
            if(refresh_build_button){
                refresh_build_button.classList.remove("rotate-player-button");
            }
            clearInterval(statClearIntrvl);
        }

        

    },[bStatus]);

    const onInitDeltaLibraryBuild = () => {
        if(window.confirm("Build library ?")===true){
            //setIsFetchBStat(true);
           //setBuildStatusL(null);
            dispatch(initDeltaLibraryBuild());
            setBStatus(INIT);
            const refresh_build_button = document.getElementById("refresh_build_button");
            if(refresh_build_button !== null){
                refresh_build_button.classList.add("rotate-player-button");
            }
        }
    }
    return(
        <div className="refresh-build">
            <RiRefreshLine onClick={onInitDeltaLibraryBuild} id="refresh_build_button" />
        </div>
    );
}