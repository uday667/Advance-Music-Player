import React from "react";
import { COMPONENT, IMPORT_EXPORT_BTN_LABEL, IMPORT_EXPORT_PLAYLIST_LABEL } from "../redux/GPActionTypes";
import { ImportExportPlaylistPopupBtns } from "./ImportExportPlaylistPopupBtns";
import { useDispatch } from "react-redux";
import { setCommonPopupObj } from "../redux/library/LibraryActions";

export const ImportExportPlaylistBtn = () => {
    const dispatch = useDispatch();
    const showImportExportPlaylistPopup = () => {
    
    const commonPopupObj = {
        showPopup: true,
        title: IMPORT_EXPORT_PLAYLIST_LABEL,
        contentType: COMPONENT,
        component: ImportExportPlaylistPopupBtns,
        primaryClassName: "no-display",

    }
    dispatch(setCommonPopupObj(commonPopupObj));
}
    return(
        <div className="import-export-playlist" onClick={showImportExportPlaylistPopup}>
            <div className="import-export-playlist-btn" >
                <span>{IMPORT_EXPORT_BTN_LABEL}</span>
            </div>
        </div>
    );
}