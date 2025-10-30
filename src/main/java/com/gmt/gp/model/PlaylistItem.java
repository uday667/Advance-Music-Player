package com.gmt.gp.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity
public class PlaylistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String playlist;
    private long playlistId;
    private String songPath;
    private String albumName;
    private long albumId;
    private long songId;
    private String songTitle;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss")
    private LocalDateTime lastUpdated;
    @Transient
    private String language;
    @Transient
    private String genre;
    @Transient
    private String artist;
    @Transient
    private String songsIds;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getPlaylist() {
        return playlist;
    }

    public void setPlaylist(String playlist) {
        this.playlist = playlist;
    }

    public long getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(long playlistId) {
        this.playlistId = playlistId;
    }

    public String getSongPath() {
        return songPath;
    }

    public void setSongPath(String songPath) {
        this.songPath = songPath;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    public long getAlbumId() {
        return albumId;
    }

    public void setAlbumId(long albumId) {
        this.albumId = albumId;
    }

    public long getSongId() {
        return songId;
    }

    public void setSongId(long songId) {
        this.songId = songId;
    }

    public String getSongTitle() {
        return songTitle;
    }

    public void setSongTitle(String songTitle) {
        this.songTitle = songTitle;
    }

    

    public PlaylistItem() {

    }

    public PlaylistItem(String playlist, String songPath) {
        this.playlist = playlist;
        this.songPath = songPath;
    }

    public PlaylistItem(long id, String playlist, long playlistId, String songPath, String albumName, long albumId,
            long songId, String songTitle) {
        this.id = id;
        this.playlist = playlist;
        this.playlistId = playlistId;
        this.songPath = songPath;
        this.albumName = albumName;
        this.albumId = albumId;
        this.songId = songId;
        this.songTitle = songTitle;
    }

    public PlaylistItem copy() {
        return new PlaylistItem(id, playlist, playlistId, songPath, albumName, albumId, songId, songTitle);
    }

    public PlaylistItem merge(Library library){
        this.songId = library.getSongId();
        this.songPath = library.getSongPath();
        this.albumName = library.getAlbum();
        this.songTitle = library.getTitle();
        return this;
    }

    @Override
    public String toString() {
        return "PlaylistItem [id=" + id + ", playlist=" + playlist + ", playlistId=" + playlistId + ", songPath="
                + songPath + ", albumName=" + albumName + ", albumId=" + albumId + ", songId=" + songId + ", songTitle="
                + songTitle + ", createdDate=" + createdDate + ", lastUpdated=" + lastUpdated + ", language=" + language
                + ", genre=" + genre + ", artist=" + artist + "]";
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getSongsIds() {
        return songsIds;
    }

    public void setSongsIds(String songsIds) {
        this.songsIds = songsIds;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    

}
