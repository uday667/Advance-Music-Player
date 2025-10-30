package com.gmt.gp.controllers;

import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.gmt.gp.model.GPMedia;
import com.gmt.gp.model.GPResponse;
import com.gmt.gp.model.Library;
import com.gmt.gp.model.Message;
import com.gmt.gp.services.LibraryService;
import com.gmt.gp.services.MessageService;
import com.gmt.gp.util.GPUtil;
import com.gmt.gp.util.GP_CONSTANTS;

import javafx.application.Platform;
import javafx.scene.media.Media;
import javafx.scene.media.MediaPlayer;
import javafx.scene.media.MediaPlayer.Status;
import javafx.util.Duration;

@RestController
@RequestMapping("/media")
public class MediaController {

    private MediaPlayer mPlayer = null;

    @Autowired
    private LibraryService libraryService;

    @Autowired
    private MessageService messageService;

    @PutMapping("/play-song/{songId}")
    public GPResponse playSong(@RequestBody String currentVolume, @PathVariable String songId,
            @RequestParam String currentPlayTime) {
        GPResponse resp = new GPResponse();
        Double volume = Double.parseDouble(currentVolume);
        if (songId.equals("0") || songId == null) {
            resp.setError("songId 0 or null");
            return resp;
        }

        if (GPUtil.checkIsNull(currentPlayTime)) {
            currentPlayTime = null;
        }

        Library song = libraryService.getSongBySongId(Integer.parseInt(songId));
        if (song != null) {
            File songExists = new File(song.getSongPath());
            if (!songExists.exists()) {
                libraryService.deleteSongBySongId(song.getSongId());
                resp.setStatus(GP_CONSTANTS.FAILED);
                resp.setError("Select song is not availbe at the source. Hence, entry removed.");
                return resp;
            }
        }
        Library tempSong = null;
        Message message = messageService.getMessageByName(GP_CONSTANTS.LAST_PLAYED_SONG_ID);
        if (message != null) {
            messageService.saveMaMessage(message.setValue(songId));
        } else {
            messageService.saveMaMessage(new Message(GP_CONSTANTS.LIBRARY, GP_CONSTANTS.LAST_PLAYED_SONG_ID, songId));
        }
        // historyService.updateHistory(song);
        boolean getLyrics = false;
        if (song.getLyrics() == null) {
            getLyrics = true;
        }
        song = libraryService.getAAttrFromTag(song, false, getLyrics);
        if (mPlayer != null) {
            try {
                tempSong = getTempSong(song);
                Media media = new Media(new File(tempSong.getSongPath()).toURI().toString());
                mPlayer.dispose();
                mPlayer = new MediaPlayer(media);
                mPlayer.setVolume(volume);
                mPlayer.play();
                resp.setStatus("PLAYING");
                resp.setLibrary(song);
            } catch (IllegalStateException ise) {
                resp.setError(ise.getMessage());
                ise.printStackTrace();
                if (ise.getMessage().contains("Toolkit not initialized")) {
                    resp = initAndPlay(song, volume, currentPlayTime);
                }
            }
        } else {
            resp = initAndPlay(song, volume, currentPlayTime);
        }
        deleteTempSongs(song);
        return resp;
    }

    private void deleteTempSongs(Library currentSong) {
        File tespSongDir = new File(GP_CONSTANTS.GP_TEMP_SONG_PATH);
        File[] tempSongs = tespSongDir.listFiles();
        if (tempSongs != null) {
            for (File tempSong : tempSongs) {
                if (!tempSong.getAbsolutePath().equals(currentSong.getSongPath())) {
                    tempSong.delete();
                }
            }
        }
    }

    public GPResponse initAndPlay(Library song, Double volume, String currentPlayTime) {
        GPResponse resp = new GPResponse();
        try {
            Platform.startup(() -> {
                Library tempSong = getTempSong(song);
                Media media = new Media(new File(tempSong.getSongPath()).toURI().toString());
                mPlayer = new MediaPlayer(media);
                mPlayer.setVolume(volume);
                if (currentPlayTime != null) {
                    mPlayer.setOnPlaying(new Runnable() {
                        public void run() {
                            mPlayer.seek(new Duration(Double.parseDouble(currentPlayTime)));
                        }
                    });
                }
                mPlayer.play();
            });
            resp.setLibrary(song);
            resp.setStatus("PLAYING");
        } catch (Exception e) {
            resp.setError(e.getMessage());
            e.printStackTrace();
        }
        return resp;
    }

    public Library getTempSong(Library song) {
        boolean isCopied = false;
        Library tempSong = song.copy();
        String tempSongNameWithExt = song.getSongPath();
        String[] tempSongNameWithExtArr = tempSongNameWithExt.split("\\\\");
        if (tempSongNameWithExtArr != null && tempSongNameWithExtArr.length > 0) {
            tempSongNameWithExt = tempSongNameWithExtArr[tempSongNameWithExtArr.length - 1];
            tempSong.setSongPath(GP_CONSTANTS.GP_TEMP_SONG_PATH + tempSongNameWithExt);
            isCopied = GPUtil.copyFile(song.getSongPath(), tempSong.getSongPath(), GP_CONSTANTS.GP_TEMP_SONG_PATH);
            if (!isCopied) {
                tempSong = song;
            }
        }
        return tempSong;
    }

    @RequestMapping("/play-pause")
    public GPResponse playPause() {
        GPResponse resp = new GPResponse();
        if (mPlayer != null) {
            Status mpStatus = mPlayer.getStatus();
            if (mpStatus == Status.PLAYING) {
                mPlayer.pause();
            } else {
                mPlayer.play();
            }

            GPUtil.ThreadSleep(600);

            resp.setStatus(mPlayer.getStatus().toString());
        } else {
            resp.setStatus(GP_CONSTANTS.MEDIA_PLAYER_NULL);
        }
        return resp;
    }

    @RequestMapping("/forward/{playbackTime}")
    public GPResponse forwardSong(@PathVariable Double playbackTime) {
        GPResponse resp = new GPResponse();
        GPMedia gpMedia = new GPMedia();
        if (mPlayer != null) {
            mPlayer.seek(new Duration(playbackTime));
            GPUtil.ThreadSleep(200);
            gpMedia.setCurrentTime(mPlayer.getCurrentTime().toString());
            resp.setgMedia(gpMedia);
        }
        return resp;
    }

    @RequestMapping("/volume/{volume}")
    public GPResponse setVolume(@PathVariable Double volume) {
        GPResponse resp = new GPResponse();
        GPMedia gpMedia = new GPMedia();
        if (mPlayer != null) {

            GPUtil.ThreadSleep(200);

            mPlayer.setVolume(volume);
            resp.setStatus(mPlayer.getStatus().toString());
            gpMedia.setCurrentVolume(mPlayer.getVolume());
            resp.setgMedia(gpMedia);
        }
        return resp;
    }

    @RequestMapping("/current-song-status")
    public GPResponse getCurrentSontStatus() {
        GPResponse resp = new GPResponse();
        GPMedia gpMedia = new GPMedia();
        if (mPlayer != null) {
            gpMedia.setCurrentTime(mPlayer.getCurrentTime().toString());
            gpMedia.setCurrentVolume(mPlayer.getVolume());
            resp.setStatus(mPlayer.getStatus().toString());
        } else {
            return null;
        }
        resp.setgMedia(gpMedia);
        return resp;
    }

    @RequestMapping("/current-song-and-status")
    public GPResponse getCurrentSongAndStatus() {
        GPResponse resp = new GPResponse();
        GPMedia gpMedia = new GPMedia();
        try {
            if (mPlayer != null) {
                GPUtil.ThreadSleep(200);
                gpMedia.setCurrentTime(mPlayer.getCurrentTime().toString());
                gpMedia.setCurrentVolume(mPlayer.getVolume());
                // Media media = mPlayer.getMedia();
                // String fileName = media.getSource();
                // fileName = fileName.substring(6, fileName.length());
                // fileName = URLDecoder.decode(fileName, "UTF-8");
                // fileName = fileName.replaceAll("/", "\\\\");
                // Library library = libraryService.getSongBySongPath(fileName);
                Message lastPlayedSongId = messageService.getMessageByName(GP_CONSTANTS.LAST_PLAYED_SONG_ID);
                Library library = null;
                if (lastPlayedSongId != null) {
                    library = libraryService.getSongBySongId(Long.parseLong(lastPlayedSongId.getValue()));
                    library = libraryService.getAAttrFromTag(library, false, true);
                    resp.setLibrary(library);
                }
                resp.setStatus(mPlayer.getStatus().toString());
                resp.setgMedia(gpMedia);
            } else {
                resp.setError(GP_CONSTANTS.MEDIA_PLAYER_NULL);
                Message message = messageService.getMessageByName(GP_CONSTANTS.LAST_PLAYED_SONG_ID);
                String songId = message != null ? message.getValue() : null;
                if (!GPUtil.checkIsNull(songId)) {
                    resp.setLibrary(libraryService
                            .getAAttrFromTag(libraryService.getSongBySongId(Integer.parseInt(songId)), false, true));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resp;
    }

}
