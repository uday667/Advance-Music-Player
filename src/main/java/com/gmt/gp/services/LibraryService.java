package com.gmt.gp.services;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.sql.rowset.serial.SerialBlob;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.tomcat.util.codec.binary.Base64;
import org.jaudiotagger.audio.AudioFile;
import org.jaudiotagger.audio.AudioFileIO;
import org.jaudiotagger.audio.exceptions.CannotReadException;
import org.jaudiotagger.audio.exceptions.CannotWriteException;
import org.jaudiotagger.audio.exceptions.InvalidAudioFrameException;
import org.jaudiotagger.audio.exceptions.ReadOnlyFileException;
import org.jaudiotagger.tag.FieldDataInvalidException;
import org.jaudiotagger.tag.FieldKey;
import org.jaudiotagger.tag.KeyNotFoundException;
import org.jaudiotagger.tag.Tag;
import org.jaudiotagger.tag.TagException;
import org.jaudiotagger.tag.datatype.Artwork;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gmt.gp.model.Album;
import com.gmt.gp.model.Artist;
import com.gmt.gp.model.GPResponse;
import com.gmt.gp.model.History;
import com.gmt.gp.model.Library;
import com.gmt.gp.model.Message;
import com.gmt.gp.model.PlaylistItem;
import com.gmt.gp.repositories.AlbumRepository;
import com.gmt.gp.repositories.ArtistRepository;
import com.gmt.gp.repositories.LibraryRepository;
import com.gmt.gp.util.GPUtil;
import com.gmt.gp.util.GP_CONSTANTS;
import com.gmt.gp.util.ZipCompress;

import java.awt.image.BufferedImage;
import java.awt.Image;

@Service
public class LibraryService {

    private static final Logger LOG = LoggerFactory.getLogger(LibraryService.class);

    @Autowired
    private HistoryService historyService;

    @Autowired
    private MessageService messageService;

    @Autowired
    @Lazy
    private PlaylistService playlistService;

    @Autowired
    private LibraryRepository libraryRepository;

    @Autowired
    private AlbumRepository albumRepository;

    @Autowired
    private ArtistRepository artistRepository;

    // @Value("${library.ALBUM_IMAGES_PATH}")
    // private String ALBUM_IMAGES_PATH =
    // "D:\\SWorkspace\\G-Player-SB\\src\\main\\resources\\public\\images\\albums\\";

    // @Value("${library.ARTIST_IMAGES_PATH}")
    // private String ARTIST_IMAGES_PATH =
    // "D:\\SWorkspace\\G-Player-SB\\src\\main\\resources\\public\\images\\artists\\";

    // Library Build
    static FileFilter mp3filter = new FileFilter() {
        @Override
        public boolean accept(File file) {
            if (file.getName().endsWith(".mp3") || file.getName().endsWith(".m4a")) {
                return true;
            }
            return false;
        }
    };

    public List<File> getMusicFiles(List<String> mainFolderList) {
        List<File> fileList = new ArrayList<File>();
        try {
            List<File> tempFileList = new ArrayList<File>();
            FileFilter folderFilter = new FileFilter() {
                public boolean accept(File file) {
                    return file.isDirectory();
                }
            };
            File[] folders = null;
            for (String mainFolder : mainFolderList) {
                File musicDir = new File(mainFolder);
                fileList.addAll(Arrays.asList(musicDir.listFiles(mp3filter)));
                folders = musicDir.listFiles(folderFilter);
                fileList.addAll(recursiveSearch(folders, 0, 0, tempFileList));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileList;
    }

    public List<File> recursiveSearch(File[] folders, int index, int level, List<File> tempFileList) {
        // terminate condition
        if (index == folders.length)
            return tempFileList;

        // for files
        if (folders[index].isFile()) {
            if (folders[index].getName().endsWith(".mp3") || folders[index].getName().endsWith(".m4a")) {
                tempFileList.add(folders[index]);
            }

        }
        // for sub-directories
        else if (folders[index].isDirectory()) {
            recursiveSearch(folders[index].listFiles(), 0, level + 1, tempFileList);
        }

        // recursion for main directory
        recursiveSearch(folders, ++index, level, tempFileList);
        return tempFileList;
    }

    @Transactional
    public GPResponse buildLibrary(List<File> fileList, boolean isTakePlBkp) {

        final String methodName = "buildLibrary";

        AudioFile audioF = null;
        Tag tag = null;
        File mpFile = null;

        Library library = null;
        Album album = null;
        Artist artist = null;
        Artist albumArtist = null;

        String artistName = null;
        String[] artistNameArr = null;
        byte[] albumImg = null;
        List<Artist> artistList = new ArrayList<Artist>();
        List<Library> libList = new ArrayList<Library>();
        List<Album> tempAlbumList = new ArrayList<Album>();
        List<Album> albumList = new ArrayList<Album>();
        Map<String, Integer> artistArtCount = new HashMap<String, Integer>();
        Map<String, Integer> albumArtistArtCount = new HashMap<String, Integer>();
        int artistCount = 0;
        int artCount = 0;
        int exceptionCounter = 0;
        int fileListCounter = 0;
        boolean stepSuccess = true;
        long startingTime = System.currentTimeMillis();
        boolean isAlbumAdded = false;
        Map<String, List<String>> albumLanguageMap = new HashMap<String, List<String>>();
        List<String> languageList = null;
        String artistImgAvailablePath = null;
        Library songPlaying = null;
        Message lastPlayedSongId = null;

        LOG.info(methodName + " - Started reading audiofiles using jaudiotagger, files to read: " + fileList.size());
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                "Started reading audiofiles using jaudiotagger");
        removeJAudioTagLogger();
        GPUtil.ThreadSleep(500);

        try { // label for try block : main_try_for_method_buildLibrary
            lastPlayedSongId = messageService.getMessageByName(GP_CONSTANTS.LAST_PLAYED_SONG_ID);
            if (lastPlayedSongId != null) {
                songPlaying = getSongBySongId(Long.parseLong(lastPlayedSongId.getValue()));
            }

            for (int i = 0; i < fileList.size(); i++) {
                fileListCounter++;
                isAlbumAdded = false;
                try { // label for try block : file_list_for_loop
                    try { // label for try block : jaudiotagger_read
                        mpFile = fileList.get(i);
                        audioF = AudioFileIO.read(mpFile);
                        tag = audioF.getTag();
                        library = getLibraryFromFile(tag, audioF, mpFile);
                        libList.add(library);
                        if (library.getArtist() != null) {
                            artistName = library.getArtist().trim();
                            if (library.getArtist().contains(",") || library.getArtist().contains(";")
                                    || library.getArtist().contains("&")) {
                                artistName = artistName.replaceAll("[;&]", ",");
                                artistNameArr = artistName.split(",");
                                for (String artistName1 : artistNameArr) {
                                    if (artistName1 != null)
                                        artistName1 = artistName1.trim();
                                    if (artistArtCount.get(artistName1) != null) {
                                        artistArtCount.put(artistName1, artistArtCount.get(artistName1) + 1);
                                    } else {
                                        artistArtCount.put(artistName1, 1);
                                    }
                                }
                            } else {
                                if (artistArtCount.get(artistName) != null) {
                                    artistArtCount.put(artistName, artistArtCount.get(artistName) + 1);
                                } else {
                                    artistArtCount.put(artistName, 1);
                                }
                            }
                        }
                    } catch (Exception e) {
                        LOG.error(methodName + " - Exception in jaudiotagger_read, exceptionCount: "
                                + ++exceptionCounter);
                        LOG.error(methodName + " - File Filed: " + fileList.get(i));
                        e.printStackTrace();
                    }

                    isAlbumAdded = isContainsCurrentAlbum(tempAlbumList, library.getAlbum(), library.getLanguage());
                    if (!isAlbumAdded) {
                        if (albumLanguageMap.containsKey(library.getAlbum())) {
                            languageList = albumLanguageMap.get(library.getAlbum());
                            languageList.add(library.getLanguage());
                            albumLanguageMap.put(library.getAlbum(), languageList);
                        } else {
                            languageList = new ArrayList<String>();
                            languageList.add(library.getLanguage());
                            albumLanguageMap.put(library.getAlbum(), languageList);
                        }
                    }

                    if (!isAlbumAdded) {
                        albumImg = getAlbumImgBinFromTag(tag);
                        // if (albumImg != null) {
                        album = new Album();
                        album.setAlbumName(library.getAlbum());
                        album.setAlbumArtist(library.getAlbumArtist());
                        album.setComposer(library.getComposer());
                        album.setGenre(library.getGenre());
                        album.setLanguage(library.getLanguage());
                        album.setTotaltracks(library.getTotaltracks());
                        album.setYear(library.getYear());
                        if (albumImg != null) {
                            album = writeByteArrayToImgFile(album, albumImg);
                        } else {
                            album.setAlbumImgAvl(false);
                        }
                        tempAlbumList.add(album);
                        if (album.getAlbumArtist() != null) {
                            artistName = album.getAlbumArtist().trim();
                            if (albumArtistArtCount.get(artistName) != null) {
                                albumArtistArtCount.put(artistName, albumArtistArtCount.get(artistName) + 1);
                            } else {
                                albumArtistArtCount.put(artistName, 1);
                            }
                        }
                        // } else {
                        // Logic to include albums without image -- Think about something
                        // }
                    }

                } catch (Exception e) {
                    LOG.error(methodName + " - Exception in file_list_for_loop, exceptionCount: " + ++exceptionCounter);
                    e.printStackTrace();
                    break;
                }
                if (fileListCounter == 300) {
                    LOG.info(methodName + " - Reading audiofiles,  remaining files: " + (fileList.size() - i));
                    messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.FILES_TO_READ,
                            String.valueOf((fileList.size() - i)));
                    fileListCounter = 0;
                }
            }
            long endingTime = System.currentTimeMillis();
            messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.FILES_TO_READ, "0");
            GPUtil.ThreadSleep(1000);
            messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                    "Finished reading all music files.");
            LOG.info(methodName + " - Time took to read mp3 metadata: " + (endingTime - startingTime) + " ms, "
                    + (endingTime - startingTime) / 1000 + " secs");
            messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.FILES_READ_TIME,
                    String.valueOf((endingTime - startingTime)));

            startingTime = System.currentTimeMillis();
            messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                    "Reading artists");
            GPUtil.ThreadSleep(1000);
            List<String> artistNameList = new ArrayList<String>(artistArtCount.keySet());// getFilteredArtistDetailsFromDb(ARTIST);
            for (String artistName2 : artistNameList) {
                artCount = artistArtCount.get(artistName2) != null ? artistArtCount.get(artistName2) : 0;
                artistImgAvailablePath = isArtistImgAvailabeInLocal(artistName2);
                artist = new Artist();
                artist.setArtistName(artistName2);
                artist.setType(GP_CONSTANTS.ARTIST);
                artist.setImgAvl(false);
                artist.setCount(artCount);
                artist.setImageSource(artistImgAvailablePath);
                artist.setImgAvl(artistImgAvailablePath != null);
                artistList.add(artist);
            }
            artistCount = artistList.size(); // Reading artist count before inserting album artist into same list

            List<String> albumArtistNameList = new ArrayList<String>(albumArtistArtCount.keySet());// getFilteredArtistDetailsFromDb(ALBUM_ARTIST);
            for (String albumArtistName : albumArtistNameList) {
                artCount = albumArtistArtCount.get(albumArtistName) != null ? albumArtistArtCount.get(albumArtistName)
                        : 0;
                artistImgAvailablePath = isArtistImgAvailabeInLocal(albumArtistName);
                albumArtist = new Artist();
                albumArtist.setArtistName(albumArtistName);
                albumArtist.setType(GP_CONSTANTS.ALBUM_ARTIST);
                albumArtist.setImgAvl(false);
                albumArtist.setCount(artCount);
                albumArtist.setImageSource(artistImgAvailablePath);
                albumArtist.setImgAvl(artistImgAvailablePath != null);
                artistList.add(albumArtist);
            }
            endingTime = System.currentTimeMillis();
            LOG.info(methodName + " - Time took to filter and update imgAvl of artist and album artist: "
                    + (endingTime - startingTime) + " ms, " + (endingTime - startingTime) / 1000 + " secs");
            GPUtil.ThreadSleep(1000);

            try {
                truncateMyTable();
                LOG.info(methodName + " - Truncated all repositories.");
                messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                        "Truncated all repositories.");
                GPUtil.ThreadSleep(1000);
            } catch (Exception e) {
                e.printStackTrace();
                LOG.error(methodName + " - Exception while trucating tables , exceptionCount: " + ++exceptionCounter);
                stepSuccess = false;
                messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                        "Exception while trucating tables");
            }

            if(isTakePlBkp && stepSuccess){
                stepSuccess= false;
                GPResponse exportResp = playlistService.exportPlaylists(isTakePlBkp);
                String playlistPath = exportResp.getStatus1();
                boolean isZipCreated = ZipCompress.compress(playlistPath);
                if(isZipCreated){
                    if(deleteDirectoryContents(playlistPath)){
                        if(!deleteDirectory(playlistPath)){
                            LOG.error(methodName + " - Exception while deleteing temp playlists folder at "+playlistPath+", please check and delete manually if possible");
                        }
                    }else{
                        LOG.error(methodName + " - Exception while deleteing temp playlists folder contents at "+playlistPath+", please check and delete manually if possible");
                    }
                }else{
                    LOG.error(methodName + " - Exception while exporting playlists, please check and take manual backup if possible");
                }
                stepSuccess = true;
            }

            if (stepSuccess) {
                startingTime = System.currentTimeMillis();
                messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                        "Saving library, album and artists list");
                libList = (List<Library>) libraryRepository.saveAll(libList);

                String language = "";
                String[] tempLanguageArr = null;
                for (Album tempAlbum : tempAlbumList) {
                    language = "";
                    languageList = albumLanguageMap.get(tempAlbum.getAlbumName());
                    if (!isContainsCurrentAlbum(albumList, tempAlbum.getAlbumName(), null)) {
                        if (languageList.size() > 1) {
                            tempAlbum.setLanguageType(GP_CONSTANTS.MULTI_LINGUAL);
                            // tempAlbum.setLanguages(String.join(",", languageList));
                            for (String tempLanguage : languageList) {
                                tempLanguageArr = null;
                                if (tempLanguage.contains(",")) {
                                    tempLanguageArr = tempLanguage.split(",");
                                } else if (tempLanguage.contains("/")) {
                                    tempLanguageArr = tempLanguage.split("/");
                                }
                                if (tempLanguageArr != null) {
                                    for (String tempLanguage1 : tempLanguageArr) {
                                        if (!language.contains(tempLanguage1)) {
                                            if (language == "") {
                                                language += tempLanguage1;
                                            } else {
                                                language += "," + tempLanguage1;
                                            }
                                        }
                                    }

                                } else {
                                    if (!language.contains(tempLanguage)) {
                                        if (language == "") {
                                            language += tempLanguage;
                                        } else {
                                            language += "," + tempLanguage;
                                        }
                                    }
                                }

                            }
                            tempLanguageArr = null;
                        } else {
                            tempAlbum.setLanguageType(GP_CONSTANTS.MONO_LINGUAL);
                        }
                        tempAlbum.setLanguages(language);
                        albumList.add(tempAlbum);
                    }

                }

                albumList = (List<Album>) albumRepository.saveAll(albumList);
                artistRepository.saveAll(artistList);
                endingTime = System.currentTimeMillis();
                LOG.info(methodName + " - Time took to save library, album and artists list: "
                        + (endingTime - startingTime) + " ms, " + (endingTime - startingTime) / 1000 + " secs");

                startingTime = System.currentTimeMillis();

                GPUtil.ThreadSleep(1000);
                messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                        "Started updating history");
                List<History> historyList = historyService.getAllHistory();
                List<History> historyListR = new ArrayList<History>();
                List<History> historyListU = new ArrayList<History>();
                History history = null;
                for (int i = 0; i < historyList.size(); i++) {
                    history = historyList.get(i);
                    library = getLibraryFromLibList(libList, history);
                    if (library != null) {
                        history.setSongId(library.getSongId());
                        history.setSongPath(library.getSongPath());
                        historyListU.add(history);
                    } else {
                        historyListR.add(history);
                    }
                }

                historyService.removeAll(historyListR);
                historyService.saveAll(historyListU);
                endingTime = System.currentTimeMillis();
                LOG.info(methodName + " - Time took to update history table : " + (endingTime - startingTime) + " ms, "
                        + (endingTime - startingTime) / 1000 + " secs");

                messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS_STEP,
                        "Started updating playlists");
                startingTime = System.currentTimeMillis();
                List<PlaylistItem> playlistItems = playlistService.getAllPlaylistItems();
                List<PlaylistItem> playlistItemsR = new ArrayList<PlaylistItem>();
                List<PlaylistItem> playlistItemsU = new ArrayList<PlaylistItem>();
                PlaylistItem playlistItem = null;
                for (int i = 0; i < playlistItems.size(); i++) {
                    playlistItem = playlistItems.get(i);
                    library = getLibraryFromLibList(libList, playlistItem);
                    if (library != null) {
                        playlistItemsU.add(playlistItem.merge(library));
                    } else {
                        playlistItemsR.add(playlistItem);
                    }
                }
                playlistService.removeAll(playlistItemsR);
                playlistService.saveAll(playlistItemsU);
                endingTime = System.currentTimeMillis();
                LOG.info(methodName + " - Time took to update playlistitems table : " + (endingTime - startingTime)
                        + " ms, "
                        + (endingTime - startingTime) / 1000 + " secs");
            }
        } catch (Exception e) {
            LOG.error(methodName + " - Exception in main_try_for_method_buildLibrary, exceptionCount: "
                    + ++exceptionCounter);
            e.printStackTrace();
        }
        LOG.error(methodName + " - exceptionCount: " + exceptionCounter);
        LOG.info(methodName + " - Summary: \nTotal tracks: " + libList.size() + " \nTotal albums: " + albumList.size()
                + " \nArtists found: " + artistCount + " \nAlbum artist found: " + (artistList.size() - artistCount));
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.TOTAL_TRACKS,
                String.valueOf(libList.size()));
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.ALBUM_COUNT,
                String.valueOf(albumList.size()));
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.ARTIST_COUNT,
                String.valueOf(artistCount));
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.ALBUM_ARTIST_COUNT,
                String.valueOf((artistList.size() - artistCount)));
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.COMPLETED);
        messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_COMPLETED_TIME,
                LocalDateTime.now().toString());
        try {
            songPlaying = getSongBySongPath(songPlaying.getSongPath());
            lastPlayedSongId.setValue(String.valueOf(songPlaying.getSongId()));
            messageService.saveMaMessage(lastPlayedSongId);
        } catch (Exception e) {
            LOG.error(methodName + " - Exception while updating last played song id");
            e.printStackTrace();
        }
    return new GPResponse(messageService.getMessagesByType(GP_CONSTANTS.BUILD_STATUS));
    }

    public Library getLibraryFromFile(Tag tag, AudioFile audioF, File mpFile) throws Exception {
        Library library = new Library();
        String genre = "";
        String language = "";
        try {
            library = new Library();
            if (!tag.getFirst(FieldKey.TITLE).equals("") && tag.getFirst(FieldKey.TITLE) != null) {
                library.setTitle(tag.getFirst(FieldKey.TITLE));
            } else {
                library.setTitle(GPUtil.removeExtention(mpFile.getName(), GP_CONSTANTS.GP_FILE_TYPE_ARR));
            }

            if (!tag.getFirst(FieldKey.ARTIST).equals("") && tag.getFirst(FieldKey.ARTIST) != null) {
                library.setArtist(tag.getFirst(FieldKey.ARTIST));
            } else {
                library.setArtist(GP_CONSTANTS.UNKNOWN_LABEL);
            }

            if (!tag.getFirst(FieldKey.ALBUM).equals("") && tag.getFirst(FieldKey.ALBUM) != null) {
                library.setAlbum(tag.getFirst(FieldKey.ALBUM));
            } else {
                library.setAlbum(GP_CONSTANTS.UNKNOWN_LABEL);
            }

            try {
                library.setTrackNumber(Integer.parseInt(tag.getFirst(FieldKey.TRACK)));
            } catch (Exception e) {
            }

            try {
                library.setYear(Integer.parseInt(tag.getFirst(FieldKey.YEAR)));
            } catch (Exception e) {
            }

            if (!tag.getFirst(FieldKey.COMPOSER).equals("") && tag.getFirst(FieldKey.COMPOSER) != null) {
                library.setComposer(tag.getFirst(FieldKey.COMPOSER));
            } else {
                if (library.getAlbumArtist()!=null && !library.getAlbumArtist().equals(GP_CONSTANTS.UNKNOWN_LABEL)) {
                    library.setComposer(library.getAlbumArtist());
                } else {
                    library.setComposer(GP_CONSTANTS.UNKNOWN_LABEL);
                }
            }

            if (!tag.getFirst(FieldKey.ALBUM_ARTIST).equals("") && tag.getFirst(FieldKey.ALBUM_ARTIST) != null) {
                library.setAlbumArtist(tag.getFirst(FieldKey.ALBUM_ARTIST));
            } else {
                if (!library.getComposer().equals(GP_CONSTANTS.UNKNOWN_LABEL)) {
                    library.setAlbumArtist(library.getComposer());
                } else {
                    library.setAlbumArtist(GP_CONSTANTS.UNKNOWN_LABEL);
                }
            }

            if (!tag.getFirst(FieldKey.GENRE).equals("") && tag.getFirst(FieldKey.GENRE) != null) {
                genre = tag.getFirst(FieldKey.GENRE);
                if (genre.contains("/")) {
                    genre = genre.replaceAll("/", ",");
                }
                library.setGenre(genre.toLowerCase());
            } else {
                library.setGenre(GP_CONSTANTS.UNKNOWN_LABEL);
            }

            try {
                library.setTotaltracks(Integer.parseInt(tag.getFirst(FieldKey.TRACK_TOTAL)));
            } catch (Exception e) {
            }

            if (!tag.getFirst(FieldKey.LYRICIST).equals("") && tag.getFirst(FieldKey.LYRICIST) != null)
                library.setLyricist(tag.getFirst(FieldKey.LYRICIST));

            if (!tag.getFirst(FieldKey.LYRICS).equals("") && tag.getFirst(FieldKey.LYRICS) != null)
                library.setLyricsAvl(true);
            else
                library.setLyricsAvl(false);

            if (!tag.getFirst(FieldKey.LANGUAGE).equals("") && tag.getFirst(FieldKey.LANGUAGE) != null) {
                language = tag.getFirst(FieldKey.LANGUAGE).toLowerCase();
                if (language.contains("/")) {
                    language = language.replaceAll("/", ",");
                }
                library.setLanguage(language);
            } else {
                library.setLanguage(GP_CONSTANTS.UNKNOWN_LABEL);
            }

            if (!tag.getFirst(FieldKey.RECORD_LABEL).equals("") && tag.getFirst(FieldKey.RECORD_LABEL) != null) {
                library.setLabel(tag.getFirst(FieldKey.RECORD_LABEL));
            } else {
                library.setLabel(GP_CONSTANTS.UNKNOWN_LABEL);
            }

            try {
                library.setTrackLength(audioF.getAudioHeader().getTrackLength());
            } catch (Exception e) {
                throw e;
            }

            library.setSongPath(mpFile.getAbsolutePath());

        } catch (Exception e) {
            throw e;
        }
        return library;
    }

    // Library Build - End

    // Transactional / Repository methods - Start
    // libraryRepository - start
    public List<Library> getAllSongs() {
        return libraryRepository.findAllByOrderByTitleAsc();
    }

    public List<Long> getAllSongIds() {
        return libraryRepository.getAllLibraryIds();
    }

    public Map<String, Object> getAllSongsAndIds() {
        Map<String, Object> songs = new HashMap<String, Object>();
        songs.put("SONGS", libraryRepository.findAllByOrderByTitleAsc());
        songs.put("SONG_IDS", libraryRepository.getAllLibraryIds());
        songs.put("HISTORY", historyService.getSongIdAndCoundOrderByCountDesc());
        return songs;
    }

    public Library getSongBySongId(long songId) {
        return libraryRepository.getBySongId(songId);
    }

    public List<Library> getSongsBySongIds(List<Long> songIds) {
        return libraryRepository.getSongsBySongIds(songIds);
    }

    public List<Library> getSongsBySongIds(String[] songIds) {
        List<Long> songIdsLong = new ArrayList<Long>();
        Long songIdLong = null;
        for (String songId : songIds) {
            songIdLong = Long.parseLong(songId);
            if(songIdLong!=null){
                songIdsLong.add(songIdLong);
            }

        }
        return libraryRepository.getSongsBySongIds(songIdsLong);
    }

    public List<Library> getSongsByAlbum(String album) {
        return libraryRepository.getByAlbum(album);
    }

    public List<Library> getSongsByAlbumAndLanguage(String album, String language) {
        return libraryRepository.getByAlbumAndLanguageQ(album, language);
    }

    public List<Library> getSongsByYear(int year) {
        return libraryRepository.getByYear(year);
    }

    public List<Library> getSongsByGenre(String genre) {
        return libraryRepository.getByGenreContainsIgnoreCase(genre);
    }

    public List<Library> getSongsByLanguage(String language) {
        return libraryRepository.getByLanguageContainsIgnoreCase(language);
    }

    public Library getSongBySongPath(String songPath) {
        return libraryRepository.getBySongPath(songPath);
    }

    public List<Library> getSongsBySongPath(List<String> songPathList) {
        return libraryRepository.getSongsBySongPath(songPathList);
    }

    public List<Library> getSongsByAlbumArtist(String albumArtist) {
        return libraryRepository.getByAlbumArtistOrderByAlbum(albumArtist);
    }

    public List<String> getAllAlbumArtistDetails() {
        return libraryRepository.findAllByGroupByAlbumArtist();
    }

    public List<Library> getSongsByArtist(String artist) {
        List<Library> songsByArtist = libraryRepository.getByArtistContains(artist);
        List<Library> resultSongsByArtist = new ArrayList<Library>();
        Library song = null;
        String songArtist = "";
        String[] songArtistArr = null;
        for (int i = 0; i < songsByArtist.size(); i++) {
            song = songsByArtist.get(i);
            songArtist = song.getArtist();
            if (songArtist == null)
                continue;
            songArtist = songArtist.trim();
            if (songArtist.contains(",") || songArtist.contains(";") || songArtist.contains("&")) {
                songArtist = songArtist.replaceAll("[;&]", ",");
                songArtistArr = songArtist.split(",");
                for (String songArtist1 : songArtistArr) {
                    if (songArtist1.trim().equalsIgnoreCase(artist)) {
                        resultSongsByArtist.add(song);
                        break;
                    }
                }
            } else {
                if (songArtist.equalsIgnoreCase(artist)) {
                    resultSongsByArtist.add(song);
                }
            }
        }
        return resultSongsByArtist;
    }

    List<Library> findAllByIds(List<Long> songIds) {
        return (List<Library>) libraryRepository.findAllById(songIds);
    }

    public void deleteSongBySongId(long songId) {
        libraryRepository.deleteById(songId);
    }

    /**
     * Customized code for ; and &
     **/
    public List<String> getFilteredArtistDetailsFromDb(String type) {
        List<String> artistList = null;
        if (type.equals(GP_CONSTANTS.ARTIST)) {
            artistList = libraryRepository.findAllByGroupByArtist();
        } else if (type.equals(GP_CONSTANTS.ALBUM_ARTIST)) {
            artistList = libraryRepository.findAllByGroupByAlbumArtist();
        }
        List<String> artistList2 = new ArrayList<String>();
        String[] artistArr = null;
        for (String artist1 : artistList) {
            if (artist1 != null)
                artist1 = artist1.trim();
            else
                continue;
            if ((artist1.contains(";") || artist1.contains("&") && !type.equals(GP_CONSTANTS.ALBUM_ARTIST))) {
                artist1 = artist1.replaceAll("[;&]", ",");
            }
            if (artist1.contains(",") && !type.equals(GP_CONSTANTS.ALBUM_ARTIST)) {
                artistArr = artist1.split(",");
                for (String artist2 : artistArr) {
                    if (!artistList2.contains(artist2.trim())) {
                        artistList2.add(artist2.trim());
                    }
                }
            } else {
                if (!artistList2.contains(artist1.trim())) {
                    artistList2.add(artist1.trim());
                }
            }
        }
        return artistList2;
    }

    public GPResponse updateLyrics(String songId, String lyrics) {
        GPResponse resp = new GPResponse();
        try {
            lyrics = lyrics.replaceAll("\"", "");
            lyrics = lyrics.replaceAll("(\\\\r\\\\n|\\\\n)", "\\\n");
            LOG.info("lyrics: " + lyrics);
            Library song = libraryRepository.getBySongId(Integer.parseInt(songId));
            song.setLyrics(lyrics);
            song = libraryRepository.save(song);
            resp.setLibrary(song);
            AudioFile audioFile = AudioFileIO.read(new File(song.getSongPath()));
            Tag tag = audioFile.getTag();
            tag.addField(FieldKey.LYRICS, lyrics);
            audioFile.setTag(tag);
            audioFile.commit();
            song.setLyricsAvl(true);
            libraryRepository.save(song);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resp;
    }

    public GPResponse deleteLyrics(String songId) {
        GPResponse resp = new GPResponse();
        try {
            Library song = libraryRepository.getBySongId(Integer.parseInt(songId));
            song.setLyrics(null);
            song = libraryRepository.save(song);
            AudioFile audioFile = AudioFileIO.read(new File(song.getSongPath()));
            Tag tag = audioFile.getTag();
            tag.deleteField(FieldKey.LYRICS);
            audioFile.setTag(tag);
            audioFile.commit();
            song.setLyricsAvl(false);
            libraryRepository.save(song);
            resp.setLibrary(song);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resp;
    }

    // libraryRepository - end

    // albumRepository - start
    public Iterable<Album> getAllAlbumsFromDb() {
        return albumRepository.findAllByOrderByAlbumNameAsc();
    }

    public Album getAlbumByAlbumName(String albumName) {
        return albumRepository.getByAlbumName(albumName);
    }

    public List<Album> getAlbumsByGenre(String genre) {
        return albumRepository.getByGenreContainsIgnoreCase(genre);
    }

    public Album getAlbumByAlbumId(long albumId) {
        return albumRepository.getByAlbumId(albumId);
    }

    public List<Album> getAlbumListOfAA(String albumArtist) {
        return albumRepository.getByAlbumArtist(albumArtist);
    }
    // albumRepository - end

    // artistRepository - start
    public List<Artist> getAllArtistDetails(String type) {
        return artistRepository.getByTypeOrderByArtistNameAsc(type);
    }

    private Artist getArtistById(long artistId) {
        return artistRepository.getByArtistId(artistId);
    }

    public List<Artist> getArtistsByNames(List<String> artistNames) {
        return artistRepository.getByArtistNames(artistNames);
    }

    public Artist getByArtistNameAndType(String artistName, String type) {
        return artistRepository.getByArtistNameAndType(artistName, type);
    }

    @Transactional // Method Not used currently
    public Iterable<Artist> setArtistLocalImgAvlStatusList(String artistType, List<Artist> artistList) {
        Artist artist = null;
        File artistImgFIle = null;
        if (artistList == null) {
            artistList = artistRepository.getByTypeOrderByArtistNameAsc(artistType);
        }
        for (int i = 0; i < artistList.size(); i++) {
            artist = artistList.get(i);
            artistImgFIle = new File(
                    GP_CONSTANTS.GP_ARTIST_IMAGES_PATH + artist.getArtistName() + ".jpg");
            artist.setImgAvl(artistImgFIle.exists());
            artistList.set(i, artist);
        }
        return artistRepository.saveAll(artistList);
    }

    public Map<String, Object> downloadArtitsImages(String downloadOption) {
        final String METHOD_NAME = "downloadArtitsImages";
        messageService.updateBuildStatus(GP_CONSTANTS.ARTIST_IMG_DOWNLOAD_STATUS,
                GP_CONSTANTS.ARTIST_IMG_DOWNLOAD_STATUS, GP_CONSTANTS.RUNNING);

        boolean isDirectoryExists = checkAndCreateUserImageFolders();
        if (!isDirectoryExists) {
            return null;// handle exception instead of returning null
        }

        Map<String, Object> response = new HashMap<String, Object>();

        List<Artist> downloadedArtists = new ArrayList<Artist>();
        List<Artist> failedArtists = new ArrayList<Artist>();
        Map<String, Object> downloadStatus = new HashMap<>();
        String artistImgAvailablePath = null;

        boolean isOverrideExistingImgs = false;
        LOG.info(METHOD_NAME + " - Download started");

        List<Artist> artistList = new ArrayList<Artist>();
        List<Artist> tempArtistList = null;
        List<Message> tempDownloadStatusList = new ArrayList<Message>();
        List<Message> downloadStatusList = messageService.getMessagesByType(GP_CONSTANTS.ARTIST_IMG_DOWNLOAD_STATUS);
        Message artistImgDowloadStatus = null;
        if (downloadOption.equalsIgnoreCase("DOWNLOAD_ALL_AND_OVERRIDE")) {
            artistList = (List<Artist>) artistRepository.findAll();
            isOverrideExistingImgs = true;
        } else if (downloadOption.equals("DOWNLOAD_ALL")) {
            artistList = artistRepository.getByIsImgAvlFalse();
        } else if (downloadOption.equalsIgnoreCase("DOWNLOAD_LATEST")) {
            // Todo
        } else if (downloadOption.equalsIgnoreCase("IGNORE_EXISTING_AND_TRIED_AND_FAILED")) {
            tempArtistList = artistRepository.getByIsImgAvlFalse();
            for (Artist tempArtist : tempArtistList) {
                if (downloadStatusList.size() > 0) {
                    artistImgDowloadStatus = downloadStatusList.stream()
                            .filter(o -> o.getName().equalsIgnoreCase(tempArtist.getArtistName())
                                    && o.getValue().equals(GP_CONSTANTS.DOWNLOAD_FAILED))
                            .findFirst().orElse(null);
                    if (artistImgDowloadStatus == null) {
                        artistList.add(tempArtist);
                    }
                } else {
                    artistList.add(tempArtist);
                }
            }
        }

        LOG.info(METHOD_NAME + ", Found " + artistList.size() + " artists");
        int counter = 0;
        for (Artist artist : artistList) {
            counter++;
            final String artistName = artist.getArtistName();
            LOG.info(METHOD_NAME + ", Trying to download image for :  " + artistName);
            artistImgAvailablePath = isArtistImgAvailabeInLocal(artistName);
            if (artistImgAvailablePath == null || isOverrideExistingImgs) {
                artistImgDowloadStatus = downloadStatusList.stream()
                        .filter(o -> artistName.equalsIgnoreCase(o.getName())).findFirst().orElse(null);
                if (artistImgDowloadStatus == null) {
                    artistImgDowloadStatus = new Message(GP_CONSTANTS.ARTIST_IMG_DOWNLOAD_STATUS,
                            artistName, null);
                }
                downloadStatus = downloadArtistImgToDIr(artist, artistImgDowloadStatus);
                artist = (Artist) downloadStatus.get(GP_CONSTANTS.ARTIST);
                artistImgDowloadStatus = (Message) downloadStatus.get(GP_CONSTANTS.STATUS);
                if (artistImgDowloadStatus.getValue().equalsIgnoreCase(GP_CONSTANTS.DOWNLOAD_SUCCESS)) {
                    downloadedArtists.add(artist);
                } else {
                    failedArtists.add(artist);
                }
                tempDownloadStatusList.add(artistImgDowloadStatus);
            } else {
                LOG.info(METHOD_NAME + " : Either image for artist '" + artist.getArtistName() + "'"
                        + " is already exists at :" + artistImgAvailablePath + ", Or isOverrideExistingImgs is:"
                        + isOverrideExistingImgs);
            }
            LOG.info(METHOD_NAME + ", Pending artists count : " + (artistList.size() - counter));
        }

        if (downloadedArtists.size() > 0) {
            downloadedArtists = (List<Artist>) artistRepository.saveAll(downloadedArtists);
        }

        if (tempDownloadStatusList.size() > 0) {
            messageService.deleteAll(downloadStatusList);
            tempDownloadStatusList = messageService.saveAll(tempDownloadStatusList);
        }

        messageService.updateBuildStatus(GP_CONSTANTS.ARTIST_IMG_DOWNLOAD_STATUS,
                GP_CONSTANTS.ARTIST_IMG_DOWNLOAD_STATUS, GP_CONSTANTS.COMPLETED);

        response.put("failedArtists", failedArtists);
        response.put("downloadedArtists", downloadedArtists);
        response.put("downloadStatusList", downloadStatusList);
        return response;
    }

    public Map<String, Object> downloadArtistImgToDIr(Artist artist, Message artistDownloadStatus) {
        String METHOD_NAME = "downloadArtistImgToDIr";
        LOG.info(METHOD_NAME + " - Download started for artist: " + artist.getArtistName());

        String wikiResp = "";
        JSONObject wikiRespJson = null;
        boolean isRestExchangeFailed = false;

        Map<String, Object> response = new HashMap<String, Object>();
        String localArtistPath = GP_CONSTANTS.GP_ARTIST_IMAGES_PATH;
        File localArtistImg = new File(localArtistPath + "\\" + artist.getArtistName() + ".jpg");
        wikiResp = GPUtil.restExchange(GP_CONSTANTS.WIKI_SUMMARY_URI + artist.getArtistName());
        try {
            if (wikiResp.equalsIgnoreCase(GP_CONSTANTS.NOT_FOUND)) {
                isRestExchangeFailed = true;
            } else {
                isRestExchangeFailed = false;
                wikiRespJson = new JSONObject(wikiResp);
            }

            if (isRestExchangeFailed || wikiRespJson.getString("title").contains("Not found")
                    || wikiRespJson.getString("extract").contains("may refer to")) {
                wikiResp = GPUtil
                        .restExchange(GP_CONSTANTS.WIKI_SUMMARY_URI + artist.getArtistName() + "_(singer)");
                if (wikiResp.equalsIgnoreCase(GP_CONSTANTS.NOT_FOUND)) {
                    isRestExchangeFailed = true;
                } else {
                    isRestExchangeFailed = false;
                    wikiRespJson = new JSONObject(wikiResp);
                }
                if (isRestExchangeFailed || wikiRespJson.getString("title").contains("Not found")) {
                    wikiResp = GPUtil
                            .restExchange(GP_CONSTANTS.WIKI_SUMMARY_URI + artist.getArtistName() + "_(actor)");
                    if (wikiResp.equalsIgnoreCase(GP_CONSTANTS.NOT_FOUND)) {
                        isRestExchangeFailed = true;
                    } else {
                        isRestExchangeFailed = false;
                        wikiRespJson = new JSONObject(wikiResp);
                    }
                }
            }
            try {
                if (!isRestExchangeFailed && wikiRespJson.getJSONObject("thumbnail") != null &&
                        (wikiRespJson.getString("extract").contains("singer")
                                || wikiRespJson.getString("extract").contains("actor")
                                || wikiRespJson.getString("extract").contains("actress")
                                || wikiRespJson.getString("extract").contains("composer")
                                || wikiRespJson.getString("extract").contains("musician")
                                || wikiRespJson.getString("extract").contains("director")
                                || wikiRespJson.getString("extract").contains("rapper")
                                || wikiRespJson.getString("extract").contains("music producer"))) {

                    FileUtils.copyURLToFile(
                            new URL(wikiRespJson.getJSONObject("thumbnail").getString("source")),
                            localArtistImg);
                    artist.setImgAvl(true);
                    artist.setImageSource(GP_CONSTANTS.GP_PATH);
                    artistDownloadStatus.setValue(GP_CONSTANTS.DOWNLOAD_SUCCESS);
                    response.put(GP_CONSTANTS.ARTIST, artist);
                    response.put(GP_CONSTANTS.STATUS, artistDownloadStatus);
                } else {
                    artistDownloadStatus.setValue(GP_CONSTANTS.DOWNLOAD_FAILED);
                    response.put(GP_CONSTANTS.ARTIST, artist);
                    response.put(GP_CONSTANTS.STATUS, artistDownloadStatus);
                    LOG.info(METHOD_NAME + ", Failed to download image of artist:  " + artist.getArtistName()
                            + ", Error: Not able to find artist image in wikipedia");
                }
            } catch (JSONException e) {
                artistDownloadStatus.setValue(GP_CONSTANTS.DOWNLOAD_FAILED);
                response.put(GP_CONSTANTS.ARTIST, artist);
                response.put(GP_CONSTANTS.STATUS, artistDownloadStatus);
                LOG.error("For artist: " + artist.getArtistName()
                        + ", Failed while fetching thimbnainf from wiki response "
                        + e.getMessage());
            }
        } catch (Exception e) {
            artistDownloadStatus.setValue(GP_CONSTANTS.DOWNLOAD_FAILED);
            response.put(GP_CONSTANTS.ARTIST, artist);
            response.put(GP_CONSTANTS.STATUS, artistDownloadStatus);
            LOG.info(METHOD_NAME + ", Failed to download image of artist:  " + artist.getArtistName() + ", Error: "
                    + e.getMessage());
            // e.printStackTrace();
        }
        return response;
    }
    // artistRepository - end

    // Multiple repositories - start
    public Map<String, List<Object>> searchbyKey(String searchKey) {
        Map<String, List<Object>> resultMap = new HashMap<String, List<Object>>();
        List<Object> tracks = libraryRepository.getByTitleContainsIgnoreCase(searchKey);
        List<Object> artists = artistRepository.getByArtistNameContainsIgnoreCaseAndType(searchKey,
                GP_CONSTANTS.ARTIST);
        List<Object> albumArtists = artistRepository.getByArtistNameContainsIgnoreCaseAndType(searchKey,
                GP_CONSTANTS.ALBUM_ARTIST);
        List<Object> albums = albumRepository.getByAlbumNameContainsIgnoreCase(searchKey);
        resultMap.put(GP_CONSTANTS.TRACK_LIST, tracks);
        resultMap.put(GP_CONSTANTS.ARTISTS, artists);
        resultMap.put(GP_CONSTANTS.ALBUM_ARTISTS, albumArtists);
        resultMap.put(GP_CONSTANTS.ALBUMS, albums);
        return resultMap;
    }

    @Transactional
    public void truncateMyTable() {
        try {
            libraryRepository.truncateMyTable();
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            albumRepository.truncateMyTable();
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            artistRepository.truncateMyTable();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    // Multiple repositories - end

    // Utility methods - Start
    public boolean isContainsCurrentAlbum(final List<Album> list, final String name, final String field) {
        final String METHOD_NAME = "isContainsCurrentAlbum";
        try {
            if (field == null) {
                return list.stream().filter(o -> o.getAlbumName().equals(name)).findFirst().isPresent();
            } else {
                return list.stream()
                        .filter(o -> o.getAlbumName().equals(name) && o.getLanguage().equalsIgnoreCase(field))
                        .findFirst().isPresent();
            }
        } catch (Exception e) {
            LOG.error("Failed in:" + METHOD_NAME + " method, name: " + name + ", field: " + field);
            e.getMessage();
        }
        return false;
    }

    public boolean isContainsCurrentArtist(final List<Artist> list, final String name, final String type) {
        final String METHOD_NAME = "isContainsCurrentAlrtist";
        try {
            return list.stream()
                    .filter(o -> o.getArtistName().equals(name) && o.getType().equalsIgnoreCase(type))
                    .findFirst().isPresent();
        } catch (Exception e) {
            LOG.error("Failed in:" + METHOD_NAME + " method, name: " + name + ", field: " + type);
            e.getMessage();
        }
        return false;
    }

    public Artist getCurrentArtist(final List<Artist> list, final String name, final String type) {
        final String METHOD_NAME = "getCurrentArtist";
        try {
            return list.stream()
                    .filter(o -> o.getArtistName().equals(name) && o.getType().equalsIgnoreCase(type))
                    .findFirst().orElse(null);
        } catch (Exception e) {
            LOG.error("Failed in:" + METHOD_NAME + " method, name: " + name + ", field: " + type);
            e.getMessage();
        }
        return null;
    }

    public Album getCurrentAlbum(final List<Album> list, final String name, final int year) {
        final String METHOD_NAME = "getCurrentAlbum";
        try {
            return list.stream().filter(o -> o.getAlbumName().equals(name) && o.getYear() == year)
                    .findFirst().orElse(null);
        } catch (Exception e) {
            LOG.error("Failed in:" + METHOD_NAME + " method, name: " + name + ", field: " + year);
            e.getMessage();
        }
        return null;
    }

    public Library getLibraryFromLibList(final List<Library> libList, History history) {
        return libList.stream().filter(o -> (o.getTitle().equalsIgnoreCase(history.getTitle())
                && o.getAlbum().equalsIgnoreCase(history.getAlbum()))).findFirst().orElse(null);
    }

    public Library getLibraryFromLibList(final List<Library> libList, PlaylistItem playlistItem) {
        return libList.stream().filter(o -> (o.getSongPath().equalsIgnoreCase(playlistItem.getSongPath())
                && o.getAlbum().equalsIgnoreCase(playlistItem.getAlbumName()))).findFirst().orElse(null);
    }

    public Library getAAttrFromTag(Library song, boolean getAlbumImg, boolean getLyrics) {
        AudioFile audioFile;
        try {
            removeJAudioTagLogger();
            audioFile = AudioFileIO.read(new File(song.getSongPath()));
            Tag tag = audioFile.getTag();
            if (getAlbumImg) {
                song.setAlbumArt(getAlbumImgFromTag(tag));
            }
            if (getLyrics && !tag.getFirst(FieldKey.LYRICS).equals("") && tag.getFirst(FieldKey.LYRICS) != null) {
                song.setLyrics(tag.getFirst(FieldKey.LYRICS));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return song;
    }

    public String getAlbumImgFromTag(Tag tag) {
        byte[] awtb = null;
        try {
            List<Artwork> artworks = tag.getArtworkList();
            for (Artwork awt : artworks) {
                awtb = awt.getBinaryData();
                if (awtb != null)
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return getImagePath(awtb);
    }

    public Blob getAlbumImgBlobFromTag(Tag tag) {
        byte[] awtb = null;
        Blob blob = null;
        try {
            List<Artwork> artworks = tag.getArtworkList();
            for (Artwork awt : artworks) {
                awtb = awt.getBinaryData();
                if (awtb != null)
                    break;
            }
            blob = new SerialBlob(awtb);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return blob;
    }

    public byte[] getAlbumImgBinFromTag(Tag tag) {
        byte[] awtb = null;
        try {
            List<Artwork> artworks = tag.getArtworkList();
            for (Artwork awt : artworks) {
                awtb = awt.getBinaryData();
                if (awtb != null)
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return awtb;
    }

    private Album writeByteArrayToImgFile(Album album, byte[] binImg) {
        try {
            File albumImgFile = new File(GP_CONSTANTS.GP_ALBUM_IMAGES_PATH + album.getAlbumName() + ".jpg");
            if (!albumImgFile.exists()) {
                ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(binImg);
                BufferedImage newImage = ImageIO.read(byteArrayInputStream);
                Image image = newImage.getScaledInstance(250, 250, Image.SCALE_DEFAULT);

                newImage = new BufferedImage(250, 250, BufferedImage.TYPE_INT_RGB);
                newImage.getGraphics().drawImage(image, 0, 0, null);

                ImageIO.write(newImage, "jpg", albumImgFile);
                album.setAlbumImgAvl(true);
            } else {
                album.setAlbumImgAvl(true);
            }

        } catch (IOException e) {
            album.setAlbumImgAvl(false);
            e.printStackTrace();
        }
        return album;
    }

    public boolean checkAndCreateUserImageFolders() {
        boolean isDirExits = false;
        try {
            isDirExits = GPUtil.checkAndCreateFolders(GP_CONSTANTS.GP_ALBUM_IMAGES_PATH);
            if (!isDirExits) {
                return false;// handle exception, send exception back to user
            }
            isDirExits = GPUtil.checkAndCreateFolders(GP_CONSTANTS.GP_ARTIST_IMAGES_PATH);
            if (!isDirExits) {
                return false;// handle exception, send exception back to user
            }

            isDirExits = GPUtil.checkAndCreateFolders(GP_CONSTANTS.GP_UASER_ARTIST_IMAGES_PATH);
            if (!isDirExits) {
                return false;// handle exception, send exception back to user
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isDirExits;
    }

    public boolean deleteDirectoryContents(String path) {
        try {
            FileUtils.cleanDirectory(new File(path));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    private boolean deleteDirectory(String path) {
        try {
            FileUtils.delete(new File(path));
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<String> filterArtistList(List<String> artistList, String splitter) {
        List<String> artistList1 = new ArrayList<String>();
        String artist = null;
        String[] artistArr = null;
        for (int i = 0; i < artistList.size(); i++) {
            artist = artistList.get(i);
            if (artist != null) {
                artist = artist.trim();
            } else {
                continue;
            }
            if (artist.contains(splitter)) {
                artistArr = artist.split(splitter);
                for (String artist1 : artistArr) {
                    artist1 = artist1.trim();
                    if (!artistList1.contains(artist1)) {
                        artistList1.add(artist1);
                    }
                }
            } else {
                artistList1.add(artist);
            }
        }
        return artistList1;
    }

    public String isArtistImgAvailabeInLocal(String artistName) {
        String artistImgPathSrc = null;
        boolean isArtistImgAvailable = false;
        isArtistImgAvailable = isLocalImgAvailable(artistName, GP_CONSTANTS.GP_UASER_ARTIST_IMAGES_PATH);
        if (!isArtistImgAvailable) {
            isArtistImgAvailable = isLocalImgAvailable(artistName, GP_CONSTANTS.GP_ARTIST_IMAGES_PATH);
            artistImgPathSrc = isArtistImgAvailable ? GP_CONSTANTS.GP_PATH : null;
        } else {
            artistImgPathSrc = GP_CONSTANTS.USER_PATH;
        }
        return artistImgPathSrc;
    }

    public boolean isLocalImgAvailable(String fileName, String path) {
        File artistImgFIle = new File(path + fileName + ".jpg");
        return artistImgFIle.exists();
    }

    public void resizeArtistImgs() {
        try {
            File artistDir = new File(GP_CONSTANTS.GP_ARTIST_IMAGES_PATH);
            File[] artistImgs = artistDir.listFiles();
            for (File artistImg : artistImgs) {
                ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
                        FileUtils.readFileToByteArray(artistImg));
                BufferedImage newImage = ImageIO.read(byteArrayInputStream);
                Image image = newImage.getScaledInstance(250, 250, Image.SCALE_DEFAULT);
                newImage = new BufferedImage(250, 250, BufferedImage.TYPE_INT_RGB);
                newImage.getGraphics().drawImage(image, 0, 0, null);
                ImageIO.write(newImage, "jpg", artistImg);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public GPResponse uploadArtistImg(String imageB64, long artistId) {
        GPResponse resp = new GPResponse();
        boolean isImageWrote = false;
        try {
            String[] parts = imageB64.split(",");
            String imageStringB64 = parts[1];
            boolean isDirExists = GPUtil.checkAndCreateFolders(GP_CONSTANTS.GP_UASER_ARTIST_IMAGES_PATH);
            if (!isDirExists) {
                resp.setStatus(GP_CONSTANTS.FAILED);
                resp.setError(GP_CONSTANTS.UNKNOWN_ERROR_TEXT);
                return resp;
            }
            Artist artist = getArtistById(artistId);
            File imageFile = new File(GP_CONSTANTS.GP_UASER_ARTIST_IMAGES_PATH + artist.getArtistName() + ".jpg");
            byte[] imageByteArr = Base64.decodeBase64(imageStringB64);
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(imageByteArr);
            BufferedImage newImage = ImageIO.read(byteArrayInputStream);
            Image image = newImage.getScaledInstance(250, 250, Image.SCALE_DEFAULT);
            newImage = new BufferedImage(250, 250, BufferedImage.TYPE_INT_RGB);
            newImage.getGraphics().drawImage(image, 0, 0, null);
            isImageWrote = ImageIO.write(newImage, "jpg", imageFile);
            if (isImageWrote) {
                artist.setImgAvl(true);
                artist.setImageSource(GP_CONSTANTS.USER_PATH);
                artist = artistRepository.save(artist);
                resp.setResponse(artist);
                String artistType = null;
                if (artist.getType().equals(GP_CONSTANTS.ARTIST)) {
                    artistType = GP_CONSTANTS.ALBUM_ARTIST;
                } else {
                    artistType = GP_CONSTANTS.ARTIST;
                }
                artist = artistRepository.getByArtistNameAndType(artist.getArtistName(), artistType);
                if (artist != null) {
                    artist.setImgAvl(true);
                    artist.setImageSource(GP_CONSTANTS.USER_PATH);
                    artistRepository.save(artist);
                }
                resp.setStatus(GP_CONSTANTS.SUCCESS);
            } else {
                resp.setStatus(GP_CONSTANTS.FAILED);
                resp.setError(GP_CONSTANTS.UNKNOWN_ERROR_TEXT);
            }
        } catch (IOException e) {
            e.printStackTrace();
            resp.setError(e.getMessage());
            resp.setStatus(GP_CONSTANTS.FAILED);
        } catch (Exception e) {
            e.printStackTrace();
            resp.setError(e.getMessage());
            resp.setStatus(GP_CONSTANTS.FAILED);
        }
        return resp;
    }

    public void removeJAudioTagLogger() {
        String[] loggerNames = new String[] { "org.jaudiotagger.audio", "org.jaudiotagger.tag.mp4",
                "org.jaudiotagger.tag.id3", "org.jaudiotagger.tag.datatype" };
        try {
            for (String loggerName : loggerNames) {
                java.util.logging.Logger[] pin = new java.util.logging.Logger[] {
                        java.util.logging.Logger.getLogger(loggerName) };
                for (java.util.logging.Logger l : pin) {
                    l.setLevel(java.util.logging.Level.OFF);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getImagePath(byte[] DP) {
        String imgPath = "";
        if (null != DP) {
            imgPath = "data:image/png;base64, " + java.util.Base64.getEncoder().encodeToString(DP);
        }
        return imgPath;
    }
    // Utility methods - End

    // Deprecated methods - start
    public Map<String, List<Library>> getAllAlbums() {
        Map<String, List<Library>> albums = new HashMap<String, List<Library>>();
        List<Library> album = null;
        Map<String, Blob> rAlbumImgs = new HashMap<String, Blob>();
        Iterable<Album> rAlbums = albumRepository.findAll();
        try {
            for (Album album2 : rAlbums) {
                if (album2.getAlbumName() != null)
                    rAlbumImgs.put(album2.getAlbumName(), album2.getAlbumImgPath());
            }
            Iterable<Library> trackList = libraryRepository.findAll();
            Iterator<Library> tlIt = trackList.iterator();
            Library track = null;
            while (tlIt.hasNext()) {
                track = tlIt.next();
                if (track.getAlbum() == null)
                    continue;
                if (albums.containsKey(track.getAlbum())) {
                    album = albums.get(track.getAlbum());
                    album.add(track);
                    albums.put(track.getAlbum(), album);
                } else {
                    album = new ArrayList<Library>();
                    // track.setAlbumArt(rAlbumImgs.get(track.getAlbum()));
                    album.add(track);
                    albums.put(track.getAlbum(), album);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return albums;
    }

    @Deprecated
    public Map<String, String> getAlbumImgs() {
        Map<String, String> rAlbumImgs = new HashMap<String, String>();
        byte[] btes = null;
        try {
            Iterable<Album> rAlbums = albumRepository.findAll();
            for (Album album2 : rAlbums) {
                if (album2.getAlbumImgPath() != null && album2.getAlbumName() != null) {
                    btes = album2.getAlbumImgPath().getBinaryStream().readAllBytes();
                    rAlbumImgs.put(album2.getAlbumName(), getImagePath(btes));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return rAlbumImgs;
    }

    @Deprecated
    public Map<String, Library> getAllAlbumdetails(String filterColumn, String filterValue) {
        Map<String, Library> albums = new HashMap<String, Library>();
        Iterable<Library> trackList = null;
        try {
            if (filterColumn == null) {
                trackList = libraryRepository.findAllByOrderByAlbumAsc();
            } else if (filterColumn.equalsIgnoreCase(GP_CONSTANTS.ALBUM_ARTIST)) {
                trackList = libraryRepository.getByAlbumArtistOrderByYearAsc(filterValue);
            }

            Iterator<Library> tlIt = trackList.iterator();
            Library track = null;
            while (tlIt.hasNext()) {
                track = tlIt.next();
                if (track.getAlbum() == null)
                    continue;
                if (!albums.containsKey(track.getAlbum())) {
                    albums.put(track.getAlbum(), track);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return albums;
    }
    // Deprecated methods - end

    public Map<String, Object> getGenreDetails() {
        Map<String, Object> genreDetails = new HashMap<String, Object>();
        List<String> genres = new ArrayList<String>();
        Map<String, Integer> genreSongCount = new HashMap<String, Integer>();
        Map<String, List<String>> genreAlbums = new HashMap<String, List<String>>();
        List<String> albums = null;
        List<String> albumListByGenre = null;
        try {
            List<Map<String, Object>> mostPlayedAlbums = historyService.getAlbumsGroupedFromHistoryJDBC(0, "count");
            genreSongCount = getColumnValueGroupedByColumns(GP_CONSTANTS.GENRE);
            for (String genre : genreSongCount.keySet()) {
                genres.add(genre);
                albumListByGenre = libraryRepository.getAlbumListByGenre(genre);
                albums = GPUtil.sortAlbumsByMostPlayed(albumListByGenre, mostPlayedAlbums,
                        GP_CONSTANTS.GROUPED_ALBUM_COUNT_4);
                genreAlbums.put(genre, albums);
            }
            genreDetails.put(GP_CONSTANTS.GENRES, genres);
            genreDetails.put(GP_CONSTANTS.GENRE_SONG_COUNT, genreSongCount);
            genreDetails.put(GP_CONSTANTS.GENRE_ALBUMS, genreAlbums);
        } catch (Exception e) {
            e.printStackTrace();
            genreDetails.put(GP_CONSTANTS.ERROR, Arrays.asList(e.getMessage()));
        }

        return genreDetails;
    }

    public List<Library> getSongsByAlbumAndTitle(List<Library> reqPlaylistLibraryList) {
        List<Library> songs = new ArrayList<Library>();
        List<Library> tempSongs = null;
        for (Library reqLibrary : reqPlaylistLibraryList) {
            tempSongs = libraryRepository.getByTitleAndAlbum(reqLibrary.getTitle(), reqLibrary.getAlbum());
            songs.addAll(tempSongs);
        }
        return songs;
    }

    public GPResponse updateMp3Files(String path, String field, String value) {
        GPResponse resp = new GPResponse();
        List<File> fileList = new ArrayList<File>();
        fileList = getMusicFiles(new ArrayList<>(Arrays.asList(path)));
        Map<String, String> updateMp3FileResponse = new HashMap<String, String>();
        Map<String, Map<String, String>> updateMp3FilesResponse = new HashMap<String, Map<String, String>>();
        removeJAudioTagLogger();
        Map<String, String> inputMap = new HashMap<String, String>();
        inputMap.put(field, value);
        for (File musicFile : fileList) {
            updateMp3FileResponse = updateMp3File(musicFile, inputMap, false);
            updateMp3FilesResponse.put(musicFile.getAbsolutePath(), updateMp3FileResponse);
        }
        resp = writeUpdateMp3ResonseToCSV(updateMp3FilesResponse, updateMp3FileResponse);
        return resp;
    }

    public GPResponse writeUpdateMp3ResonseToCSV(Map<String, Map<String, String>> updateMp3FilesResponse,
            Map<String, String> updateMp3FileResponse) {
        GPResponse resp = new GPResponse();
        try {
            GPUtil.checkAndCreateFolders(GP_CONSTANTS.GP_LOGS_PATH);
            File updateMp3FilesResponseFile = new File(GP_CONSTANTS.GP_LOGS_PATH + "UPDATE_MUSIC_FILE_RESPINSE" + "_"
                    + new Date().getTime() + GP_CONSTANTS.FILETYPE_CSV);
            FileWriter fileWriter = new FileWriter(updateMp3FilesResponseFile);
            fileWriter.append(GP_CONSTANTS.FILENAME).append(",")
                    .append(GP_CONSTANTS.FILEPATH).append(",")
                    .append(GP_CONSTANTS.MUSIC_FILE_METADATA_FIELD).append(",")
                    // .append(GP_CONSTANTS.MUSIC_FILE_METADATA_VALUE).append(",")
                    .append(GP_CONSTANTS.STATUS).append(",")
                    .append(GP_CONSTANTS.ERROR).append(",")
                    .append(GP_CONSTANTS.EXCEPTION).append(System.lineSeparator());
            if (updateMp3FilesResponse != null) {
                for (String key : updateMp3FilesResponse.keySet()) {
                    updateMp3FileResponse = updateMp3FilesResponse.get(key);
                    fileWriter.append(updateMp3FileResponse.get(GP_CONSTANTS.FILENAME))
                            .append(",")
                            .append(updateMp3FileResponse.get(GP_CONSTANTS.FILEPATH))
                            .append(",")
                            .append(updateMp3FileResponse.get(GP_CONSTANTS.MUSIC_FILE_METADATA_FIELD))
                            .append(",")
                            // .append(updateMp3FileResponse.get(GP_CONSTANTS.MUSIC_FILE_METADATA_VALUE))
                            .append(",")
                            .append(updateMp3FileResponse.get(GP_CONSTANTS.STATUS))
                            .append(",")
                            .append(updateMp3FileResponse.get(GP_CONSTANTS.ERROR))
                            .append(",")
                            .append(updateMp3FileResponse.get(GP_CONSTANTS.EXCEPTION))
                            .append(System.lineSeparator());
                }
            } else {
                fileWriter.append(updateMp3FileResponse.get(GP_CONSTANTS.FILENAME))
                        .append(",")
                        .append(updateMp3FileResponse.get(GP_CONSTANTS.FILEPATH))
                        .append(",")
                        .append(updateMp3FileResponse.get(GP_CONSTANTS.MUSIC_FILE_METADATA_FIELD))
                        .append(",")
                        // .append(updateMp3FileResponse.get(GP_CONSTANTS.MUSIC_FILE_METADATA_VALUE))
                        .append(",")
                        .append(updateMp3FileResponse.get(GP_CONSTANTS.STATUS))
                        .append(",")
                        .append(updateMp3FileResponse.get(GP_CONSTANTS.ERROR))
                        .append(",")
                        .append(updateMp3FileResponse.get(GP_CONSTANTS.EXCEPTION))
                        .append(System.lineSeparator());
            }
            fileWriter.flush();
            fileWriter.close();
            resp.setStatus(GP_CONSTANTS.SUCCESS);
        } catch (IOException e) {
            resp.setStatus(GP_CONSTANTS.FAILED);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    public Map<String, String> updateMp3File(File musicFile, Map<String, String> fieldValMap,
            boolean removeUnwantedFields) {
        final String METHOD_NAME = "updateMp3File";
        AudioFile audioFile = null;
        Tag tag = null;
        Map<String, String> updateMp3FileResponseMap = new HashMap<String, String>();
        String existingField = null;
        FieldKey fieldKey = null;
        try {
            removeJAudioTagLogger();
            audioFile = AudioFileIO.read(new File(musicFile.getAbsolutePath()));
            tag = audioFile.getTag();
            if (removeUnwantedFields) {
                tag = removeUnwantedTags(tag);
            }
            for (String field : fieldValMap.keySet()) {
                if (StringUtils.equals(field, "albumArt")) {
                    String[] parts = fieldValMap.get(field).split(",");
                    String imageStringB64 = parts[1];
                    byte[] imageByteArr = Base64.decodeBase64(imageStringB64);
                    String albumName = tag.getFirst(FieldKey.ALBUM);
                    File imageFile = new File(GP_CONSTANTS.GP_ALBUM_IMAGES_PATH + albumName + ".jpg");
                    ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(imageByteArr);
                    BufferedImage newImage = ImageIO.read(byteArrayInputStream);
                    Image image = newImage.getScaledInstance(250, 250, Image.SCALE_DEFAULT);
                    newImage = new BufferedImage(250, 250, BufferedImage.TYPE_INT_RGB);
                    newImage.getGraphics().drawImage(image, 0, 0, null);
                    boolean isImageWrote = ImageIO.write(newImage, "jpg", imageFile);
                    if (isImageWrote) {
                        Artwork artwork = tag.getFirstArtwork();
                        try {
                            artwork = Artwork.createArtworkFromFile(imageFile);
                        } catch (IOException e) {
                            e.printStackTrace();
                            // error = e.getMessage();
                        }
                        if (artwork != null) {
                            // artwork.setBinaryData(imageByteArr);
                            tag.deleteArtworkField();
                            tag.setField(artwork);
                        } // else {
                          // artwork.setBinaryData(imageByteArr);
                          // tag.addField(artwork);
                          // tag.setField(artwork);
                          // }
                    }
                } else if (StringUtils.equals(field, "isWriteAlbumImg")
                        && StringUtils.equals(fieldValMap.get(field), "true")) {
                    byte[] albumImg = getAlbumImgBinFromTag(tag);
                    if (albumImg != null) {
                        Album tempAlbum = new Album(fieldValMap.get("album"));
                        tempAlbum = writeByteArrayToImgFile(tempAlbum, albumImg);
                    }
                } else {
                    fieldKey = GPUtil.getFieldKeyForString(field);
                    existingField = tag.getFirst(fieldKey);
                    if (existingField != null && !existingField.equals("")) {
                        tag.setField(fieldKey, fieldValMap.get(field));
                    } else {
                        tag.addField(fieldKey, fieldValMap.get(field));
                    }
                }
            }
            audioFile.setTag(tag);
            audioFile.commit();
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, null);
        } catch (KeyNotFoundException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (FieldDataInvalidException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (CannotWriteException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (CannotReadException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (IOException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (TagException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (ReadOnlyFileException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (InvalidAudioFrameException e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        } catch (Exception e) {
            updateMp3FileResponseMap = getUpdateMp3FileResponseMap(METHOD_NAME, musicFile, fieldValMap, e);
        }
        return updateMp3FileResponseMap;
    }

    private Tag removeUnwantedTags(Tag tag) {
        List<FieldKey> allFieldKeys = Arrays.asList(FieldKey.values());
        for (FieldKey fieldKey : allFieldKeys) {
            if (!GPUtil.isFieldKeyRequired(fieldKey)) {
                // if (tag.getFirst(fieldKey) != null) {
                tag.deleteField(fieldKey);
                // }
            }
        }
        return tag;
    }

    private Map<String, String> getUpdateMp3FileResponseMap(final String METHOD_NAME, File musicFile,
            Map<String, String> fieldValMap, Exception e) {
        Map<String, String> updateMp3FileResponseMap = new HashMap<String, String>();
        updateMp3FileResponseMap.put(GP_CONSTANTS.METHOD_NAME, METHOD_NAME);
        updateMp3FileResponseMap.put(GP_CONSTANTS.FILENAME, musicFile.getName());
        updateMp3FileResponseMap.put(GP_CONSTANTS.FILEPATH, musicFile.getAbsolutePath());
        updateMp3FileResponseMap.put(GP_CONSTANTS.MUSIC_FILE_METADATA_FIELD, fieldValMap.toString());
        if (e != null) {
            updateMp3FileResponseMap.put(GP_CONSTANTS.STATUS, GP_CONSTANTS.ERROR);
            updateMp3FileResponseMap.put(GP_CONSTANTS.EXCEPTION, e.getClass().getName());
            updateMp3FileResponseMap.put(GP_CONSTANTS.ERROR, e.getMessage());
        } else {
            updateMp3FileResponseMap.put(GP_CONSTANTS.STATUS, GP_CONSTANTS.SUCCESS);
        }
        return updateMp3FileResponseMap;
    }

    public Map<String, Object> getLanguageDetails() {
        final String METHOD_NANE = "getLanguageDetails";
        Map<String, Object> languageDetails = new HashMap<String, Object>();
        List<String> languages = new ArrayList<String>();
        Map<String, Integer> languageSongCount = null;
        Map<String, List<String>> languageAlbums = new HashMap<String, List<String>>();
        List<String> albums = null;
        List<String> albumListByLanguage = null;
        try {
            List<Map<String, Object>> mostPlayedAlbums = historyService.getAlbumsGroupedFromHistoryJDBC(0, "count");
            languageSongCount = getColumnValueGroupedByColumns(GP_CONSTANTS.LANGUAGE);
            LOG.info(METHOD_NANE + " : getColumnValueGroupedByColumns, " + GP_CONSTANTS.LANGUAGE + " : "
                    + languageSongCount);
            for (String language : languageSongCount.keySet()) {
                languages.add(language);
                albumListByLanguage = libraryRepository.getAlbumListByLanguage(language);
                albums = GPUtil.sortAlbumsByMostPlayed(albumListByLanguage, mostPlayedAlbums,
                        GP_CONSTANTS.GROUPED_ALBUM_COUNT_4);
                languageAlbums.put(language, albums);
            }
            languageDetails.put(GP_CONSTANTS.LANGUAGES, languages);
            languageDetails.put(GP_CONSTANTS.LANGUAGE_SONG_COUNT, languageSongCount);
            languageDetails.put(GP_CONSTANTS.LANGUAGE_ALBUMS, languageAlbums);
        } catch (Exception e) {
            e.printStackTrace();
            languageDetails.put(GP_CONSTANTS.ERROR, Arrays.asList(e.getMessage()));
        }

        return languageDetails;
    }

    public Map<String, Integer> getColumnValueGroupedByColumns(String column) {
        Map<String, Integer> columnValueWithCount = new HashMap<String, Integer>();
        List<String> tempRows = null;
        if (column.equalsIgnoreCase(GP_CONSTANTS.LANGUAGE)) {
            tempRows = libraryRepository.getLanguagesGroupByLanguage();
        } else if (column.equalsIgnoreCase(GP_CONSTANTS.GENRE)) {
            tempRows = libraryRepository.getGenresGroupByGenre();
        }

        String[] tempColumnValueArr = null;
        String[] tempRowWithCountCountArr = null;
        String tempColumnValue = "";
        Integer itemCount = 0;
        for (String tempRowWithCount : tempRows) {
            tempRowWithCountCountArr = tempRowWithCount.split(",", 2);
            itemCount = Integer.parseInt(tempRowWithCountCountArr[0]);
            tempColumnValue = tempRowWithCountCountArr[1];
            if (tempColumnValue.contains(",")) {
                tempColumnValueArr = tempColumnValue.split(",");
                for (String tempColumnValue1 : tempColumnValueArr) {
                    tempColumnValue1 = tempColumnValue1.trim();
                    if (!columnValueWithCount.containsKey(tempColumnValue1)) {
                        columnValueWithCount.put(tempColumnValue1, itemCount);
                    } else {
                        columnValueWithCount.put(tempColumnValue1,
                                columnValueWithCount.get(tempColumnValue1) + itemCount);
                    }
                }
            } else {
                if (!columnValueWithCount.containsKey(tempColumnValue)) {
                    columnValueWithCount.put(tempColumnValue, itemCount);
                } else {
                    columnValueWithCount.put(tempColumnValue, columnValueWithCount.get(tempColumnValue) + itemCount);
                }
            }
        }

        // Create a list from elements of HashMap
        List<Map.Entry<String, Integer>> list = new LinkedList<Map.Entry<String, Integer>>(
                columnValueWithCount.entrySet());

        // Sort the list
        Collections.sort(list, new Comparator<Map.Entry<String, Integer>>() {
            public int compare(Map.Entry<String, Integer> o1,
                    Map.Entry<String, Integer> o2) {
                return (o2.getValue()).compareTo(o1.getValue());
            }
        });
        // put data from sorted list to hashmap
        HashMap<String, Integer> temp = new LinkedHashMap<String, Integer>();
        for (Map.Entry<String, Integer> aa : list) {
            temp.put(aa.getKey(), aa.getValue());
        }
        return temp;
    }

    public GPResponse updateTrackInfo(Library reqLibrary, String type) {
        GPResponse resp = new GPResponse();
        Map<String, String> fieldValMap = new HashMap<String, String>();
        Map<String, String> updateMp3FileResponseMap = null;
        Library respLibrary = getSongBySongId(reqLibrary.getSongId());
        try {
            if (type.equals(GP_CONSTANTS.TRACK)) {
                File musicFile = new File(respLibrary.getSongPath());
                if (reqLibrary.getTitle() != null && !reqLibrary.getTitle().equalsIgnoreCase("")) {
                    fieldValMap.put("title", reqLibrary.getTitle());
                    respLibrary.setTitle(reqLibrary.getTitle());
                }
                if (reqLibrary.getAlbum() != null && !reqLibrary.getAlbum().equalsIgnoreCase("")) {
                    fieldValMap.put("album", reqLibrary.getAlbum());
                    respLibrary.setAlbum(reqLibrary.getAlbum());
                }
                if (reqLibrary.getArtist() != null && !reqLibrary.getArtist().equalsIgnoreCase("")) {
                    fieldValMap.put("artist", reqLibrary.getArtist());
                    respLibrary.setArtist(reqLibrary.getArtist());
                }
                if (reqLibrary.getAlbumArtist() != null && !reqLibrary.getAlbumArtist().equalsIgnoreCase("")) {
                    fieldValMap.put("albumArtist", reqLibrary.getAlbumArtist());
                    respLibrary.setAlbumArtist(reqLibrary.getAlbumArtist());
                }

                if (reqLibrary.getTrackNumber() != 0) {
                    fieldValMap.put("trackNumber", String.valueOf(reqLibrary.getTrackNumber()));
                    respLibrary.setTrackNumber(reqLibrary.getTrackNumber());
                }
                if (reqLibrary.getYear() != 0) {
                    fieldValMap.put("year", String.valueOf(reqLibrary.getYear()));
                    respLibrary.setYear(reqLibrary.getYear());
                }
                if (reqLibrary.getLanguage() != null && !reqLibrary.getLanguage().equalsIgnoreCase("")) {
                    fieldValMap.put("language", reqLibrary.getLanguage());
                    respLibrary.setLanguage(reqLibrary.getLanguage());
                }
                if (reqLibrary.getGenre() != null && !reqLibrary.getGenre().equalsIgnoreCase("")) {
                    fieldValMap.put("genre", reqLibrary.getGenre());
                    respLibrary.setGenre(reqLibrary.getGenre());
                }
                if (reqLibrary.getLyricist() != null && !reqLibrary.getLyricist().equalsIgnoreCase("")) {
                    fieldValMap.put("lyricist", reqLibrary.getLyricist());
                    respLibrary.setLyricist(reqLibrary.getLyricist());
                }
                if (reqLibrary.getLabel() != null && !reqLibrary.getLabel().equalsIgnoreCase("")) {
                    fieldValMap.put("label", reqLibrary.getLabel());
                    respLibrary.setLabel(reqLibrary.getLabel());
                }
                updateMp3FileResponseMap = updateMp3File(musicFile, fieldValMap, false);
                if (GP_CONSTANTS.SUCCESS.equals(updateMp3FileResponseMap.get(GP_CONSTANTS.STATUS))) {
                    respLibrary = libraryRepository.save(respLibrary);
                    resp.setLibrary(respLibrary);
                    resp.setStatus(GP_CONSTANTS.SUCCESS);
                } else {
                    writeUpdateMp3ResonseToCSV(null, updateMp3FileResponseMap);
                    resp.setStatus(GP_CONSTANTS.FAILED);
                    resp.setStatus1("Find more details at : " + GP_CONSTANTS.GP_LOGS_PATH);
                }
            }
        } catch (Exception e) {
            resp.setStatus(GP_CONSTANTS.FAILED);
            resp.setError(e.getMessage());
        }
        return resp;
    }

    @SuppressWarnings({ "rawtypes" })
    public GPResponse updateAlbumInfo(Album reqAlbum) {
        GPResponse resp = new GPResponse();
        Map<String, String> fieldValMap = new HashMap<String, String>();
        // Map<String, Object> response = new HashMap<String, Object>();
        List<Object> respTracks = new ArrayList<Object>();
        Album respAlbum = getAlbumByAlbumId((reqAlbum.getAlbumId()));
        File musicFile = null;
        Map<String, String> updateMp3FileResponse = new HashMap<String, String>();
        Map<String, Object> updateMp3FilesResponse = new HashMap<String, Object>();
        boolean isWriteAlbumImg = false;
        try {
            List<Library> respAlbumTracks = getSongsByAlbum(respAlbum.getAlbumName());
            List<Object> reqAlbumTracks = reqAlbum.getAlbumTracks();
            System.out.println("reqAlbumTracks: " + reqAlbumTracks);
            // Library reqAlbumTrack = null;
            for (Library respAlbumTrack : respAlbumTracks) {
                musicFile = new File(respAlbumTrack.getSongPath());

                // Album name
                if (StringUtils.isNotEmpty(reqAlbum.getAlbumName())) {
                    fieldValMap.put("album", reqAlbum.getAlbumName());
                    if (!isWriteAlbumImg) {
                        isWriteAlbumImg = true;
                        fieldValMap.put("isWriteAlbumImg", "true");
                    }
                    respAlbum.setAlbumName(reqAlbum.getAlbumName());
                    respAlbumTrack.setAlbum(reqAlbum.getAlbumName());
                }

                // Album Artist
                if (StringUtils.isNotEmpty(reqAlbum.getAlbumArtist())) {
                    fieldValMap.put("albumArtist", reqAlbum.getAlbumArtist());
                    respAlbum.setAlbumArtist(reqAlbum.getAlbumArtist());
                    respAlbum.setComposer(reqAlbum.getAlbumArtist());
                    respAlbumTrack.setAlbumArtist(reqAlbum.getAlbumArtist());
                    respAlbumTrack.setComposer(reqAlbum.getAlbumArtist());
                }

                // Genre
                if (StringUtils.isNotEmpty(reqAlbum.getGenre())) {
                    fieldValMap.put("genre", reqAlbum.getGenre().toLowerCase());
                    respAlbum.setGenre(reqAlbum.getGenre());
                    respAlbumTrack.setGenre(reqAlbum.getGenre());
                }

                // Year
                if (reqAlbum.getYear() != 0) {
                    fieldValMap.put("year", String.valueOf(reqAlbum.getYear()));
                    respAlbum.setYear(reqAlbum.getYear());
                    respAlbumTrack.setYear(reqAlbum.getYear());
                }

                // Language
                if (StringUtils.isNotEmpty(reqAlbum.getLanguage())) {
                    fieldValMap.put("language", reqAlbum.getLanguage().toLowerCase());
                    respAlbum.setLanguage(reqAlbum.getLanguage());
                    // respAlbumTrack.setLanguage(reqAlbum.getLanguage());
                }

                // Total tracks
                if (reqAlbum.getTotaltracks() != 0) {
                    fieldValMap.put("totaltracks", String.valueOf(reqAlbum.getTotaltracks()));
                    respAlbum.setTotaltracks(reqAlbum.getTotaltracks());
                    respAlbumTrack.setTotaltracks(reqAlbum.getTotaltracks());
                }

                // Album Art
                if (reqAlbum.getAlbumArt() != null) {
                    fieldValMap.put("albumArt", String.valueOf(reqAlbum.getAlbumArt()));
                    respAlbum.setAlbumArt(reqAlbum.getAlbumArt());
                    respAlbumTrack.setAlbumArt(reqAlbum.getAlbumArt());
                }

                if (reqAlbumTracks != null && !reqAlbumTracks.isEmpty()) {
                    Library reqAlbumTrack = null;
                    Iterator iterator = reqAlbumTracks.iterator();
                    while (iterator.hasNext()) {
                        reqAlbumTrack = new Library((LinkedHashMap) iterator.next());
                        if (reqAlbumTrack.getSongId() != respAlbumTrack.getSongId()) {
                            continue;
                        }

                        // Track number
                        if (reqAlbumTrack.getTrackNumber() != 0) {
                            fieldValMap.put("trackNumber", String.valueOf(reqAlbumTrack.getTrackNumber()));
                            respAlbumTrack.setTrackNumber(reqAlbumTrack.getTrackNumber());
                        }

                        // Title
                        if (StringUtils.isNotEmpty(reqAlbumTrack.getTitle())) {
                            fieldValMap.put("title", reqAlbumTrack.getTitle());
                            respAlbumTrack.setTitle(reqAlbumTrack.getTitle());
                        }

                        // Artist
                        if (StringUtils.isNotEmpty(reqAlbumTrack.getArtist())) {
                            fieldValMap.put("artist", reqAlbumTrack.getArtist());
                            respAlbumTrack.setArtist(reqAlbumTrack.getArtist());
                        }

                        if (StringUtils.isNotEmpty(reqAlbumTrack.getLabel())) {
                            fieldValMap.put("label", reqAlbumTrack.getLabel());
                            fieldValMap.put("label", reqAlbumTrack.getLabel());
                            respAlbumTrack.setLabel(reqAlbumTrack.getLabel());
                        }

                        // lyricist
                        if (StringUtils.isNotEmpty(reqAlbumTrack.getLyricist())) {
                            fieldValMap.put("lyricist", reqAlbumTrack.getLyricist());
                            respAlbumTrack.setLyricist(reqAlbumTrack.getLyricist());
                        }

                        // Language
                        if (StringUtils.isNotEmpty(reqAlbumTrack.getLanguage())) {
                            fieldValMap.put("language", reqAlbumTrack.getLanguage());
                            respAlbumTrack.setLanguage(reqAlbumTrack.getLanguage());
                        }

                    }
                }
                updateMp3FileResponse = updateMp3File(musicFile, fieldValMap, true);
                updateMp3FilesResponse.put(musicFile.getAbsolutePath(), updateMp3FileResponse);
                if (StringUtils.equals(updateMp3FileResponse.get(GP_CONSTANTS.STATUS), GP_CONSTANTS.SUCCESS)) {
                    if (reqAlbum.isAlbumImgAvl()) {
                        respAlbum.setAlbumImgAvl(true);
                    }
                    respAlbum = albumRepository.save(respAlbum);
                    respAlbumTrack = libraryRepository.save(respAlbumTrack);
                    respTracks.add(respAlbumTrack);
                }
            }
            respAlbum.setAlbumTracks(respTracks);
            updateMp3FilesResponse.put(GP_CONSTANTS.RESPONSE_ALBUM, respAlbum);
            resp.setResponse(updateMp3FilesResponse);
            resp.setStatus(GP_CONSTANTS.SUCCESS);
        } catch (Exception e) {
            resp.setStatus(GP_CONSTANTS.FAILED);
            resp.setError(e.getMessage());
            e.printStackTrace();
        }
        return resp;
    }

    public GPResponse buildDeltaLibrary(List<File> fileList) {
        GPResponse resp = new GPResponse();
        List<File> deltaFileList = new ArrayList<File>();
        Message lastBuildCompletedTimeM = messageService.getMessageByName(GP_CONSTANTS.BUILD_COMPLETED_TIME);
        LocalDateTime fileLastModifiedTime = null;
        try {
            if (lastBuildCompletedTimeM != null) {
                String lastBuildCompletedTimeS = lastBuildCompletedTimeM.getValue();
                LocalDateTime lastBuildCompletedTime = LocalDateTime.parse(lastBuildCompletedTimeS);
                LOG.info("lastBuildCompletedTime: " + lastBuildCompletedTime.toString());
                for (File file : fileList) {
                    Instant modified = Files.getLastModifiedTime(Path.of(file.getAbsolutePath())).toInstant();
                    fileLastModifiedTime = modified.atZone(ZoneId.systemDefault()).toLocalDateTime();
                    if (lastBuildCompletedTime.compareTo(fileLastModifiedTime) < 0) {
                        deltaFileList.add(file);
                    }
                }
            } else {
                resp.setError(
                        "Encountered an error while refreshing. Please try running full build in Library page once.");
                resp.setResponse(messageService.getMessagesByType(GP_CONSTANTS.BUILD_STATUS));
                return resp;
            }

            if (deltaFileList.size() == 0) {
                resp.setError("No change found!");
                return resp;
            }

            String albumArtistName = null;
            String artistName = null;
            boolean isAlbumAdded = false;
            String[] artistNameArr = null;
            byte[] albumImg = null;
            Artist artist = null;
            Artist albumArtist = null;
            Library library = null;
            Album newAlbum = null;
            Album existingAlbum = null;
            Library existingLibrary = null;
            Tag tag = null;
            AudioFile audioFile = null;
            List<Library> libraryList = new ArrayList<Library>();
            List<Album> deltaAlbums = new ArrayList<Album>();
            List<Artist> artistList = new ArrayList<Artist>();
            List<Artist> albumArtistList = new ArrayList<Artist>();

            removeJAudioTagLogger();

            for (File deltaFile : deltaFileList) {
                audioFile = AudioFileIO.read(deltaFile);
                tag = audioFile.getTag();
                tag = removeUnwantedTags(tag);
                library = getLibraryFromFile(tag, audioFile, deltaFile);
                existingLibrary = libraryRepository.getBySongPath(library.getSongPath());

                if (existingLibrary != null) {
                    existingAlbum = albumRepository.getByAlbumNameAndYear(existingLibrary.getAlbum(),
                            existingLibrary.getYear());
                    isAlbumAdded = isContainsCurrentAlbum(deltaAlbums, library.getAlbum(), library.getLanguage());
                    if (!isAlbumAdded) {
                        if (existingAlbum != null) {
                            existingAlbum = Album.copy(existingAlbum, library);
                            albumImg = getAlbumImgBinFromTag(tag);
                            if (albumImg != null) {
                                existingAlbum = writeByteArrayToImgFile(existingAlbum, albumImg);
                            }
                            deltaAlbums.add(existingAlbum);
                        } else {
                            // do nothing as an alum should always exists for an existing library
                        }
                    }

                    if (!existingLibrary.getArtist().equals(library.getArtist())) {
                        artistName = existingLibrary.getArtist();
                        if (artistName.contains("/")) {
                            artistNameArr = artistName.split("/");
                        } else {
                            artistNameArr = artistName.split(",");
                        }

                        for (String tempArtistName : artistNameArr) {
                            tempArtistName = tempArtistName.trim();
                            artist = getCurrentArtist(artistList, tempArtistName, GP_CONSTANTS.ARTIST);
                            if (artist != null) {
                                artist.setCount(artist.getCount() - 1);
                                for (int i = 0; i < artistList.size(); i++) {
                                    if (artist.getArtistName().equals(artistList.get(i).getArtistName())) {
                                        artistList.set(i, artist);
                                    }
                                }
                            } else {
                                artist = artistRepository.getByArtistNameAndType(tempArtistName, GP_CONSTANTS.ARTIST);
                                if (artist != null) {
                                    artist.setCount(artist.getCount() - 1);
                                    artistList.add(artist);
                                }
                            }

                        }

                        artistName = library.getArtist();
                        if (artistName.contains("/")) {
                            artistNameArr = artistName.split("/");
                        } else {
                            artistNameArr = artistName.split(",");
                        }

                        for (String tempArtistName : artistNameArr) {
                            tempArtistName = tempArtistName.trim();
                            artist = getCurrentArtist(artistList, tempArtistName, GP_CONSTANTS.ARTIST);
                            if (artist != null) {
                                artist.setCount(artist.getCount() + 1);
                                for (int i = 0; i < artistList.size(); i++) {
                                    if (artist.getArtistName().equals(artistList.get(i).getArtistName())) {
                                        artistList.set(i, artist);
                                    }
                                }
                            } else {
                                artist = artistRepository.getByArtistNameAndType(tempArtistName, GP_CONSTANTS.ARTIST);
                                if (artist != null) {
                                    artist.setCount(artist.getCount() + 1);
                                    artistList.add(artist);
                                } else {
                                    artist = new Artist(GP_CONSTANTS.ARTIST);
                                    artist.setArtistName(tempArtistName);
                                    artist.setCount(1);
                                    artistList.add(artist);
                                }
                            }

                        }
                    }

                    if (!existingLibrary.getAlbumArtist().equals(library.getAlbumArtist())) { // Album artist
                        albumArtistName = existingLibrary.getAlbumArtist();
                        albumArtist = getCurrentArtist(albumArtistList, albumArtistName, GP_CONSTANTS.ALBUM_ARTIST);
                        if (albumArtist != null) {
                            albumArtist.setCount(albumArtist.getCount() - 1);
                            for (int i = 0; i < albumArtistList.size(); i++) {
                                if (albumArtist.getArtistName().equals(albumArtistList.get(i).getArtistName())) {
                                    albumArtistList.set(i, artist);
                                }
                            }
                        } else {
                            albumArtist = artistRepository.getByArtistNameAndType(albumArtistName,
                                    GP_CONSTANTS.ALBUM_ARTIST);
                            if (albumArtist != null) {
                                albumArtist.setCount(albumArtist.getCount() - 1);
                                albumArtistList.add(albumArtist);
                            }
                        }

                        albumArtistName = library.getAlbumArtist();
                        albumArtist = getCurrentArtist(albumArtistList, albumArtistName, GP_CONSTANTS.ALBUM_ARTIST);
                        if (albumArtist != null) {
                            albumArtist.setCount(albumArtist.getCount() + 1);
                            for (int i = 0; i < albumArtistList.size(); i++) {
                                if (albumArtist.getArtistName().equals(albumArtistList.get(i).getArtistName())) {
                                    albumArtistList.set(i, albumArtist);
                                }
                            }
                        } else {
                            albumArtist = artistRepository.getByArtistNameAndType(albumArtistName,
                                    GP_CONSTANTS.ALBUM_ARTIST);
                            if (albumArtist != null) {
                                albumArtist.setCount(albumArtist.getCount() + 1);
                                albumArtistList.add(albumArtist);
                            } else {
                                albumArtist = new Artist(GP_CONSTANTS.ALBUM_ARTIST);
                                albumArtist.setArtistName(albumArtistName);
                                albumArtist.setCount(1);
                                albumArtistList.add(albumArtist);
                            }
                        }

                    }

                    existingLibrary = Library.copy(existingLibrary, library);
                    libraryList.add(existingLibrary);
                } else {
                    libraryList.add(library);
                    isAlbumAdded = isContainsCurrentAlbum(deltaAlbums, library.getAlbum(), library.getLanguage());
                    if (!isAlbumAdded) {
                        existingAlbum = albumRepository.getByAlbumNameAndYear(library.getAlbum(), library.getYear());
                        if (existingAlbum != null) {
                            existingAlbum = Album.copy(existingAlbum, library);
                            albumImg = getAlbumImgBinFromTag(tag);
                            if (albumImg != null) {
                                existingAlbum = writeByteArrayToImgFile(existingAlbum, albumImg);
                            }
                            deltaAlbums.add(existingAlbum);
                        } else {
                            newAlbum = Album.copy(newAlbum, library);
                            albumImg = getAlbumImgBinFromTag(tag);
                            if (albumImg != null) {
                                newAlbum = writeByteArrayToImgFile(newAlbum, albumImg);
                            }
                            deltaAlbums.add(newAlbum);
                        }
                    }

                    artistName = library.getArtist();
                    if (artistName.contains("/")) {
                        artistNameArr = artistName.split("/");
                    } else {
                        artistNameArr = artistName.split(",");
                    }

                    for (String tempArtistName : artistNameArr) {
                        tempArtistName = tempArtistName.trim();
                        artist = getCurrentArtist(artistList, tempArtistName, GP_CONSTANTS.ARTIST);
                        if (artist != null) {
                            artist.setCount(artist.getCount() + 1);
                            for (int i = 0; i < artistList.size(); i++) {
                                if (artist.getArtistName().equals(artistList.get(i).getArtistName())) {
                                    artistList.set(i, artist);
                                }
                            }
                        } else {
                            artist = artistRepository.getByArtistNameAndType(tempArtistName, GP_CONSTANTS.ARTIST);
                            if (artist != null) {
                                artist.setCount(artist.getCount() + 1);
                                artistList.add(artist);
                            } else {
                                artist = new Artist(GP_CONSTANTS.ARTIST);
                                artist.setArtistName(tempArtistName);
                                artist.setCount(1);
                                artistList.add(artist);
                            }
                        }

                    }

                    albumArtistName = library.getAlbumArtist();
                    albumArtist = getCurrentArtist(albumArtistList, albumArtistName, GP_CONSTANTS.ALBUM_ARTIST);
                    if (albumArtist != null) {
                        albumArtist.setCount(albumArtist.getCount() + 1);
                        for (int i = 0; i < albumArtistList.size(); i++) {
                            if (albumArtist.getArtistName().equals(albumArtistList.get(i).getArtistName())) {
                                albumArtistList.set(i, albumArtist);
                            }
                        }
                    } else {
                        albumArtist = artistRepository.getByArtistNameAndType(albumArtistName,
                                GP_CONSTANTS.ALBUM_ARTIST);
                        if (albumArtist != null) {
                            albumArtist.setCount(albumArtist.getCount() + 1);
                            albumArtistList.add(albumArtist);
                        } else {
                            albumArtist = new Artist(GP_CONSTANTS.ALBUM_ARTIST);
                            albumArtist.setArtistName(albumArtistName);
                            albumArtist.setCount(1);
                            albumArtistList.add(albumArtist);
                        }
                    }
                }

            }

            if (libraryList != null) {
                libraryRepository.saveAll(libraryList);
            }

            if (deltaAlbums != null) {
                albumRepository.saveAll(deltaAlbums);
            }

            if (artistList != null && artistList.size() > 0) {
                artistRepository.saveAll(artistList);
            }

            if (albumArtistList != null && albumArtistList.size() > 0) {
                artistRepository.saveAll(albumArtistList);
            }

            artistList = artistRepository.getAllArtistsWithCountZeoOrLess();
            artistRepository.deleteAll(artistList);

            messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_COMPLETED_TIME,
                    LocalDateTime.now().toString());
            messageService.updateBuildStatus(GP_CONSTANTS.BUILD_STATUS, GP_CONSTANTS.BUILD_STATUS,
                    GP_CONSTANTS.COMPLETED);

        } catch (Exception e) {
            e.printStackTrace();
        }
        LOG.info("Refresh completed!");
        resp.setStatus("Refresh completed!");
        resp.setResponse(messageService.getMessagesByType(GP_CONSTANTS.BUILD_STATUS));
        return resp;
    }

}
