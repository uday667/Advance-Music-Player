import React, { useEffect } from "react";
import { GP_SELECTOR, GP_SELECTOR_ELEM_IDS } from "../redux/GPActionTypes";
import { camelize, checkIfActionAllowed } from "./util";
import { MdKeyboardArrowRight } from "react-icons/md";

export const GPSelector = ({classPrefix, options, showGpSelector, onSetShowGpSelector}) => {

    useEffect(() => {
        if(showGpSelector){
            const handleClick = (event) => {
                if(!checkIfActionAllowed(GP_SELECTOR_ELEM_IDS, event)){
                    onSetShowGpSelector(false);
                }
            };
            window.addEventListener('click', handleClick);
            return () => {
                window.removeEventListener('click', handleClick);
            };
        }
    }, []);

    useEffect(()=>{
        if(showGpSelector){
            const handleScroll = (event) => {
                if(!checkIfActionAllowed(GP_SELECTOR_ELEM_IDS, event)){
                    onSetShowGpSelector(false);
                }
            }
            document.addEventListener('scroll', handleScroll, true);
            return () => {
                document.removeEventListener('scroll', handleScroll);
            };
        }
    },[]);

    return(
        <div className={classPrefix ? `${classPrefix}-gp-selector`:"gp-selector"} style={{display:showGpSelector?'block':'none'}} id={GP_SELECTOR}>
            {options && options.length > 0 && options.map(option => 
                <div className="row gp-link-h" onClick={()=>option.callbackFunc(option.args)}>
                    <label>{camelize(option.label)}</label>
                    <MdKeyboardArrowRight className="icon" />
                </div>
            )}
        </div>
    );
}