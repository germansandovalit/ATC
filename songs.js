const fs = require("fs");
const path = require("path")

const lyricsPath = "lyrics"
const matchedSongsData = [];
let allSongsData = [];

const files = fs.readdirSync(lyricsPath);
const songs = files.map(file => path.parse(file).name.toLowerCase());

files.forEach(filename => {
    let isValid = true;
    const file = path.parse(filename);
    const song = {
        name: file.name.toLowerCase(),
        keys: [...new Set(file.name.toLowerCase().match(/\w+/g))],
        location: filename,
        references: [],
        mashedReferences: [],
        looselyReferences: [],
    }
    const songsButTheActual = songs.filter(s => s !== song.name);
    const lyrics = fs.readFileSync(`${lyricsPath}/${song.location}`, {encoding:'utf8', flag:'r'})
    const mashedLyrics = lyrics.split(' ').join('');
    song.references = songsButTheActual.map(song => lyrics.includes(song) ? song : '').filter(Boolean)
    song.mashedReferences = songsButTheActual.map(song => mashedLyrics.includes(song) ? song : '').filter(Boolean)
    if (song.mashedReferences.length === 0 && song.references.length === 0) {
        isValid = false;
    }
    if (song.mashedReferences.toString() === song.references.toString()) song.mashedReferences = [];

    if (isValid) matchedSongsData.push(song);
    allSongsData.push(song);
})

allSongsData = allSongsData.map(({name, keys, location, all = false}) => ({name, keys, location, all}));
fs.writeFileSync("allSongs.json", JSON.stringify(allSongsData))

fs.writeFileSync("matchedSongs.json", JSON.stringify(matchedSongsData));

