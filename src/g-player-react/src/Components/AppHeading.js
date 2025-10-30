import React from "react";
import g_player_icon from './images/g_player_icon.png';

export const AppHeader = () => {
    return(
        <div className="app-heading">
            <img src={g_player_icon} alt="G Player" />
            <h3>G Player</h3>
        </div>
    );
}