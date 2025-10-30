import React, { useEffect, useState } from "react"
import { useCookies } from 'react-cookie';
import { SHOW_ASSIGNED_PLAYLISTS } from "../redux/GPActionTypes";
export const ShowAssignedPlaylists = () => {
    const [checked, setChecked] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies();
    useEffect(()=>{
        setChecked(cookies.SHOW_ASSIGNED_PLAYLISTS??false)
    },[])
    const handleChange = (event) => {
        const checked = event.target.checked;
        setChecked(checked);
        if(checked){
            setCookie(SHOW_ASSIGNED_PLAYLISTS, true);
        }else{
            removeCookie(SHOW_ASSIGNED_PLAYLISTS)
        }
    }
    return(
        <div className="show-assigned-playlists library-artist-download"> {/* used class library-artist-download only to utilized its styles*/}
            <h4>Show Assigned Playlists</h4>
            <div style={{marginTop:10, display:'flex', alignItems:'center', columnGap:20}}>
                <input type="checkbox" id="show_assigned_playlists_checkbox" className="custom-checkbox" checked={checked} onChange={(event)=>handleChange(event)} />
                <span>{checked?'Shown':'Hidden'}</span>
            </div>
        </div>
    );
}