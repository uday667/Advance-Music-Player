import React, { useState } from "react";
import {BiSearchAlt2} from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

export const SearchInput = () => {
    const navigate = useNavigate();
    const [isFocussed, setIsFocussed] = useState(false);
    const searchBySearchKey = () => {
        const searchKey = document.getElementById('search_input').value;
        if(searchKey.length<3)return;
        setIsFocussed(false);
        document.getElementById('search_input').value = "";
        navigate(`/search/${searchKey}`);
        //history.pushState(`/search/${searchKey}`);
    }
    document.addEventListener("keyup",function(event){
        event.preventDefault();
        if(document.getElementById('search_input').value.length<3)return;
		if(event.key=== "Enter" && isFocussed){
			searchBySearchKey();
		}
	});
    return(
        <div className="search-container">
            <input className="search-input" id="search_input" placeholder="Search" autoComplete="OFF" onFocus={()=>setIsFocussed(true)} onBlur={()=>setIsFocussed(false)} />
            <BiSearchAlt2 onClick={searchBySearchKey} />
        </div>
    )
}