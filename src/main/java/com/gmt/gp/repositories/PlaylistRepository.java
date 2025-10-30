package com.gmt.gp.repositories;

import org.springframework.data.repository.CrudRepository;

import com.gmt.gp.model.Playlist;

public interface PlaylistRepository extends CrudRepository<Playlist, Long>{
    Playlist getByName(String name);
}
