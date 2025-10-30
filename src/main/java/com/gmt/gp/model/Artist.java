package com.gmt.gp.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long artistId;
    private String artistName;
    private String type;
    private boolean isImgAvl;
    private String imageSource;
    private int count;

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public boolean isImgAvl() {
        return isImgAvl;
    }

    public void setImgAvl(boolean isImgAvl) {
        this.isImgAvl = isImgAvl;
    }

    public Artist() {
    }

    public Artist(String type) {
        this.type = type;
    }

    public long getArtistId() {
        return artistId;
    }

    public void setArtistId(long artistId) {
        this.artistId = artistId;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getImageSource() {
        return imageSource;
    }

    public void setImageSource(String imageSource) {
        this.imageSource = imageSource;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "Artist [artistId=" + artistId + ", artistName=" + artistName + ", type=" + type + ", isImgAvl="
                + isImgAvl + ", imageSource=" + imageSource + ", count=" + count + "]";
    }
}
