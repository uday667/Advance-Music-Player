package com.gmt.gp.controllers;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.gmt.gp.model.Album;
import com.gmt.gp.model.Artist;
import com.gmt.gp.model.GPResponse;
import com.gmt.gp.model.Library;
import com.gmt.gp.services.LibraryService;
import com.gmt.gp.services.MessageService;
import com.gmt.gp.util.GP_CONSTANTS;

@RequestMapping("/library")
@RestController
public class LibraryController {

    private static final Logger LOG = LoggerFactory.getLogger(LibraryService.class);

    @Autowired
    private LibraryService libraryService;

    @Autowired
    private MessageService messageService;

    @PostMapping("/build-library")
    public GPResponse runBuild(@RequestBody String buildRequestParam) {
        final String methodName = "runBuild";
        Boolean isTakePlBkp = false;
        try {
            isTakePlBkp = new JSONObject(buildRequestParam).getBoolean("isTakePlBkp");
        } catch (Exception e) {
            LOG.info(methodName + " - ", e.getMessage());
        }
        
        GPResponse resp = new GPResponse();
        List<File> fileList = new ArrayList<File>();

        boolean isImgDirExists = libraryService.checkAndCreateUserImageFolders();
        if (!isImgDirExists) {
            resp = new GPResponse(GP_CONSTANTS.FAILED, "Failed to create / featch user image folders");
            messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.FAILED);
            return resp;
        }

        messageService.removeMessageType(GP_CONSTANTS.BUILD_STATUS);
        // messageService.removeMessageName(GP_CONSTANTS.LAST_PLAYED_SONG_ID);
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.RUNNING);

        List<String> mainFolderList = messageService.getAllMusicPaths(true);

        LOG.info(methodName + " - Started searching for audio files in : " + mainFolderList);
        fileList = libraryService.getMusicFiles(mainFolderList);
        LOG.info(methodName + " - Found " + fileList.size() + " audio files");
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, "FILES_TO_READ", String.valueOf(fileList.size()));

        libraryService.deleteDirectoryContents(GP_CONSTANTS.GP_ALBUM_IMAGES_PATH);
        LOG.info(methodName + " - Deleted all images from albums folder");
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                "Deleted all images from albums folder.");

        LOG.info(methodName + " - calling build library");
        resp = libraryService.buildLibrary(fileList, isTakePlBkp);
        return resp;
    }

    @RequestMapping("/build-init-delta-library")
    public GPResponse runDeltaBuild() {
        final String methodName = "runDeltaBuild";
        GPResponse resp = new GPResponse();
        List<File> fileList = new ArrayList<File>();
        List<String> mainFolderList = messageService.getAllMusicPaths(true);

        LOG.info(methodName + " - Started searching for audio files in : " + mainFolderList);
        fileList = libraryService.getMusicFiles(mainFolderList);
        LOG.info(methodName + " - Found " + fileList.size() + " audio files");
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, "FILES_TO_READ", String.valueOf(fileList.size()));
        resp = libraryService.buildDeltaLibrary(fileList);
        return resp;
    }

    @RequestMapping("/songs")
    public List<Library> getAllSongs() {
        return libraryService.getAllSongs();
    }

    @RequestMapping("/song-ids")
    public List<Long> getAllSongIds() { // Not used
        return libraryService.getAllSongIds();
    }

    @RequestMapping("/songs-and-ids")
    public Map<String, Object> getAllSongsAndIds() {
        return libraryService.getAllSongsAndIds();
    }

    @RequestMapping("/songs/album-name/{album}")
    public List<Library> getSongsByAlbum(@PathVariable String album) {
        return libraryService.getSongsByAlbum(album);
    }

    @RequestMapping("/songs/album-name/{album}/language/{language}")
    public List<Library> getSongsByAlbumAndLanguage(@PathVariable String album, @PathVariable String language) {
        return libraryService.getSongsByAlbumAndLanguage(album, language);
    }

    @RequestMapping("/songs/artist/{artist}")
    public List<Library> getSongsByArtist(@PathVariable String artist) {
        return libraryService.getSongsByArtist(artist);
    }

    @RequestMapping("/songs/year/{year}")
    public List<Library> getSongsByYear(@PathVariable int year) {
        return libraryService.getSongsByYear(year);
    }

    @RequestMapping("/songs/genre/{genre}")
    public List<Library> getSongsByGenre(@PathVariable String genre) {
        return libraryService.getSongsByGenre(genre);
    }

    @RequestMapping("/songs/language/{language}")
    public List<Library> getSongsByLanguage(@PathVariable String language) {
        return libraryService.getSongsByLanguage(language);
    }

    @RequestMapping("/songs/album-artits/{albumArtist}")
    public List<Library> getSongsByAlbumArtist(@PathVariable String albumArtist) {
        return libraryService.getSongsByAlbumArtist(albumArtist);
    }

    @PutMapping("/song/lyrics/id/{songId}")
    public GPResponse updateLyrics(@RequestBody String lyrics, @PathVariable String songId) {
        return libraryService.updateLyrics(songId, lyrics);
    }

    @DeleteMapping("/song/lyrics/id/{songId}")
    public GPResponse deleteLyrics(@PathVariable String songId) {
        return libraryService.deleteLyrics(songId);
    }

    @RequestMapping("/albums")
    public Iterable<Album> getAllAlbums() {
        return libraryService.getAllAlbumsFromDb();
    }

    @RequestMapping("/album/album-name/{albumName}")
    public Album getAlbumByAlbumName(@PathVariable String albumName) {
        return libraryService.getAlbumByAlbumName(albumName);
    }

    @RequestMapping("/albums/genre/{genre}")
    public List<Album> getAlbumsByGenre(@PathVariable String genre) {
        return libraryService.getAlbumsByGenre(genre);
    }

    @RequestMapping("/albums/album-artist/{albumArtist}")
    public List<Album> getAllAlbumDetailsByAA(@PathVariable String albumArtist) {
        return libraryService.getAlbumListOfAA(albumArtist);
    }

    @Deprecated
    @RequestMapping("/getAlbumImgs")
    public Map<String, String> getAlbumImgs() {
        return libraryService.getAlbumImgs();
    }

    @Deprecated
    @RequestMapping("/getAllAlbumDetails")
    public Map<String, Library> getAllAlbumdetails() {
        return libraryService.getAllAlbumdetails(null, null);
    }

    @RequestMapping("/artists/type/{type}")
    public List<Artist> getAllArtistDetails(@PathVariable String type) {
        return libraryService.getAllArtistDetails(type);
    }

    @GetMapping("/artists/download-artist-images/{downloadOption}")
    public Map<String, Object> downloadArtitsImages(@PathVariable String downloadOption) {
        return libraryService.downloadArtitsImages(downloadOption);
    }

    @PutMapping("/upload-artist-image/{artistId}")
    public GPResponse uploadArtistImg(@RequestBody String imageB64, @PathVariable String artistId) {
        return libraryService.uploadArtistImg(imageB64, Long.parseLong(artistId));
    }

    @Deprecated
    @RequestMapping("/getAllAlbumArtistDetails")
    public List<String> getAllAlbumArtistDetails() {
        return libraryService.getAllAlbumArtistDetails();
    }

    @Deprecated
    @RequestMapping("/readAndStoreArtistnames/{artistType}") // Not used currently
    public Iterable<Artist> readAndStoreArtistnames(@PathVariable String artistType) {
        return libraryService.setArtistLocalImgAvlStatusList(artistType, null);
    }

    @Deprecated
    @RequestMapping("/resizeArtistImgs") // Not used currently
    public void resizeArtistImgs() {
        libraryService.resizeArtistImgs();
    }

    @RequestMapping("/genre-details")
    public Map<String, Object> getGenreDetails() {
        return libraryService.getGenreDetails();
    }

    @RequestMapping("/language-details")
    public Map<String, Object> getLanguageDetails() {
        return libraryService.getLanguageDetails();
    }

    // Edit MP3 file apis
    @GetMapping("/update-mp3-files/{field}")
    public GPResponse updateMp3Files(@RequestParam String path, @RequestParam String value,
            @PathVariable String field) {
        return libraryService.updateMp3Files(path, field, value);
    }

    @PostMapping("/edit-track-info/{type}")
    public GPResponse updateTrackInfo(@RequestBody Library reqLibrary, @PathVariable String type) {
        return libraryService.updateTrackInfo(reqLibrary, type);
    }

    @PostMapping("/edit-album-info")
    public GPResponse updateAlbumInfo(@RequestBody Album reqAlbum) {
        return libraryService.updateAlbumInfo(reqAlbum);
    }

    // Search apis
    @RequestMapping("/search/key/{searchKey}")
    public Map<String, List<Object>> searchbyKey(@PathVariable String searchKey) {
        return libraryService.searchbyKey(searchKey);
    }

}
