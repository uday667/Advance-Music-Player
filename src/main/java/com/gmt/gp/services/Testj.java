package com.gmt.gp.services;

import java.time.LocalDate;

import com.gmt.gp.util.GPUtil;
import com.gmt.gp.util.SQL_QUERIES;

public class Testj {
    public static void main(String[] args) {
        try {
            // Testj.print_SQL_QUERIES();
            // Testj.testSelectDateRange();
            // Testj.testCopy();
            Testj.trimSpace();
        } catch (Exception e) {
            e.printStackTrace();
        }

        HistoryService historyService = new HistoryService();
        System.out.println("historyService.executeJDBCQuerySingleRow(SQL_QUERIES.getHisLibCountJDBCQuery());: "
                + historyService.executeJDBCQuerySingleRow(SQL_QUERIES.getHisLibCountJDBCQuery()));

    }

    public static void print_SQL_QUERIES() {
        LocalDate today = LocalDate.now();
        LocalDate lastMonth = today.minusMonths(1);

        System.out.println("getAlbumsGroupedFromHistoryJDBCQuery , 10 rows, order by count");
        System.out.println(SQL_QUERIES.getAlbumsGroupedFromHistoryJDBCQuery(10, "count"));
        System.out.println("-----------------------------------------------------------------------------------");
        System.out.println("getTopArtistsFromHistoryJDBCQuery");
        System.out.println(SQL_QUERIES.getTopArtistsFromHistoryJDBCQuery());
        System.out.println("-----------------------------------------------------------------------------------");
        System.out.println("getTopAlbumArtistFromHistoryJDBCQuery");
        System.out.println(SQL_QUERIES.getTopAlbumArtistFromHistoryJDBCQuery());
        System.out.println("-----------------------------------------------------------------------------------");
        System.out.println("getHisLibCountJDBCQuery");
        System.out.println(SQL_QUERIES.getHisLibCountJDBCQuery());
        System.out.println("-----------------------------------------------------------------------------------");
        System.out.println("getTotalTimePlayed");
        System.out.println(SQL_QUERIES.getTotalTimePlayed(lastMonth));
        System.out.println("-----------------------------------------------------------------------------------");
    }

    public static void testSelectDateRange() {
        LocalDate now = LocalDate.now(); // 2015-11-24
        LocalDate earlier = now.minusMonths(1); // 2015-10-24
        String Query = "select count(*) as sfdf from (Select * from history where last_played_time between (" + now
                + ") and (" + earlier + "))";
        System.out.println("testSelectDateRange: " + Query);
    }

    public static void testCopy() {
        try {
            long startingTime = System.currentTimeMillis();
            GPUtil.copyFile("C:\\Giri\\Music_AAA_Updated\\Kannada\\Dr. Rajkumar\\Jeevana Chaitra (1992)\\Nadamaya.mp3",
                    "C:\\Users\\mgire\\G_Player\\temp_file\\Nadamaya.mp3", null);
            long endingTime = System.currentTimeMillis();
            System.out.println("Time took: " + (endingTime - startingTime) + " ms");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void trimSpace() {
        String test = "aaaaaaaaa/ bbbbbbb/ cccccc";
        String[] testArr = test.split("\\s*/\\s*");
        for (String test1 : testArr) {
            System.out.println(test1);
        }

    }
}
