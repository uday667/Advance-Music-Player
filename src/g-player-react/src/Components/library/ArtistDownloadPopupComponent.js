import React from "react";

export const ArtistDownloadPopupComponent = () => {

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
    );
}