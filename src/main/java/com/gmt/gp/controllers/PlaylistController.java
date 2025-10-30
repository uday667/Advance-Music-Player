package com.gmt.gp.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.gmt.gp.model.GPResponse;
import com.gmt.gp.model.Library;
import com.gmt.gp.model.Message;
import com.gmt.gp.model.Playlist;
import com.gmt.gp.model.PlaylistItem;
import com.gmt.gp.services.MessageService;
import com.gmt.gp.services.PlaylistService;

@RestController
@RequestMapping("/playlist")
public class PlaylistController {

    @Autowired
    private PlaylistService playlistService;

    @Autowired
    private MessageService messageService;

    @Deprecated
    @RequestMapping("/names/{messageType}")
    public Map<String, Object> getPlaylistNames(@PathVariable String messageType) {
        return playlistService.getPlaylistNames(messageType);
    }

    @RequestMapping("/")
    public Map<String, Object> getPlaylists() {
        return playlistService.getPlaylists();
    }

    @Deprecated
    @RequestMapping("/create-playlist")
    public Message createPlalist(@RequestBody Message message) {
        return messageService.saveMaMessage(message);
    }

    @RequestMapping("/{name}")
    public GPResponse createPlalist(@PathVariable String name) {
        return playlistService.createPlalist(name);
    }

    @Deprecated
    @PutMapping("/rename-playlist")
    public GPResponse renamePlaylist(@RequestBody Message reqMessage) {
        return playlistService.renamePlaylist(reqMessage);
    }

    @PutMapping("/")
    public GPResponse renamePlaylist(@RequestBody Playlist playlist) {
        return playlistService.renamePlaylist(playlist);
    }

    @DeleteMapping("/{playlistId}")
    public GPResponse deletePlaylist(@PathVariable String playlistId) {
        return playlistService.deletePlaylist(Long.parseLong(playlistId));
    }

    @RequestMapping("/{playlistId}/songs")
    public List<Library> getSongsInPlaylist(@PathVariable String playlistId) {
        return playlistService.getSongsInPlaylist(Long.parseLong(playlistId));
    }

    @RequestMapping("/add-to-playlist/")
    public GPResponse addToPlaList(@RequestBody PlaylistItem reqPlaylist) {
        return playlistService.addToPlaList(reqPlaylist);
    }

    @DeleteMapping("/remove-from-playlist/{playlistId}/{songId}")
    public GPResponse removeFromPlaylist(@PathVariable String playlistId, @PathVariable String songId) {
        return playlistService.removeFromPlaylist(Long.parseLong(playlistId), Long.parseLong(songId));
    }

    @RequestMapping("/export")
    public GPResponse exportPlaylists() {
        return playlistService.exportPlaylists();
    }

    @PostMapping("/import/{fileType}")
    public GPResponse importPlaylists(@RequestBody String payload, @PathVariable String fileType) {
        return playlistService.importPlaylists(payload, fileType);
    }

    @Deprecated
    @GetMapping("/move-playlist-names")
    public GPResponse movePlaylistsFromMesaagesToPlaylistTable(){
        return playlistService.movePlaylistNames();
    }

    @GetMapping("/playlists/{type}/identifier/{identifier}")
    public List<String> getAssignedPlaylists(@PathVariable String type, @PathVariable String identifier){
        return playlistService.getAssignedPlaylists(type, identifier);
    }

}
