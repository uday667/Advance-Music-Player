export const filterArtistDetails = (globalFilterText, artistDetails) => {
    return artistDetails?.filter(artist =>artist.artistName?.toLowerCase().includes(globalFilterText)).filter(Boolean);
}

export const filterArtistDetailsList = (globalFilterText, sortedArtists, artistListKeys) => {
    let tempFilteredArtists = [];
    let filteredArtists = {};
    artistListKeys?.forEach(lKey =>{
        tempFilteredArtists = sortedArtists[lKey];
        filteredArtists[lKey] = tempFilteredArtists
                            ?.filter(artist => {return artist.artistName.toLowerCase().includes(globalFilterText)});
    })
    return filteredArtists;
}