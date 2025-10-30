package com.gmt.gp.util;

import java.time.LocalDate;

public class SQL_QUERIES {

    public static String getAlbumsGroupedFromHistoryJDBCQuery(int rowCount, String orderBy) {
        String query = "select "
                + "his.album, his.count, his.last_played_time, alb.album_artist, alb.year, alb.genre,alb.language, alb.is_album_img_avl,alb.album_id,alb.language_type,alb.languages "
                + "from "
                + "(select album, sum(count) as count, max(last_played_time) as last_played_time from history group by album) his "
                + "inner join "
                + "(select album_name, album_artist,year,genre,language,is_album_img_avl,album_id,language_type,languages from album group by album, album_artist,year, genre,language,is_album_img_avl,album_id, language_type,languages) alb "
                + "on "
                + "alb.album_name=his.album "
                + "order by "
                + "his." + orderBy + " desc ";
        if (rowCount != 0) {
            query += "fetch first " + rowCount + " rows only;";
        }
        if (!query.contains(";")) {
            query += ";";
        }
        return query;
    }

    public static String getTopArtistsFromHistoryJDBCQuery() {
        return """
                select \
                artist, max(count) as count from (select \
                his.artist, his.count, his.last_played_time, art.artist_name \
                from \
                (select artist, sum(count) as count, max(last_played_time) as last_played_time from history group by artist) his \
                inner join \
                (select artist_name,is_img_avl from artist where type='ARTIST' ) art \
                on \
                his.artist like CONCAT('%', art.artist_name, '%')) \
                group by artist \
                order by count desc \
                """
        // + "fetch first 5 rows only;"
        ;
    }

    public static String getTopAlbumArtistFromHistoryJDBCQuery() {
        return """
                select \
                his.album_artist, his.count \
                from \
                (select album_artist, sum(count) as count, max(last_played_time) as last_played_time from history group by album_artist) his \
                inner join \
                (select artist_name,is_img_avl from artist where type='ALBUM_ARTIST' ) art \
                on \
                his.album_artist = art.artist_name \
                order by count desc \
                fetch first 5 rows only;\
                """;
    }

    public static String getGenreCountJDBCQuery() {
        return """
                select \
                count(*) \
                as GENRE_COUNT \
                from \
                (select genre from library group by genre);\
                """;
    }

    public static String getHisLibCountJDBCQuery() {
        return """
                select \
                his.count as HISTORY_COUNT, lib.count as LIBRARY_COUNT \
                from \
                (select count(*) as count from history) his, \
                (select count(*) as count from library) lib;\
                """;
    }

    public static String getThismonthPlayedCountJDBCQuery(LocalDate timeStamp) {
        return "select "
                + "count(*) as " + GP_CONSTANTS.THIS_MONTH_COUNT + " "
                + "from "
                + "(Select * from history where last_played_time >= '" + timeStamp + "');";
    }

    public static String getTotalTimePlayed(LocalDate timeStamp) {
        return "select "
                + "total.tsum as TOTAL_TIME_PLAYED, tptm.tsum as TIME_PLAYED_THIS_MONTH "
                + "from "
                + "(select SUM(TRACK_LENGTH) as tsum from history) total, "
                + "(select SUM(TRACK_LENGTH) as tsum from history where last_played_time >= '" + timeStamp + "') tptm;";
    }
}
