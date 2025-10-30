package com.gmt.gp.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

/**
 * 
 * Replica of Library class with addtional fields to store song played history
 * 
 *  **/

 @Entity
public class History {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long historyId;
    private long songId;
    private String songPath;
    private String title;
    private String artist;
    private String albumArtist;
    private String album;
    private int year;
    private String composer;
    private String lyricist;
    private int trackNumber;
    private int totaltracks;
    private String label;
    private String genre;
    private long trackLength;
    private int count;
    private LocalDateTime lastPlayedTime;
    

    public History() {
    }

    public History(Library library) {
        this.songId = library.getSongId();
        this.title = library.getTitle();
        this.artist = library.getArtist();
        this.albumArtist = library.getAlbumArtist();
        this.album = library.getAlbum();
        this.year = library.getYear();
        this.composer = library.getComposer();
        this.lyricist = library.getLyricist();
        this.trackNumber = library.getTrackNumber();
        this.totaltracks = library.getTotaltracks();
        this.genre = library.getGenre();
        this.trackLength = library.getTrackLength();
        this.label = library.getLabel();
        this.songPath = library.getSongPath();
    }

    public long getHistoryId() {
        return historyId;
    }
    public void setHistoryId(long historyId) {
        this.historyId = historyId;
    }
    public long getSongId() {
        return songId;
    }
    public void setSongId(long songId) {
        this.songId = songId;
    }
    public String getSongPath() {
        return songPath;
    }
    public void setSongPath(String songPath) {
        this.songPath = songPath;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getArtist() {
        return artist;
    }
    public void setArtist(String artist) {
        this.artist = artist;
    }
    public String getAlbumArtist() {
        return albumArtist;
    }
    public void setAlbumArtist(String albumArtist) {
        this.albumArtist = albumArtist;
    }
    public String getAlbum() {
        return album;
    }
    public void setAlbum(String album) {
        this.album = album;
    }
    public int getYear() {
        return year;
    }
    public void setYear(int year) {
        this.year = year;
    }
    public String getComposer() {
        return composer;
    }
    public void setComposer(String composer) {
        this.composer = composer;
    }
    public String getLyricist() {
        return lyricist;
    }
    public void setLyricist(String lyricist) {
        this.lyricist = lyricist;
    }
    public int getTrackNumber() {
        return trackNumber;
    }
    public void setTrackNumber(int trackNumber) {
        this.trackNumber = trackNumber;
    }
    public int getTotaltracks() {
        return totaltracks;
    }
    public void setTotaltracks(int totaltracks) {
        this.totaltracks = totaltracks;
    }
    public String getLabel() {
        return label;
    }
    public void setLabel(String label) {
        this.label = label;
    }
    public String getGenre() {
        return genre;
    }
    public void setGenre(String genre) {
        this.genre = genre;
    }
    public long getTrackLength() {
        return trackLength;
    }
    public void setTrackLength(long trackLength) {
        this.trackLength = trackLength;
    }
    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    

    @Override
    public String toString() {
        return "History [historyId=" + historyId + ", songId=" + songId + ", songPath=" + songPath + ", title=" + title
                + ", artist=" + artist + ", albumArtist=" + albumArtist + ", album=" + album + ", year=" + year
                + ", composer=" + composer + ", lyricist=" + lyricist + ", trackNumber=" + trackNumber
                + ", totaltracks=" + totaltracks + ", label=" + label + ", genre=" + genre + ", trackLength="
                + trackLength + ", count=" + count + ", lastPlayedTime=" + lastPlayedTime + "]";
    }

    public LocalDateTime getLastPlayedTime() {
        return lastPlayedTime;
    }

    public void setLastPlayedTime(LocalDateTime lastPlayedTime) {
        this.lastPlayedTime = lastPlayedTime;
    }
    
}
