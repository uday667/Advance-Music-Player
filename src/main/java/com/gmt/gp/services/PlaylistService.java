package com.gmt.gp.services;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gmt.gp.model.Album;
import com.gmt.gp.model.GPResponse;
import com.gmt.gp.model.Library;
import com.gmt.gp.model.Message;
import com.gmt.gp.model.Playlist;
import com.gmt.gp.model.PlaylistItem;
import com.gmt.gp.repositories.PlaylistItemRepository;
import com.gmt.gp.repositories.PlaylistRepository;
import com.gmt.gp.util.GPUtil;
import com.gmt.gp.util.GP_CONSTANTS;
import com.gmt.gp.util.GP_ERRORS;

@Service
public class PlaylistService {

    private static final Logger LOG = LoggerFactory.getLogger(PlaylistItem.class);

    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private PlaylistItemRepository playlistItemRepository;

    @Autowired
    private LibraryService libraryService;

    @Autowired
    private MessageService messageService;

    @Autowired
    private HistoryService historyService;

    public List<PlaylistItem> getAllPlaylistItems() {
        return (List<PlaylistItem>) playlistItemRepository.findAll();
    }

    public void removeAll(List<PlaylistItem> playlistsR) {
        playlistItemRepository.deleteAll(playlistsR);
    }

    public void saveAll(List<PlaylistItem> playlistsU) {
        playlistItemRepository.saveAll(playlistsU);
    }

    public GPResponse addToPlaList(PlaylistItem reqPlaylist) {
        GPResponse resp = new GPResponse();
        PlaylistItem playlistItem = null;
        List<PlaylistItem> playlistItems = new ArrayList<PlaylistItem>();
        PlaylistItem existingPLItem = null;
        List<Library> songs = null;
        try {
            Playlist playlist = playlistRepository.getByName(reqPlaylist.getPlaylist());
            if (reqPlaylist.getSongId() != 0) {
                Library library = libraryService.getSongBySongId(reqPlaylist.getSongId());
                playlistItem = createPlaylistItemBySong(library, reqPlaylist);
                existingPLItem = playlistItemRepository.getByPlaylistIdAndSongPath(playlistItem.getPlaylistId(),
                        playlistItem.getSongPath());
                // playlistItem.setSongId(reqPlaylist.getSongId());
                if (existingPLItem == null) {
                    playlistItem = playlistItemRepository.save(playlistItem);
                    playlistItems.add(playlistItem);
                    resp.setStatus(GP_CONSTANTS.SUCCESS);
                    resp.setPlaylistItems(playlistItems);
                    if(null != playlist){
                        playlist.setLastUpdated(LocalDateTime.now());
                        playlistRepository.save(playlist);
                    }
                    
                } else {
                    resp.setStatus(GP_CONSTANTS.FAILED);
                    resp.setPlaylistItems(playlistItems);
                    resp.setError("Track is already exists in selected playlist");
                }

            } else if (reqPlaylist.getAlbumId() != 0) {
                Album album = libraryService.getAlbumByAlbumId(reqPlaylist.getAlbumId());
                songs = libraryService.getSongsByAlbum(album.getAlbumName());
                resp.setStatus1("Added All songs from Album '"+album.getAlbumName()+"' to playlist - "+reqPlaylist.getPlaylist());
            } else if (StringUtils.isNotEmpty(reqPlaylist.getLanguage())) {
                songs = libraryService.getSongsByLanguage(reqPlaylist.getLanguage());
                resp.setStatus1("Added All songs from language '"+reqPlaylist.getLanguage()+"' to playlist - "+reqPlaylist.getPlaylist());
            } else if (StringUtils.isNotEmpty(reqPlaylist.getGenre())) {
                songs = libraryService.getSongsByGenre(reqPlaylist.getGenre());
                resp.setStatus1("Added All songs from genre '"+reqPlaylist.getGenre()+"' to playlist - "+reqPlaylist.getPlaylist());
            } else if (StringUtils.isNotEmpty(reqPlaylist.getArtist())) {
                songs = libraryService.getSongsByArtist(reqPlaylist.getArtist());
                resp.setStatus1("Added All songs of artist '"+reqPlaylist.getArtist()+"' to playlist - "+reqPlaylist.getPlaylist());
            }else if (StringUtils.isNotEmpty(reqPlaylist.getSongsIds())) {
                String[] songIds = reqPlaylist.getSongsIds().split(",");
                songs = libraryService.getSongsBySongIds(songIds);
                resp.setStatus1("Added All selected songs to playlist - "+reqPlaylist.getPlaylist());
            } else {
                resp.setStatus(GP_CONSTANTS.FAILED);
                resp.setError(GP_ERRORS.ERR_PLAYLIST_REQ_ID_NOT_FOUND);
            }

            if(songs != null && songs.size() > 0){
                playlistItems = (List<PlaylistItem>) addSongsToPlaylist(songs,
                    new Playlist(reqPlaylist.getPlaylistId(), reqPlaylist.getPlaylist()));
                resp.setStatus(GP_CONSTANTS.SUCCESS);
                resp.setPlaylistItems(playlistItems);
            }

        } catch (Exception e) {
            resp.setStatus(GP_CONSTANTS.FAILED);
            resp.setStatus1(null);
            e.printStackTrace();
        }
        return resp;
    }

    public List<Library> getSongsInPlaylist(long playlistId) {
        List<Long> songIds = playlistItemRepository.getSongIdsInPlaylist(playlistId);
        List<Library> songs = libraryService.findAllByIds(songIds);
        List<Library> songsInPlaylist = new ArrayList<Library>();
        for (long songId : songIds) {
            songsInPlaylist.add(songs.stream().filter(o -> (o.getSongId() == songId)).findFirst().orElse(null));
        }
        Collections.sort(songsInPlaylist, (o1, o2) -> (o1.getTitle().compareTo(o2.getTitle())));

        return songsInPlaylist;
    }

    public List<String> getAlbumNamesByPlaylistId(long playlistId) {
        return playlistItemRepository.getAlbumNamesByPlaylistId(playlistId);
    }

    public GPResponse deletePlaylist(long playlistId) {
        GPResponse resp = new GPResponse();
        List<PlaylistItem> playlistItems = playlistItemRepository.getByPlaylistId(playlistId);
        if (playlistItems != null && !playlistItems.isEmpty()) {
            playlistItemRepository.deleteAll(playlistItems);
        }
        //messageService.removeMessageById(playlistId);
        Optional<Playlist> playlist = playlistRepository.findById(playlistId);
        playlistRepository.delete(playlist.get());
        resp.setStatus(GP_CONSTANTS.SUCCESS);
        return resp;
    }

    @Deprecated
    public GPResponse renamePlaylist(Message reqMessage) {
        GPResponse resp = new GPResponse();
        try {
            Message playlistName = messageService.getMessageBYId(reqMessage.getMessageId());
            playlistName.setValue(reqMessage.getValue());
            playlistName = messageService.saveMaMessage(playlistName);
            List<PlaylistItem> playlistItems = playlistItemRepository.getByPlaylistId(reqMessage.getMessageId());
            for (PlaylistItem playlistItem : playlistItems) {
                playlistItem.setPlaylist(reqMessage.getValue());
            }
            playlistItemRepository.saveAll(playlistItems);
            resp.setMessage(playlistName);
            resp.setStatus(GP_CONSTANTS.SUCCESS);
        } catch (Exception e) {
            resp.setStatus(GP_CONSTANTS.FAILED);
            resp.setError(e.getMessage());
            e.printStackTrace();
        }
        return resp;
    }

    public GPResponse renamePlaylist(Playlist rePlaylist) {
        GPResponse resp = new GPResponse();
        try {
            Optional<Playlist> playlist = playlistRepository.findById(rePlaylist.getId());
            playlist.get().setName(rePlaylist.getName());
            playlist.get().setLastUpdated(LocalDateTime.now());
            playlistRepository.save(playlist.get());
            List<PlaylistItem> playlistItems = playlistItemRepository.getByPlaylistId(playlist.get().getId());
            for (PlaylistItem playlistItem : playlistItems) {
                playlistItem.setPlaylist(playlist.get().getName());
                playlistItem.setLastUpdated(LocalDateTime.now());
            }
            playlistItemRepository.saveAll(playlistItems);
            resp.setResponse(playlist.get());
            resp.setStatus(GP_CONSTANTS.SUCCESS);
        } catch (Exception e) {
            resp.setStatus(GP_CONSTANTS.FAILED);
            resp.setError(e.getMessage());
            e.printStackTrace();
        }
        return resp;
    }

    public GPResponse removeFromPlaylist(long playlistId, long songId) {
        GPResponse resp = new GPResponse();
        try {
            System.out.println("playlistId: " + playlistId + ",  songId: " + songId);
            List<PlaylistItem> playlistItems = playlistItemRepository.getByPlaylistIdAndSongId(playlistId, songId);
            if (playlistItems != null && playlistItems.size() > 0) {
                PlaylistItem playlistItem = playlistItems.get(0);
                playlistItemRepository.delete(playlistItem);
                resp.setPlaylistItem(playlistItem);
                resp.setStatus(GP_CONSTANTS.SUCCESS);
            }
        } catch (Exception e) {
            resp.setError(e.getMessage());
            resp.setStatus(GP_CONSTANTS.FAILED);
        }
        return resp;
    }

    @Deprecated
    public Map<String, Object> getPlaylistNames(String messageType) {
        List<Message> plNames = messageService.getMessagesByType(messageType);
        Map<Long, List<String>> plAlbums = new HashMap<Long, List<String>>();
        List<String> plAlbumList = null;
        List<String> tempPlAlbumList = new ArrayList<String>();
        String albumName = null;
        List<Map<String, Object>> hisAlbumList = null;
        Map<String, Object> resp = new HashMap<String, Object>();
        Map<Long, Integer> playlistSongsCount = new HashMap<Long, Integer>();
        resp.put(GP_CONSTANTS.PLAYLIST_NAMES, plNames);
        for (Message message : plNames) {
            tempPlAlbumList = getAlbumNamesByPlaylistId(message.getMessageId());
            hisAlbumList = historyService.getAlbumsGroupedFromHistoryJDBC(0, "count");
            int counter = 0;
            plAlbumList = new ArrayList<String>();
            if (tempPlAlbumList.size() <= GP_CONSTANTS.GROUPED_ALBUM_COUNT_4) {
                plAlbumList.addAll(tempPlAlbumList);
            } else {
                for (int i = 0; i < hisAlbumList.size(); i++) {
                    albumName = (String) hisAlbumList.get(i).get("albumName");
                    if (tempPlAlbumList.contains(albumName)) {
                        counter++;
                        plAlbumList.add(albumName);
                    }
                    if (counter == 3) {
                        counter = 0;
                        break;
                    }
                }
                if (plAlbumList.size() < 4 && tempPlAlbumList.size() >= 4) {
                    for (String albumName1 : tempPlAlbumList) {
                        if (!plAlbumList.contains(albumName1)) {
                            plAlbumList.add(albumName1);
                            if (plAlbumList.size() == 4) {
                                break;
                            }
                        }
                    }
                }
            }
            plAlbums.put(message.getMessageId(), plAlbumList);
            playlistSongsCount.put(message.getMessageId(), getSongsInPlaylist(message.getMessageId()).size());
        }
        resp.put(GP_CONSTANTS.PLAYLIST_ALBUMS, plAlbums);
        resp.put(GP_CONSTANTS.PLAYLIST_SONGS_COUNT, playlistSongsCount);
        return resp;
    }

    public Map<String, Object> getPlaylists() {
        List<Playlist> playlists = (List<Playlist>) playlistRepository.findAll();
        Map<Long, List<String>> plAlbums = new HashMap<Long, List<String>>();
        List<String> plAlbumList = null;
        List<String> tempPlAlbumList = new ArrayList<String>();
        String albumName = null;
        List<Map<String, Object>> hisAlbumList = null;
        Map<String, Object> resp = new HashMap<String, Object>();
        Map<Long, Integer> playlistSongsCount = new HashMap<Long, Integer>();
        resp.put(GP_CONSTANTS.PLAYLIST_NAMES, playlists);
        for (Playlist playlist : playlists) {
            tempPlAlbumList = getAlbumNamesByPlaylistId(playlist.getId());
            hisAlbumList = historyService.getAlbumsGroupedFromHistoryJDBC(0, "count");
            int counter = 0;
            plAlbumList = new ArrayList<String>();
            if (tempPlAlbumList.size() <= GP_CONSTANTS.GROUPED_ALBUM_COUNT_4) {
                plAlbumList.addAll(tempPlAlbumList);
            } else {
                for (int i = 0; i < hisAlbumList.size(); i++) {
                    albumName = (String) hisAlbumList.get(i).get("albumName");
                    if (tempPlAlbumList.contains(albumName)) {
                        counter++;
                        plAlbumList.add(albumName);
                    }
                    if (counter == 3) {
                        counter = 0;
                        break;
                    }
                }
                if (plAlbumList.size() < 4 && tempPlAlbumList.size() >= 4) {
                    for (String albumName1 : tempPlAlbumList) {
                        if (!plAlbumList.contains(albumName1)) {
                            plAlbumList.add(albumName1);
                            if (plAlbumList.size() == 4) {
                                break;
                            }
                        }
                    }
                }
            }
            plAlbums.put(playlist.getId(), plAlbumList);
            playlistSongsCount.put(playlist.getId(), getSongsInPlaylist(playlist.getId()).size());
        }

        resp.put(GP_CONSTANTS.PLAYLIST_ALBUMS, plAlbums);
        resp.put(GP_CONSTANTS.PLAYLIST_SONGS_COUNT, playlistSongsCount);
        return resp;
    }

    public GPResponse exportPlaylists() {
        return exportPlaylists(false);
    }

    public GPResponse exportPlaylists(boolean isTakePlBkp) {
        GPResponse resp = new GPResponse();
        Map<String, List<PlaylistItem>> plItemsMap = new HashMap<String, List<PlaylistItem>>();
        List<PlaylistItem> plItems = getAllPlaylistItems();
        List<PlaylistItem> tempPlItems = null;
        String plItemIdentifier = null;
        String playlistPath = GP_CONSTANTS.GP_PLAYLIST_PATH;
        if(isTakePlBkp){
            playlistPath = GP_CONSTANTS.GP_PLAYLIST_PATH+"\\backup\\Playlists_Backup_"+LocalDateTime.now().toString().replaceAll(":", "_");
        }
        for (PlaylistItem plItem : plItems) {
            plItemIdentifier = plItem.getPlaylistId() + plItem.getPlaylist();
            if (plItemsMap.containsKey(plItemIdentifier)) {
                tempPlItems = plItemsMap.get(plItemIdentifier);
                tempPlItems.add(plItem);
            } else {
                tempPlItems = new ArrayList<PlaylistItem>();
                tempPlItems.add(plItem);
            }
            plItemsMap.put(plItemIdentifier, tempPlItems);
        }
        resp.setResponse(plItemsMap);
        resp.setStatus1(playlistPath);
        boolean isDirExists = GPUtil
                .checkAndCreateFolders(playlistPath);
        for (String plItemsMapKey : plItemsMap.keySet()) {
            tempPlItems = plItemsMap.get(plItemsMapKey);
            if (isDirExists && tempPlItems.size() > 0) {
                writeSongPathToCSV(tempPlItems, playlistPath);
                writePlItemToGPFIle(tempPlItems, playlistPath);
                writePlItemToM3UFIle(tempPlItems, playlistPath);
            }
        }
        return resp;
    }

    private void writePlItemToGPFIle(List<PlaylistItem> plItems, String playlistPath) {
        final String methodName = "writePlItemToGPFIle";
        final String playlistFilePath = playlistPath+"\\gp\\";
        try {
            boolean isGpDirExists = GPUtil.checkAndCreateFolders(playlistFilePath);
            if (!isGpDirExists) {
                LOG.error(methodName + ", exiting, directory: " + playlistFilePath + " doesn't esists");
                return;
            }
            File gpFile = new File(playlistFilePath + plItems.get(0).getPlaylist() + ".gp");
            FileWriter gpFileWriter = new FileWriter(gpFile);
            for (PlaylistItem plItem : plItems) {
                gpFileWriter.append(plItem.getSongTitle())
                        .append(",")
                        .append(plItem.getAlbumName())
                        .append(",")
                        .append(plItem.getSongPath())
                        .append(System.lineSeparator());
            }
            gpFileWriter.flush();
            gpFileWriter.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void writePlItemToM3UFIle(List<PlaylistItem> plItems, String playlistPath) {
        final String methodName = "writePlItemToM3UFIle";
        final String playlistFilePath = playlistPath+"\\m3u\\";
        try {
            boolean isDirExists = GPUtil.checkAndCreateFolders(playlistFilePath);
            if (!isDirExists) {
                LOG.error(methodName + ", exiting, directory: " + playlistFilePath + " doesn't esists");
                return;
            }
            File m3uFile = new File(playlistFilePath + plItems.get(0).getPlaylist() + ".m3u");
            FileWriter m3uFileWriter = new FileWriter(m3uFile);
            for (PlaylistItem plItem : plItems) {
                m3uFileWriter.append("/storage/emulated/0/")
                        .append(GPUtil.getFileNameFromFilePath(plItem.getSongPath()))
                        .append(System.lineSeparator());
            }
            m3uFileWriter.flush();
            m3uFileWriter.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void writeSongPathToCSV(List<PlaylistItem> plItems, String playlistPath) {
        final String methodName = "writeSongPathToCSV";
        final String playlistFilePath = playlistPath+"\\csv\\";
        try {
            boolean isCSVDirExists = GPUtil.checkAndCreateFolders(playlistFilePath);
            if (!isCSVDirExists) {
                LOG.error(
                        methodName + ", exiting, directory: " + playlistFilePath + " doesn't esists");
                return;
            }
            File songPathCSVFile = new File(playlistFilePath + plItems.get(0).getPlaylist() + ".csv");
            FileWriter songPathCSVFileWriter = new FileWriter(songPathCSVFile);
            for (PlaylistItem plItem : plItems) {
                songPathCSVFileWriter.append(plItem.getSongPath())
                        .append(System.lineSeparator());
            }
            songPathCSVFileWriter.flush();
            songPathCSVFileWriter.close();
            
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public GPResponse importPlaylists(String payload, String fileType) {
        GPResponse resp = new GPResponse();
        JSONObject reqPlaylistsObj = new JSONObject(payload);
        Set<String> reqPlaylistObjKeys = reqPlaylistsObj.keySet();
        JSONArray reqPlaylistArr = null;
        List<Library> songs = null;
        List<String> songPathList = null;
        Playlist playlist = null;
        JSONObject reqPlaylistItemObj = null;
        Library reqPlaylistLibrary = null;
        List<Library> reqPlaylistLibraryList = null;
        for (String reqPlName : reqPlaylistObjKeys) {
            playlist = playlistRepository.getByName(reqPlName);
            if (playlist == null) {
                playlist = new Playlist(reqPlName, LocalDateTime.now(), LocalDateTime.now());
                playlist = playlistRepository.save(playlist);
            }
            reqPlaylistArr = (JSONArray) reqPlaylistsObj.get(reqPlName);
            if (GP_CONSTANTS.FILETYPE_CSV.equals(fileType)) {
                songPathList = new ArrayList<String>();
                for (int i = 0; i < reqPlaylistArr.length(); i++) {
                    songPathList.add(reqPlaylistArr.getString(i));
                }
                songs = libraryService.getSongsBySongPath(songPathList);
            } else if (GP_CONSTANTS.FILETYPE_GP.equals(fileType)) {
                reqPlaylistLibraryList = new ArrayList<Library>();
                for (int i = 0; i < reqPlaylistArr.length(); i++) {
                    reqPlaylistItemObj = reqPlaylistArr.getJSONObject(i);
                    reqPlaylistLibrary = new Library();
                    reqPlaylistLibrary.setAlbum(reqPlaylistItemObj.getString("album"));
                    reqPlaylistLibrary.setTitle(reqPlaylistItemObj.getString("title"));
                    reqPlaylistLibrary.setSongPath(reqPlaylistItemObj.getString("songPath"));
                    reqPlaylistLibraryList.add(reqPlaylistLibrary);
                }
                songs = libraryService.getSongsByAlbumAndTitle(reqPlaylistLibraryList);
            }

            addSongsToPlaylist(songs, playlist);
            playlist.setLastUpdated(LocalDateTime.now());
            playlistRepository.save(playlist);
        }
        resp.setResponse(getPlaylists());
        resp.setStatus1(String.valueOf(reqPlaylistObjKeys.size()));
        return resp;
    }

    private PlaylistItem createPlaylistItemBySong(Library song, Playlist playlist) {
        PlaylistItem playlistItem = new PlaylistItem();
        playlistItem.setPlaylistId(playlist.getId());
        playlistItem.setPlaylist(playlist.getName());
        playlistItem.setSongId(song.getSongId());
        playlistItem.setSongPath(song.getSongPath());
        playlistItem.setAlbumName(song.getAlbum());
        playlistItem.setSongTitle(song.getTitle());
        return playlistItem;
    }

    private PlaylistItem createPlaylistItemBySong(Library library, PlaylistItem reqPlaylist) {
        return createPlaylistItemBySong(library,
                new Playlist(reqPlaylist.getPlaylistId(), reqPlaylist.getPlaylist()));
    }

    private Iterable<PlaylistItem> addSongsToPlaylist(List<Library> songs, Playlist playlist) {
        List<PlaylistItem> playlistItems = new ArrayList<PlaylistItem>();
        List<PlaylistItem> existingPlaylistItems = playlistItemRepository.getByPlaylistId(playlist.getId());
        boolean isSongPresentInPL = false;
        for (Library song : songs) {
            isSongPresentInPL = existingPlaylistItems.stream().filter(o -> o.getSongPath().equals(song.getSongPath()))
                    .findFirst().isPresent();
            if (!isSongPresentInPL) {
                playlistItems.add(createPlaylistItemBySong(song, playlist));
            }
        }
        return playlistItemRepository.saveAll(playlistItems);
    }

    public GPResponse createPlalist(String name) {
        GPResponse resp = new GPResponse();
        Playlist temPlaylist = playlistRepository.getByName(name);
        if(temPlaylist != null){
            resp.setStatus(GP_CONSTANTS.FAILED);
            resp.setError(GP_ERRORS.ERR_PLAYLIST_ALREADY_EXISTS);
            return resp;
        }
        temPlaylist =  playlistRepository.save(new Playlist(name, LocalDateTime.now(), LocalDateTime.now()));
        resp.setStatus(GP_CONSTANTS.SUCCESS);
        resp.setResponse(temPlaylist);
        return resp;
    }

    @Deprecated
    public GPResponse movePlaylistNames() {
        List<Message> playListNames = messageService.getMessagesByType(GP_CONSTANTS.PLAYLIST);
        for (Message playlistName : playListNames) {
            Playlist playlist = playlistRepository.save(new Playlist(
                playlistName.getValue(), LocalDateTime.now(), null
            ));

            List<PlaylistItem> playlistItems = playlistItemRepository.getByPlaylist(playlist.getName());
            List<PlaylistItem> playlistItems1 = new ArrayList<PlaylistItem>();
            for (PlaylistItem playlistItem : playlistItems) {
                playlistItem.setPlaylistId(playlist.getId());
                playlistItem.setLastUpdated(LocalDateTime.now());
                playlistItems1.add(playlistItem);
            }
            playlistItemRepository.saveAll(playlistItems1);
        }
        return new GPResponse(GP_CONSTANTS.SUCCESS, null);
    }

    public List<String> getAssignedPlaylists(String type, String identifier) {
        if(GP_CONSTANTS.TRACK.equalsIgnoreCase(type)){
            return playlistItemRepository.getPlaylistsBySongId(Long.parseLong(identifier));
        }else if(StringUtils.equals(type, GP_CONSTANTS.ALBUM)){
           // System.out.println(playlistItemRepository.getPlaylistsByAlbumName(identifier));
            return playlistItemRepository.getPlaylistsByAlbumName(identifier);
        }
        return new ArrayList<String>();//returning an empty list
    }

}
