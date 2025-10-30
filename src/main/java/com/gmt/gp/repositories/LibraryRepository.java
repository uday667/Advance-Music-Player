package com.gmt.gp.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import com.gmt.gp.model.Library;

public interface LibraryRepository extends CrudRepository<Library, Long> {

    @Modifying
    @Query(value = "truncate table library", nativeQuery = true)
    void truncateMyTable();

    Library getBySongId(long songId);

    Library getBySongPath(String songPath);

    List<Library> getByAlbum(String album);

    List<Library> getByYear(int year);

    List<Library> getByGenreContainsIgnoreCase(String genre);

    @Query("select count(*) as count, lib.genre as genre from Library lib group by lib.genre order by count desc")
    List<String> getGenresGroupByGenre();

    @Query("select count(*) as count, lib.language as language from Library lib group by lib.language order by count desc")
    List<String> getLanguagesGroupByLanguage();

    @Query("select distinct l.album from Library l where l.genre like %:genre%")
    List<String> getAlbumListByGenre(String genre);

    @Query("select distinct l.album from Library l where l.language like %:language%")
    List<String> getAlbumListByLanguage(String language);

    List<Library> getByAlbumArtistOrderByYearAsc(String albumArtist);

    List<Library> findAllByOrderByTitleAsc();

    List<Library> findAllByOrderByAlbumAsc();

    @Query("SELECT l.artist AS ARTIST FROM Library AS l GROUP BY ARTIST")
    List<String> findAllByGroupByArtist();

    @Query("SELECT l.albumArtist AS ARTIST FROM Library AS l GROUP BY ARTIST")
    List<String> findAllByGroupByAlbumArtist();

    List<Library> getByArtistContains(String artist);

    List<Library> getByAlbumArtistOrderByAlbum(String albumArtist);

    List<Object> getByTitleContainsIgnoreCase(String searchKey);

    @Query("SELECT l.songId from Library as l order by l.title asc")
    List<Long> getAllLibraryIds();

    @Query("Select l from Library l where l.songId in (:songsId) order by l.title")
    List<Library> getSongsBySongIds(List<Long> songsId);

    @Query("select l from Library l where l.album=:album and l.language like %:language%")
    List<Library> getByAlbumAndLanguageQ(String album, String language);

    List<Library> getByTitleAndAlbum(String title, String album);

    @Query("select l from Library l where l.album=:album and l.title=:title")
    Library fetchByTitleAndAlbum(String title, String album);

    @Query("Select l from Library l where l.songPath in (:songPathList)")
    List<Library> getSongsBySongPath(List<String> songPathList);

    List<Library> getByLanguageContainsIgnoreCase(String language);

}
