import { A_TO_Z_DESC, SORT_ARTIST, SORT_YEAR } from "../../redux/GPActionTypes";

export const filterAlbums = (globalFilterText, sortedAlbums, albumListKeys) => {
    let tempFilteredAlbums = [];
    let filteredAlbums = {};
    albumListKeys.forEach(lKey =>{
        tempFilteredAlbums = sortedAlbums[lKey];
        tempFilteredAlbums = tempFilteredAlbums.filter(album => {
            return album.albumName.toLowerCase().includes(globalFilterText)
                || album.year === globalFilterText
                || album.genre.toLowerCase().includes(globalFilterText)
                || album.albumArtist.toLowerCase().includes(globalFilterText)
        });
        filteredAlbums[lKey] = tempFilteredAlbums;
    })
    return filteredAlbums;
}

export const sortAlbumKeys = (sortBy, sortedAlbums) => {
    let tempAlbumListKeys = Object.keys(sortedAlbums);
    if (sortBy === SORT_YEAR || sortBy === A_TO_Z_DESC) {
        tempAlbumListKeys =  tempAlbumListKeys.sort((a, b) => { return a > b ? -1 : 1 });
    }
    if (sortBy === SORT_ARTIST) {
        tempAlbumListKeys =  tempAlbumListKeys.sort((a, b) => { return a > b ? 1 : -1 });
    }
    return tempAlbumListKeys;
}