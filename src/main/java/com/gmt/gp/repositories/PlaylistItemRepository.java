package com.gmt.gp.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.gmt.gp.model.PlaylistItem;

public interface PlaylistItemRepository extends CrudRepository<PlaylistItem, Long> {

    List<PlaylistItem> getByPlaylist(String playlist);

    @Query("SELECT p.songId FROM PlaylistItem p where p.playlistId =:playlistId")
    List<Long> getSongIdsInPlaylist(long playlistId);

    @Query("SELECT distinct p.albumName FROM PlaylistItem p where p.playlistId =:playlistId")
    List<String> getAlbumNamesByPlaylistId(long playlistId);

    List<PlaylistItem> getByPlaylistId(long playlistId);

    List<PlaylistItem> getByPlaylistIdAndSongId(long playlistId, long songId);

    PlaylistItem getByPlaylistIdAndSongPath(long playlistId, String songPath);

    @Query("SELECT p.playlist FROM PlaylistItem p where p.songId =:songId")
    List<String> getPlaylistsBySongId(long songId);

    @Query("SELECT p.playlist FROM PlaylistItem p where p.albumName =:albumName")
    List<String> getPlaylistsByAlbumName(String albumName);
}
