import { DELETE_LABEL, DELETE_PLAYLIST_CONF_TEXT, DELETE_PLAYLIST_LABEL, PLAYLIST_NAME, REMOVE, TEXT } from "../redux/GPActionTypes";

export const getCreatePlaylistObj = () => {
    const playlistName = document.getElementById(PLAYLIST_NAME);
    if(!playlistName || playlistName.value === ""){
        if(playlistName)playlistName.style.border = '1px solid red';
        return;
    }
    playlistName.style.border = '1px solid lightgrey';
    const playlist = {
        // "name":"PLAYLIST",
        // "value":playlistName.value,
        // "type":"PLAYLIST"
        "name":playlistName.value
        }
    return {playlist};
}

export const getShowDeletePlaylistPopup = (callBackFun, args) => {
    const commonPopupObj = {
        showPopup: true,
        title: DELETE_PLAYLIST_LABEL,
        content: DELETE_PLAYLIST_CONF_TEXT,
        contentType: TEXT,
        primaryBtnAction: REMOVE,
        primaryBtnLabel:DELETE_LABEL,
        className:"remove",
        primaryBtnFun: callBackFun,
        args

    }
    return commonPopupObj;
}