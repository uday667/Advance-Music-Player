set JAVA_HOME=C:\Giri\softwares\jdk-19.0.2
set PATH=%JAVA_HOME%\bin;%PATH%

start java -cp hsqldb-2.7.0.jar org.hsqldb.Server -dbname.0 g_db -database.0 file:g_db

start java -Djdk.util.jar.enableMultiRelease=false -jar C:\Giri\dev\G-Player-SB\target\g-player-2.3.2.jar

#start chrome http://localhost:8085/#/music