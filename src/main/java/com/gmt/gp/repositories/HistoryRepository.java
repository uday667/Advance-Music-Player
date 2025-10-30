package com.gmt.gp.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.gmt.gp.model.History;

public interface HistoryRepository extends CrudRepository<History, Long>{

    History getBySongId(long songId);

    List<History> findAllByOrderByLastPlayedTimeDesc();

    List<History> findTop30ByOrderByLastPlayedTimeDesc();
    
    @Query("Select h.songId, h.count from History h order by count desc")
    List<Object[]> getSongIdAndCoundOrderByCountDesc();
}
