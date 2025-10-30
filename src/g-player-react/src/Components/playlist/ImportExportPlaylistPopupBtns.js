import React, { useState } from "react";
import { COMING_SOON_LABEL, CSV_IMPORT_INPUT, EXPORT_LABEL, GP_IMPORT_INPUT, IMPORT_LABEL } from "../redux/GPActionTypes";
import { useDispatch, useSelector } from "react-redux";
import { exportPlaylists, importPlaylists } from "../redux/playlist/PlaylistActions";
import { setCommonPopupObj } from "../redux/library/LibraryActions";
import { Spinner } from '../utilities/Spinner';

export const ImportExportPlaylistPopupBtns = () => {
    const dispatch = useDispatch();

    const commonPopupObj = useSelector(state => state.library.commonPopupObj);

    const [showImportOptions, setShowImportOptions] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);

    const onExportPlaylists = () => {
        if(window.confirm("Export Playlists ?")===true){
            dispatch(exportPlaylists());
        }
    }

    const onSetShowImportOptions = (showImportOptions) => {
        setShowImportOptions(showImportOptions);
        const tempCommonPopupObj = {...commonPopupObj};
        tempCommonPopupObj.primaryClassName = "g-btn success";
        tempCommonPopupObj.primaryBtnLabel = IMPORT_LABEL;
        tempCommonPopupObj.primaryBtnFun = submitImportPlaylists
        dispatch(setCommonPopupObj(tempCommonPopupObj));
    }

    const handleFileOnChange = async (event) => {
        let tempSelectedFiles = {};
        let fileType;
        let fileList;
        if(event.target){
            fileType = event.target.accept;
            fileList = event.target.files;
        }else{
            fileType = event.accept;
            fileList = event.files;
        }
        
        const fileListLength = fileList.length;
        let file;
        let fileReader;
        let playlistName;
        for(let i=0; i<fileListLength;i++){
            file = fileList[i];
            playlistName = file.name;
            playlistName = playlistName.substring(0, playlistName.length-fileType.length);
            fileReader = new FileReader();
            fileReader.readAsText(file);
            // eslint-disable-next-line
            const result = await new Promise((resolve, reject) => {
                fileReader.onload = function(event) {
                resolve(fileReader.result)
                }
            })
            tempSelectedFiles[playlistName] = result.split("\r\n");
        }
        if(fileType === '.gp'){
            tempSelectedFiles = getGPPLPayload(tempSelectedFiles);
        }
        return tempSelectedFiles;
    }

    const getGPPLPayload = (selectedFiles) => {
        const tempSelectedFiles = {};
        const plNames = Object.keys(selectedFiles);
        let plItems;
        let track = {};
        let tracks = [];
        plNames.forEach(plName=>{
            tracks = [];
            plItems = selectedFiles[plName];
            plItems.forEach(plItem => {
                plItem = plItem.split(",");
                if(plItem.length === 3){
                    track = {
                        title : plItem[0],
                        album : plItem[1],
                        songPath : plItem[2]
                    }
                    tracks.push(track);
                }
            });
            tempSelectedFiles[plName] = tracks;
        });
        return tempSelectedFiles;
    }

    const submitImportPlaylists = async () => {
        let fileInput = document.getElementById(CSV_IMPORT_INPUT);
        const importInpIds = [CSV_IMPORT_INPUT, GP_IMPORT_INPUT];
        for(let i=0; i<importInpIds.length;i++){
            fileInput = document.getElementById(importInpIds[i]);
            if(fileInput.files.length > 0)break;
        }
        if(fileInput){
            if(fileInput.files.length === 0){
                alert("No file selected");
                return false;
            }
            const selectedFiles = await handleFileOnChange(fileInput);
            const fileType = fileInput.accept;
            if(window.confirm("Import Playlists ?")===true){
                setShowSpinner(true);
                dispatch(importPlaylists(selectedFiles, fileType));
            }
        }
    }

    return(
        <div className="import-export-playlist-popup-btns">
            {!showImportOptions && 
            <>
                <div className="export-playlist">
                    <button className="g-btn md success" onClick={onExportPlaylists}>
                        <span>{EXPORT_LABEL}</span>
                    </button>
                </div>
                <div className="import-playlist">
                    <button className="g-btn md success" onClick={()=>onSetShowImportOptions(true)}>
                        <span>{IMPORT_LABEL}</span>
                    </button>
                </div>
            </>
            }
            {showImportOptions &&
                <>
                    {!showSpinner ? 
                        <div className="import-options">
                            <div className="import-csv">
                                <input type="file" className="csv" accept=".csv" multiple id={CSV_IMPORT_INPUT} />
                            </div>
                            <div className="import-gp">
                                <input type="file" className="gp" accept=".gp" multiple id={GP_IMPORT_INPUT} />
                            </div>
                            <div className="import-m3u">
                                <input type="file" className="m3u" accept=".m3u" multiple disabled title={COMING_SOON_LABEL} />
                            </div>
                        </div>
                    : <div className="flex-align-center-100"><Spinner spinnerInp={{classSize:'sm', text:"Importing"}} /></div>
                    }
                </>
            }
        </div>
    );
}