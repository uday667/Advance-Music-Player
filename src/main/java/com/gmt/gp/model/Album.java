package com.gmt.gp.model;

import java.sql.Blob;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Transient;

@Entity
public class Album {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long albumId;
    private String albumName;
    @Lob
    private Blob albumImgPath;
    private String albumArtist;
    private String composer;
    private int year;
    private int totaltracks;
    private String genre;
    private String language;
    private boolean isAlbumImgAvl;
    private String languageType;
    private String languages;

    @Transient
    private List<Object> albumTracks;

    @Transient
    private String albumArt;

    public Album() {
    }

    public Album(String albumName) {
        this.albumName = albumName;
    }

    public String getLanguages() {
        return languages;
    }

    public void setLanguages(String languages) {
        this.languages = languages;
    }

    public long getAlbumId() {
        return albumId;
    }

    public void setAlbumId(long albumId) {
        this.albumId = albumId;
    }

    public String getAlbumName() {
        return albumName;
    }

    public void setAlbumName(String albumName) {
        this.albumName = albumName;
    }

    public Blob getAlbumImgPath() {
        return albumImgPath;
    }

    public void setAlbumImgPath(Blob albumImgPath) {
        this.albumImgPath = albumImgPath;
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

    public int getTotaltracks() {
        return totaltracks;
    }

    public void setTotaltracks(int totaltracks) {
        this.totaltracks = totaltracks;
    }

    public String getGenre() {
        return genre;
    }

    public void setGenre(String genre) {
        this.genre = genre;
    }

    public boolean isAlbumImgAvl() {
        return isAlbumImgAvl;
    }

    public void setAlbumImgAvl(boolean isAlbumImgAvl) {
        this.isAlbumImgAvl = isAlbumImgAvl;
    }

    public String getLanguageType() {
        return languageType;
    }

    public void setLanguageType(String languageType) {
        this.languageType = languageType;
    }

    @Override
    public String toString() {
        return "Album [albumId=" + albumId + ", albumName=" + albumName + ", albumImgPath=" + albumImgPath
                + ", albumArtist=" + albumArtist + ", composer=" + composer + ", year=" + year + ", totaltracks="
                + totaltracks + ", genre=" + genre + ", language=" + language + ", isAlbumImgAvl=" + isAlbumImgAvl
                + ", languageType=" + languageType + ", languages=" + languages + "]";
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public List<Object> getAlbumTracks() {
        return albumTracks;
    }

    public void setAlbumTracks(List<Object> albumTracks) {
        this.albumTracks = albumTracks;
    }

    public String getAlbumArt() {
        return albumArt;
    }

    public void setAlbumArt(String albumArt) {
        this.albumArt = albumArt;
    }

    public static Album copy(Album e, Library n) {
        if (e == null) {
            e = new Album();
        }
        if (n.getAlbumArtist() != null) {
            e.setAlbumArtist(n.getAlbumArtist());
        }
        if (n.getAlbum() != null) {
            e.setAlbumName(n.getAlbum());
        }
        if (n.getComposer() != null) {
            e.setComposer(n.getComposer());
        }
        if (n.getGenre() != null) {
            e.setGenre(n.getGenre());
        }
        if (n.getLanguage() != null) {
            e.setLanguage(n.getLanguage());
        }
        if (n.getTotaltracks() != 0) {
            e.setTotaltracks(n.getTotaltracks());
        }
        if (n.getYear() != 0) {
            e.setYear(n.getYear());
        }
        return e;
    }

}
