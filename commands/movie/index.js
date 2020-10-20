const express = require('express');
const app = module.exports = express();
const Client = require('node-torrent');
const client = new Client({logLevel: 'DEBUG'});
const exec = require('child_process').exec;
const path = require('path');

app.use('/movies', express.static(path.join(__dirname, 'movies')))

/**
 * This is the route to download a torrent link, it is specialized for movies as it automatically checks for subtitles and merges them with the movie if they exist, but this route can be used for any torrent link you want, as long as it starts with either HTTP(S): or magnet:
 * @name Torrent downloader
 * @route {POST} /movie/torrent
 * @bodyparam {string} torrentLink This is the variable where you add the link to the torrent you want to be downloaded.
 * @todo I need to see if it's possible to use a VPN or proxy here, both of those options change or hide the IP address of the computer, which would make it impossible to reach the API via the IP address.
 */
app.post('/movie/torrent', function(req, res) {
  var torrent = client.addTorrent(req.body.torrentLink);

  torrent.on('complete', function() {
    torrent.files.forEach(function(file) {
      var newPath = '/movies/' + file.path;
      fs.rename(file.path, newPath);
      file.path = newPath;
      if (file.mimetype.toString().includes("video/")) { const moviePath = file.path };
      if (file.path.toString().includes(".srt")) {
        const subtitlePath = file.path;
        exec("ffmpeg -i \"" + path.format(moviePath) + "\" -f srt -i \"" + path.format(subtitlePath) + "\" -c:v copy -c:a copy -c:s mov_text \"" + path.format(moviePath) + "\"", function(error, stdout, stderr) {
          console.log(error);
          console.log(stdout);
          console.log(stderr)
        })
      }
    });
  });
})
