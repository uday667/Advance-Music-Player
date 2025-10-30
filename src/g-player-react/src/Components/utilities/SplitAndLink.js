import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { camelize } from "./util";

export const SplitAndLink = ({str, url}) => {
    const [strs, setStrs] = useState([]);
    useEffect(()=>{
        let strArr = [str];
        let splitters = [",",";","&","/"];
        if(str){
            splitters.forEach(splitter =>{
                strArr = filterStrList(strArr, splitter);
            });
            setStrs(strArr);
        }
    },[str]);

    const filterStrList = (strArr, splitter) => {
        let strArr1 = [];
        let str = null;
        for(var i=0;i<strArr.length;i++){
            str = strArr[i].trim();
            if(str.includes(splitter)){
                strArr = str.split(splitter);
                // eslint-disable-next-line react-hooks/exhaustive-deps
                strArr.forEach(str1=>{
                    if(!strArr1.includes(str1)){
                        strArr1.push(str1);
                    }
                });
            }else{
                strArr1.push(str);
            }
        }
        strArr1 = strArr1.filter((item, 
            index) => strArr1.indexOf(item) === index);
        return strArr1;
    }

    return(
        <>
        {strs && strs.map((str,index)=>
            <span key={index}>
                <span key={index+'deli'}>{index===0?'':', '}</span><Link to={`${url}${str}`} key={index}>{camelize(str)}</Link>
            </span>    
        )}
        </>
    );
}