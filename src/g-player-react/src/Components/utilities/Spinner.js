import React, { useEffect, useState } from "react";
import { hideElemetAfterSomeDelay } from "./util";

export const Spinner = ({spinnerInp}) => {
    const [classSize, setClassSize] = useState("");
    useEffect(()=>{
        if(spinnerInp && spinnerInp.classSize){
            setClassSize(spinnerInp.classSize);
        }
    },[spinnerInp]);

    useEffect(()=>{
        hideElemetAfterSomeDelay("spinner",3000);
    },[]);
    return(
        <div className={`spinner ${classSize}`} id="spinner"> 
            <span className={`text ${classSize}`}>{spinnerInp && spinnerInp.text ? spinnerInp.text : 'Loading'}</span>
            <div className={`spinner-sector spinner-sector-red ${classSize}`}></div>
            <div className={`spinner-sector spinner-sector-blue ${classSize}`}></div>
            <div className={`spinner-sector spinner-sector-green ${classSize}`}></div>
        </div>
    )
}