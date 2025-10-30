import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ARTIST_IMG_DOWNLOAD_STATUS, COMPLETED, COMPONENT, RUNNING } from "../redux/GPActionTypes";
import { initiArtistImageDownload, setCommonPopupObj } from "../redux/library/LibraryActions";
import loading_icon from '../images/Loading.gif';

export const ArtistImageDownload = () => {
    const dispatch = useDispatch();
    const artistImageDownloadSummary = useSelector(state => state.library.artistImageDownloadSummary);

    const [artistIImgDownloadStat, setArtistIImgDownloadStat] = useState({});
    

    useEffect(()=>{
        if(artistImageDownloadSummary && artistImageDownloadSummary.length > 0){
            const status = artistImageDownloadSummary.find(elem => {return elem.name === ARTIST_IMG_DOWNLOAD_STATUS});
            setArtistIImgDownloadStat(status);
        }
    },[artistImageDownloadSummary]);

    

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
    const getArtistImgPopupObj = () => ({
        showPopup: true,
        title: "Download Artist Images",
        contentType: COMPONENT,
        component: ()=>{
            return(
                <div className="artist-image-download-popup-content">
                    <p style={{marginBottom:10}}>Select download option</p>
                    <select className="gp-select" style={{width:'60%'}} id="ARTIST_IMAGE_DOWNLOAD_OPTIONS_SELECT">
                        <option value="IGNORE_EXISTING_AND_TRIED_AND_FAILED">Ignore existing and failed in previous download</option>
                        <option value="DOWNLOAD_ALL">Download all</option>
                        <option value="DOWNLOAD_ALL_AND_OVERRIDE">Download all - Override existing</option>
                        <option value="DOWNLOAD_LATEST" disabled>Download latest</option>
                    </select>
                </div>
            )
        },
        primaryBtnFun: initiateArtistImageDownload,
        primaryBtnLabel: "Download"
    })
    return(
        <div className="library-artist-download">
            <label>Download Artist Images</label>
            <p style={{marginTop:10}}>Download Status: &nbsp;
                <>
                    {artistIImgDownloadStat && artistIImgDownloadStat.value === RUNNING && <>{RUNNING} <img src={loading_icon} style={{height:12}} /></>}
                    {artistIImgDownloadStat && artistIImgDownloadStat.value === COMPLETED && COMPLETED}
                </>
            </p>
            <div className="btn-container">
                <a className="library-btn" onClick={()=>dispatch(setCommonPopupObj(getArtistImgPopupObj()))}>Initiate Download</a>
            </div>
        </div>
    );
}