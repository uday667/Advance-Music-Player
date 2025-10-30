package com.gmt.gp.model;

import java.util.LinkedHashMap;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Transient;

@Entity
public class Library {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long songId;
    private String songPath;
    private String title;
    private String album;
    private String artist;
    private String albumArtist;
    private String composer;
    private int year;
    private String genre;
    private String lyricist;
    private boolean isLyricsAvl;
    @Column(columnDefinition = "VARCHAR(10000)")
    private String lyrics;
    private int trackNumber;
    private int totaltracks;
    private String label;
    private long trackLength;
    @Transient
    private String albumArt;
    private String bpm;
    private String groupingGP;// grouping is reserved key in hsqldb and cannot be used as column, hence added
                              // GP suffix
    private String language;

    @Transient
    private long playlistItemId;

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

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
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

    public String getComposer() {
        return composer;
    }

    public void setComposer(String composer) {
        this.composer = composer;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public String getLyricist() {
        return lyricist;
    }

    public void setLyricist(String lyricist) {
        this.lyricist = lyricist;
    }

    public String getLyrics() {
        return lyrics;
    }

    public void setLyrics(String lyrics) {
        this.lyrics = lyrics;
    }

    public boolean isLyricsAvl() {
        return isLyricsAvl;
    }

    public void setLyricsAvl(boolean isLyricsAvl) {
        this.isLyricsAvl = isLyricsAvl;
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

    public long getTrackLength() {
        return trackLength;
    }

    public void setTrackLength(long trackLength) {
        this.trackLength = trackLength;
    }

    public String getAlbumArt() {
        return albumArt;
    }

    public void setAlbumArt(String albumArt) {
        this.albumArt = albumArt;
    }

    public long getPlaylistItemId() {
        return playlistItemId;
    }

    public void setPlaylistItemId(long playlistItemId) {
        this.playlistItemId = playlistItemId;
    }

    public String getBpm() {
        return bpm;
    }

    public void setBpm(String bpm) {
        this.bpm = bpm;
    }

    public String getGroupingGP() {
        return groupingGP;
    }

    public void setGroupingGP(String groupingGP) {
        this.groupingGP = groupingGP;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Library() {

    }

    public Library(long songId, String songPath, String title, String album, String artist, String albumArtist,
            String composer, int year, String genre, String lyricist, boolean isLyricsAvl, String lyrics,
            int trackNumber, int totaltracks, String label, long trackLength, String albumArt, String bpm,
            String groupingGP, String language, long playlistItemId) {
        this.songId = songId;
        this.songPath = songPath;
        this.title = title;
        this.album = album;
        this.artist = artist;
        this.albumArtist = albumArtist;
        this.composer = composer;
        this.year = year;
        this.genre = genre;
        this.lyricist = lyricist;
        this.isLyricsAvl = isLyricsAvl;
        this.lyrics = lyrics;
        this.trackNumber = trackNumber;
        this.totaltracks = totaltracks;
        this.label = label;
        this.trackLength = trackLength;
        this.albumArt = albumArt;
        this.bpm = bpm;
        this.groupingGP = groupingGP;
        this.language = language;
        this.playlistItemId = playlistItemId;
    }

    public Library copy() {
        return new Library(songId, songPath, title, album, artist, albumArtist, composer, year, genre, lyricist,
                isLyricsAvl, lyrics, trackNumber, totaltracks, label, trackLength, albumArt, bpm, groupingGP, language,
                playlistItemId);
    }

    public static Library copy(Library e, Library n) {
        if (n.getAlbum() != null) {
            e.setAlbum(n.getAlbum());
        }
        if (n.getAlbumArtist() != null) {
            e.setAlbumArtist(n.getAlbumArtist());
        }
        if (n.getArtist() != null) {
            e.setArtist(n.getArtist());
        }
        if (n.getBpm() != null) {
            e.setBpm(n.getBpm());
        }
        if (n.getComposer() != null) {
            e.setComposer(n.getComposer());
        }
        if (n.getGenre() != null) {
            e.setGenre(n.getGenre());
        }
        if (n.getGroupingGP() != null) {
            e.setGroupingGP(n.getGroupingGP());
        }
        if (n.getLabel() != null) {
            e.setLabel(n.getLabel());
        }
        if (n.getLanguage() != null) {
            e.setLanguage(n.getLanguage());
        }
        if (n.getLyricist() != null) {
            e.setLyricist(n.getLyricist());
        }
        if (n.getSongPath() != null) {
            e.setSongPath(n.getSongPath());
        }
        if (n.getTitle() != null) {
            e.setTitle(n.getTitle());
        }
        if (n.getTotaltracks() != 0) {
            e.setTotaltracks(n.getTotaltracks());
        }
        if (n.getTrackLength() != 0) {
            e.setTrackLength(n.getTrackLength());
        }
        if (n.getTrackNumber() != 0) {
            e.setTrackNumber(n.getTrackNumber());
        }
        if (n.getYear() != 0) {
            e.setYear(n.getYear());
        }
        return e;
    }

    @Override
    public String toString() {
        return "Library [songId=" + songId + ", songPath=" + songPath + ", title=" + title + ", album=" + album
                + ", artist=" + artist + ", albumArtist=" + albumArtist + ", composer=" + composer + ", year=" + year
                + ", genre=" + genre + ", lyricist=" + lyricist + ", isLyricsAvl=" + isLyricsAvl + ", lyrics=" + lyrics
                + ", trackNumber=" + trackNumber + ", totaltracks=" + totaltracks + ", label=" + label
                + ", trackLength=" + trackLength + ", albumArt=" + albumArt + ", bpm=" + bpm + ", groupingGP="
                + groupingGP
                + ", language=" + language + ", playlistItemId=" + playlistItemId + "]";
    }

    @SuppressWarnings({ "rawtypes" })
    public Library(LinkedHashMap track) {
        this.songId = (Integer) track.get("songId");
        // this.songPath = songPath;
        this.title = (String) track.get("title");
        this.album = (String) track.get("album");
        this.artist = (String) track.get("artist");
        this.albumArtist = (String) track.get("albumArtist");
        this.composer = (String) track.get("composer");
        if (track.get("year") != null) {
            this.year = (Integer) track.get("year");
        }
        this.genre = (String) track.get("genre");
        this.lyricist = (String) track.get("lyricist");
        // this.isLyricsAvl = isLyricsAvl;
        // this.lyrics = lyrics;
        if (track.get("trackNumber") != null) {
            this.trackNumber = Integer.parseInt((String) track.get("trackNumber"));
        }
        if (track.get("totaltracks") != null) {
            this.totaltracks = (Integer) track.get("totaltracks");
        }
        this.label = (String) track.get("label");
        // this.bpm = bpm;
        // this.groupingGP = groupingGP;
        this.language = (String) track.get("language");
    }

}
