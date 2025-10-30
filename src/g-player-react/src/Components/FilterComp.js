import React, { useEffect, useState } from "react";
import {IoMdClose} from 'react-icons/io';
import { useDispatch } from "react-redux";
import { setGlobalFilterText } from "./redux/library/LibraryActions";
import { camelize } from "./utilities/util";
import { useLocation } from "react-router-dom";
export const FilterComp = ({onSetFilterTxt, isSetToStore, placeHolder}) =>{
    const dispatch = useDispatch();
    const locationL = useLocation();

    const [filterInputEvent, setFilterInputEvent] = useState(undefined);

    const onClose = () => {
        const filterInpFld = document.getElementById('filter-input-field');
        filterInpFld.value = "";
        filterInpFld.focus();
        filterInpFld.blur();
    }

    useEffect(()=>{
        if(locationL.pathname)dispatch(setGlobalFilterText(""));
    },[locationL.pathname,dispatch]);

    useEffect(() => {
        if(filterInputEvent){
            const timeOutId = setTimeout(() => {
            if(isSetToStore){
                const filterText = filterInputEvent.target.value;
                dispatch(setGlobalFilterText(filterText.toLowerCase()));
            }else{
                onSetFilterTxt(filterInputEvent);
            }
        }, 500);
        return () => clearTimeout(timeOutId);}
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [filterInputEvent]);

      useEffect(()=>{
        dispatch(setGlobalFilterText(""));
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])
    return(
        <div className='filter-component'>
            <input type="text" onChange={(event)=>setFilterInputEvent(event)} onBlur={(event)=>setFilterInputEvent(event)}
                placeholder={placeHolder ? 'Filter '+camelize(placeHolder.toLowerCase()):'Filter'} className="filter-input-field" id='filter-input-field'
                title="Supports Title, Album, Year and Genre"
            />
            <IoMdClose className="filter-close-icon" onClick={onClose} />
        </div>
    );
}