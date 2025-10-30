package com.gmt.gp.util;

public class GP_CONSTANTS {

    public static final String ALBUM = "ALBUM";
    public static final String ALBUM_ARTIST_COUNT = "ALBUM_ARTIST_COUNT";
    public static final String ALBUM_ARTIST = "ALBUM_ARTIST";
    public static final String ALBUM_ARTISTS = "ALBUM_ARTISTS";
    public static final String ALBUM_COUNT = "ALBUM_COUNT";
    public static final String ALBUMS = "ALBUMS";
    public static final String ARTIST = "ARTIST";
    public static final String ARTIST_IMG_DOWNLOAD_STATUS = "ARTIST_IMG_DOWNLOAD_STATUS";
    public static final String ARTISTS = "ARTISTS";
    public static final String ARTIST_COUNT = "ARTIST_COUNT";

    public static final String BUILD_COMPLETED_TIME = "BUILD_COMPLETED_TIME";
    public static final String BUILD_STATUS = "BUILD_STATUS";
    public static final String BUILD_STATUS_STEP = "BUILD_STATUS_STEP";

    public static final String COMPLETED = "COMPLETED";
    public static final String COMPLETED_WITH_ERROR = "COMPLETED_WITH_ERROR";
    public static final String COMPLETED_WITH_ERRORS = "COMPLETED_WITH_ERRORS";

    public static final String DOWNLOAD_FAILED = "DOWNLOAD_FAILED";
    public static final String DOWNLOAD_SUCCESS = "DOWNLOAD_SUCCESS";

    public static final String ERROR = "ERROR";
    public static final String EXCEPTION = "EXCEPTION";

    public static final String FAILED = "FAILED";
    public static final String FILENAME = "FILENAME";
    public static final String FILEPATH = "FILEPATH";
    public static final String FILES_READ_TIME = "FILES_READ_TIME";
    public static final String FILES_TO_READ = "FILES_TO_READ";
    public static final String FILETYPE_CSV = ".csv";
    public static final String FILETYPE_GP = ".gp";

    public static final String GENRE = "GENRE";
    public static final String GENRE_ALBUMS = "GENRE_ALBUMS";
    public static final String GENRE_COUNT = "GENRE_COUNT";
    public static final String GENRE_SONG_COUNT = "GENRE_SONG_COUNT";
    public static final String GENRE_TYPE = "GENRE_TYPE";
    public static final String GENRES = "GENRES";
    public static final String GP_PATH = "GP_PATH";

    public static final String LANGUAGE = "LANGUAGE";
    public static final String LANGUAGE_ALBUMS = "LANGUAGE_ALBUMS";
    public static final String LANGUAGE_COUNT = "LANGUAGE_COUNT";
    public static final String LANGUAGE_SONG_COUNT = "LANGUAGE_SONG_COUNT";
    public static final String LANGUAGE_TYPE = "LANGUAGE_TYPE";
    public static final String LANGUAGES = "LANGUAGES";
    public static final String LAST_PLAYED_SONG_ID = "LAST_PLAYED_SONG_ID";
    public static final String LIBRARY = "LIBRARY";

    public static final String MEDIA_PLAYER_NULL = "MEDIA_PLAYER_NULL";
    public static final String METHOD_NAME = "METHOD_NAME";
    public static final String MUSIC_FILE_METADATA_FIELD = "MUSIC_FILE_METADATA_FIELD";
    public static final String MUSIC_FILE_METADATA_VALUE = "MUSIC_FILE_METADATA_VALUE";
    public static final String MULTI_GENRE = "MULTI_GENRE";
    public static final String MULTI_LINGUAL = "MULTI_LINGUAL";
    public static final String MONO_LINGUAL = "MONO_LINGUAL";

    public static final String NOT_FOUND = "NOT_FOUND";

    public static final String PLAYLIST = "PLAYLIST";
    public static final String PLAYLIST_ALBUMS = "PLAYLIST_ALBUMS";
    public static final String PLAYLIST_NAMES = "PLAYLIST_NAMES";
    public static final String PLAYLIST_SONGS_COUNT = "PLAYLIST_SONGS_COUNT";

    public static final String RESPONSE_ALBUM = "RESPONSE_ALBUM";
    public static final String RUNNING = "RUNNING";

    public static final String SINGLE_GENRE = "SINGLE_GENRE";
    public static final String SONG = "SONG";
    public static final String STATUS = "STATUS";
    public static final String SUCCESS = "SUCCESS";

    public static final String THIS_MONTH_COUNT = "THIS_MONTH_COUNT";
    public static final String TRACK = "TRACK";
    public static final String TRACK_LIST = "TRACK_LIST";
    public static final String TOTAL_TRACKS = "TOTAL_TRACKS";

    public static final String UNKNOWN_ALBUM_LABEL = "Unknown album";
    public static final String UNKNOWN_LABEL = "Unknown";
    public static final String UNKNOWN_ERROR_TEXT = "An unknown error occured";
    public static final String USER_PATH = "USER_PATH";

    // Contant values
    public static final int GROUPED_ALBUM_COUNT_4 = 4;

    // URLs
    public static final String WIKI_SUMMARY_URI = "https://en.wikipedia.org/api/rest_v1/page/summary/";

    // GP Image Paths
    public static final String GP_USER_PATH = System.getProperty("user.home");

    public static final String GP_IMAGES_PATH = GP_USER_PATH + "\\G_Player\\images\\";

    public static final String GP_ALBUM_IMAGES_PATH = GP_USER_PATH + "\\G_Player\\images\\albums\\";

    public static final String GP_ARTIST_IMAGES_PATH = GP_USER_PATH + "\\G_Player\\images\\artists\\";

    public static final String GP_UASER_ARTIST_IMAGES_PATH = GP_USER_PATH
            + "\\G_Player\\images\\artists\\user_images\\";

    public static final String GP_LOGS_PATH = GP_USER_PATH + "\\G_Player\\logs\\";

    public static final String GP_PLAYLIST_PATH = GP_USER_PATH + "\\G_Player\\playlists\\";

    public static final String GP_PLAYLIST_PATH_CSV = GP_USER_PATH + "\\G_Player\\playlists\\csv\\";

    public static final String GP_PLAYLIST_PATH_GP = GP_USER_PATH + "\\G_Player\\playlists\\gp\\";

    public static final String GP_PLAYLIST_PATH_M3U = GP_USER_PATH + "\\G_Player\\playlists\\m3u\\";

    public static final String GP_TEMP_SONG_PATH = GP_USER_PATH + "\\G_Player\\temp_file\\";

    // const arrays

    public static final String[] GP_FILE_TYPE_ARR = new String[] { ".mp3", ".m4a" };

    // databes db alias
    // public static final String GP_DB_ALIAS = "g_player";
    public static final String GP_DB_ALIAS = "g_db";

}
