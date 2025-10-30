# G-Player-SB

A feature-rich, metadata-based music player built using Java, Spring Boot, and JavaScript. G-Player-SB provides flexible playlist management, custom metadata tagging, and seamless organization of your music library.

## Features

- 🎵 **Flexible Playlist Management** – Easily create, add, and manage playlists with backup support.
- 🏷️ **Advanced Metadata Handling** – Reads metadata from all music files in a user-specified directory and indexes it into a database.
- 🎤 **Singer-Based Tagging** – Allows tagging songs based on individual singers.
- 🔍 **Multi-Category Organization** – Separate tabs for Artists, Music Composers, Albums, Genres, and Languages.
- 💾 **Metadata Storage in HSQLDB** – All metadata is indexed in a table, including file storage locations.
- 🗂 **Duplicate Management** – Supports duplicates when songs are sung by different artists or are in different languages.

## Technologies Used

- **Backend:** Java, Spring Boot, HSQLDB
- **Frontend:** JavaScript, React.js, SCSS
- **Metadata Extraction:** jaudiotagger

## Installation

### Release Version

To start using G-Player-SB, download the latest release files:

- **G-Player-App_V2.4.20.zip**: [Download](https://drive.google.com/file/d/1HRzyi94zdmZbkysVvDrHUl64YJyomXvL/view?usp=drive_link)
- **g-player-2.4.20.jar**: [Download](https://drive.google.com/file/d/17cL24BYisZidY8B-spaSRv4tZr3KSCs-/view?usp=drive_link)
- **G Player.cmd**: [Download](https://drive.google.com/file/d/1UZpcyS2neJ_1SUKbbsa7x-oGUSifzbEe/view?usp=drive_link)

### How to Start

1. **Extract the ZIP file** (if you downloaded `G-Player-App_V2.4.20.zip`).
2. **Run the application**:
   - If using the `.jar` file, open a terminal or command prompt and run:
     ```sh
     java -jar g-player-2.4.20.jar
     ```
   - Alternatively, you can use `G Player.cmd` to start the application with a double-click.
3. **Access the Player** – Once running, the player interface should open.

## Usage

- **Add Music:** Select a directory containing MP3 files. The player will read and index metadata automatically.
- **Manage Playlists:** Create custom playlists and back them up.
- **Search & Filter:** Browse music based on artists, albums, genres, and more.

## Future Enhancements

- **Sync Playlists to Remote DB** – Implement functionality to synchronize playlists with a remote database to ensure accessibility across multiple devices. [Issue #161](https://github.com/mgireesha/G-Player-SB/issues/161)
- **Switch to MUI** – Transition the user interface components to Material-UI (MUI) for a more consistent and modern design. [Issue #152](https://github.com/mgireesha/G-Player-SB/issues/152)
- **Add Sorting on Languages Page** – Introduce sorting capabilities on the Languages page to enhance user navigation and experience. [Issue #150](https://github.com/mgireesha/G-Player-SB/issues/150)
## Contributing

Contributions are welcome! Feel free to fork the repo, create a branch, and submit a pull request.


---

Enjoy your music with **G-Player-SB**! 🎧

