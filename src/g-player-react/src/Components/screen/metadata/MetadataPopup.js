import React from 'react';
import { EditTrackInfo } from './EditTrackInfo';
import { useSelector } from 'react-redux';
import { ALBUM, TRACK } from '../../redux/GPActionTypes';
import { EditAlbumInfo } from './EditAlbumInfo';

export const MetadataPopup = () => {
    const objType = useSelector(state => state.library.metadataPopupObj.objType);
    return(
        <div className='metadata-popup'>
            {objType === TRACK && <EditTrackInfo/>}
            {objType === ALBUM && <EditAlbumInfo/>}
        </div>
    );
}