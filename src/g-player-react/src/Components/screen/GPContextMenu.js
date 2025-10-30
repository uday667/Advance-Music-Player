import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCommonPopupObj, setShowContextMenu, setShowPlaylistSelector } from "../redux/library/LibraryActions";
import { ADD_TOPLAYLIST_LABEL, ALBUM, ARTIST, COMPONENT, GP_CONTEXT_MENU, GP_CONTEXT_MENU_ELEM_IDS, MAIN_CONTAINER, MULTIPLE_TRACKS, TRACK } from "../redux/GPActionTypes";
import { MdKeyboardArrowRight } from 'react-icons/md';
import { Link } from "react-router-dom";
import { checkIfActionAllowed } from "../utilities/util";
import { PlaylistSelector as PlaylistSelectorV2 } from "../playlist/PlayllistSelectorV2";

export const GPContexMenu = () => {
    const dispatch = useDispatch();
    const contextObj = useSelector(state => state.library.contextObj);
    const showContextMenu = useSelector(state => state.library.showContextMenu);
    const [styles, setStyles] = useState({display:'none'});
    const gpCtxtMenuElem = document.getElementById(GP_CONTEXT_MENU);
    useEffect(()=>{
        if(contextObj && contextObj.position){
            const position = contextObj.position;
            const tempStyles = {
                left : parseInt(position.x)-6
            }
            const mainContainerHeight = document.getElementById(MAIN_CONTAINER).clientHeight;
            let gpCtxtMenuHeight = document.getElementById(GP_CONTEXT_MENU).clientHeight;
            if(gpCtxtMenuHeight === undefined || gpCtxtMenuHeight === 0)gpCtxtMenuHeight = 160;
            if((mainContainerHeight - position.top) > gpCtxtMenuHeight+ 40){
                tempStyles.top = parseInt(position.y)+25;
                
            }else{
                tempStyles.top = parseInt(position.y);//-gpCtxtMenuHeight;
                tempStyles.showTop = true;
            }

            const mainContainerWidth = document.getElementById(MAIN_CONTAINER).clientWidth;
            let gpCtxtMenuWidth = document.getElementById(GP_CONTEXT_MENU).clientWidth;
            if(gpCtxtMenuWidth === undefined || gpCtxtMenuWidth === 0)gpCtxtMenuWidth = 200;
            if((mainContainerWidth - position.left) < gpCtxtMenuWidth+40){
                tempStyles.left = parseInt(position.x)-190;
            }
            setStyles(tempStyles);
        }
        
    },[contextObj]);

    useEffect(()=>{
        if(gpCtxtMenuElem && styles.showTop){
            const tempStyles = {...styles};
            tempStyles.top = tempStyles.top - gpCtxtMenuElem.clientHeight;
            setStyles(tempStyles);
        }
    },[gpCtxtMenuElem]);

    useEffect(() => {
        const handleClick = (event) => {
            //dispatch(setShowContextMenu(tempIsclickedOnCM));
            if(!checkIfActionAllowed(GP_CONTEXT_MENU_ELEM_IDS, event)){
                dispatch(setShowPlaylistSelector(false));
                dispatch(setShowContextMenu(false));
            }
        };
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    useEffect(()=>{
        if(showContextMenu){
            const handleScroll = (event) => {
                if(!checkIfActionAllowed(GP_CONTEXT_MENU_ELEM_IDS, event)){
                    dispatch(setShowContextMenu(false));
                    dispatch(setShowPlaylistSelector(false));
                }
            }
            document.addEventListener('scroll', handleScroll, true);
            return () => {
                document.removeEventListener('scroll', handleScroll);
            };
        }
    },[]);

    const onSetShowPlaylistSelector = (showPlaylistSelector) => {
        if(contextObj.type===TRACK || contextObj.type===MULTIPLE_TRACKS){
            const commonPopupObj = {
                showPopup: true,
                title: ADD_TOPLAYLIST_LABEL,
                contentType: COMPONENT,
                component: PlaylistSelectorV2,
                primaryClassName: "no-display",
                popContStyle:{
                    width:'60%'
                },
                popupStyle:{
                    top:'-5vh'
                }
        
            }
            dispatch(setCommonPopupObj(commonPopupObj));
        }else{
            dispatch(setShowPlaylistSelector(showPlaylistSelector));
        }
     }

     const closeCOntextMenu = () => {
        dispatch(setShowContextMenu(false));
        dispatch(setShowPlaylistSelector(false));
    }

    return(
        <div id={GP_CONTEXT_MENU} className="gp-context-menu" style={styles}>
            <div className="row" onClick={()=>{onSetShowPlaylistSelector(true);if(contextObj.type===TRACK)closeCOntextMenu()}}>
                <label>Add to playlist</label>
                <MdKeyboardArrowRight className="icon" />
            </div>
            {contextObj.rowList.includes(ALBUM) && <div className="row">
                <Link to={`/music/albums/${contextObj.obj.albumName?contextObj.obj.albumName:contextObj.obj.album}`} onClick={closeCOntextMenu}>
                    <label>Album</label>
                    <MdKeyboardArrowRight className="icon" />
                </Link>
            </div>}
            {contextObj.rowList.includes(ARTIST) && <div className="row">
                <Link to={`/music/album_artists/${contextObj.obj.albumArtist}`} onClick={closeCOntextMenu}>
                    <label>Artist</label>
                    <MdKeyboardArrowRight className="icon" />
                </Link>
            </div>}
            {contextObj && contextObj.options && contextObj.options.length > 0 && contextObj.options.map(option =>
                <>
                    {option.link &&
                        <Link to={option.link}>
                            <div className="row" onClick={closeCOntextMenu}>
                                <label>{option.label}</label>
                                <MdKeyboardArrowRight className="icon" />
                            </div>
                        </Link>
                    }
                    {!option.link &&
                        <div className="row" onClick={()=>{option.callBackFunc(option.args?option.args:null);closeCOntextMenu()}}>
                            <label>{option.label}</label>
                            <MdKeyboardArrowRight className="icon" />
                        </div>
                    }
                </>
            )
                
            }
        </div>
    );
}