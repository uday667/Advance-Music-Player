package com.gmt.gp.model;

import java.util.List;

public class GPResponse {
    private String status;
    private String error;
    private Library library;
    private GPMedia gMedia;
    private PlaylistItem playlistItem;
    private Message message;
    private List<PlaylistItem> playlistItems;
    private Object response;
    private String status1;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Library getLibrary() {
        return library;
    }

    public void setLibrary(Library library) {
        this.library = library;
    }

    public GPResponse(String status, String error, Library library) {
        this.status = status;
        this.error = error;
        this.library = library;
    }

    public GPResponse(Library library) {
        this.library = library;
    }

    public GPResponse() {
    }

    

    public GPResponse(Object response) {
        this.response = response;
    }

    @Override
    public String toString() {
        return "GPResponse [status=" + status + ", error=" + error + ", library=" + library + "]";
    }

    public GPMedia getgMedia() {
        return gMedia;
    }

    public void setgMedia(GPMedia gMedia) {
        this.gMedia = gMedia;
    }

    public PlaylistItem getPlaylist() {
        return playlistItem;
    }

    public PlaylistItem getPlaylistItem() {
        return playlistItem;
    }

    public void setPlaylistItem(PlaylistItem playlistItem) {
        this.playlistItem = playlistItem;
    }

    public Message getMessage() {
        return message;
    }

    public void setMessage(Message message) {
        this.message = message;
    }

    public Object getResponse() {
        return response;
    }

    public void setResponse(Object response) {
        this.response = response;
    }

    public String getStatus1() {
        return status1;
    }

    public void setStatus1(String status1) {
        this.status1 = status1;
    }

    public List<PlaylistItem> getPlaylistItems() {
        return playlistItems;
    }

    public void setPlaylistItems(List<PlaylistItem> playlistItems) {
        this.playlistItems = playlistItems;
    }

    public GPResponse(String status, String error) {
        this.status = status;
        this.error = error;
    }

}
