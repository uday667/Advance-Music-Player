import React from "react";
import { THUMBNAIL_ACTION_BTN_CIRCLE } from "./redux/GPActionTypes";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { setContextObj, setShowContextMenu } from "./redux/library/LibraryActions";
import { useDispatch } from "react-redux";

export const ThumbnailActionBtn = ({type, obj, rowList, options}) => {
    const dispatch = useDispatch();
    const showCOntextMenu = (event) => {
        const position = event.target.getBoundingClientRect();
        const contextObj = {
            position,
            type,
            obj,
            rowList,
            options
        }
        dispatch(setContextObj(contextObj));
        dispatch(setShowContextMenu(true));
    }
    return (
        <div className="thumb-action-btn-div">
            <div id={THUMBNAIL_ACTION_BTN_CIRCLE} className="thumb-action-btn-circle" onClick={(event) => showCOntextMenu(event)}>
                <div className="thumb-action-btn">
                    <HiOutlineDotsHorizontal />
                </div>
            </div>
        </div>
    );
}