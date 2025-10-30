import React from "react";
import { CREATE, CREATE_LABEL, CREATE_PLAYLIST_LABEL, INPUT, NEW_PLAYLIST_BTN_LABEL, PLAYLIST_NAME } from "../redux/GPActionTypes";
import { useDispatch } from "react-redux";
import { createPlaylist } from "../redux/playlist/PlaylistActions";
import { setCommonPopupObj } from "../redux/library/LibraryActions";
import { getCreatePlaylistObj } from "./PlalistUtil";

export const CreatePlayListBtn = () => {
    const dispatch = useDispatch();
    
    const showCreatePlaylistPopup = () => {
        const commonPopupObj = {
            showPopup: true,
            title: CREATE_PLAYLIST_LABEL,
            contentType: INPUT,
            placeHolder:'Playlist Name',
            primaryBtnAction: CREATE,
            primaryBtnLabel: CREATE_LABEL,
            className: "create",
            elementId: PLAYLIST_NAME,
            primaryBtnFun: onCreatePlalist

        }
        dispatch(setCommonPopupObj(commonPopupObj));
    }

    const onCreatePlalist = () => {
		dispatch(createPlaylist(getCreatePlaylistObj()));
	}

    return(
        <div className="create-playlist">
            <div className="create-playlist-btn" onClick={showCreatePlaylistPopup}>
                <span>{NEW_PLAYLIST_BTN_LABEL}</span>
            </div>
        </div>
    );
}