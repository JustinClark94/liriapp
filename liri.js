require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var searchTerm = process.argv[2];
//used switch statements to take in the searchTerm to decide which block of code to run
switch(searchTerm) {
    case "concert-this":
        var artist = process.argv.slice(3).join(" ");
        var concertUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(concertUrl).then(function (response, err) {
        console.log("Venue Name: " + response.data[0].venue.name);
        console.log("City: " + response.data[0].venue.city);
        console.log("Time: " + response.data[0].datetime);
        
        //moment will not work even when it is installed.
        //console.log("Time: " + moment(response.data[0].datetime).format("MM/DD/YYYY"));
        if (err) {
            console.log("Error: " + err)
        }
        })
      break;
    case "spotify-this-song":
        var query = process.argv.slice(3).join(" ");
        //Need to figure out how to make the sign a default search.
        if (query === " ") {
            console.log("searching for The Sign")
        }
        spotify.search({
            type: "track",
            query: query
        }, function (err, data) {
            if (err) {
            return console.log("Error:" + err);
            }
            console.log("Artist(s): " + data.tracks.items[0].album.artists[0].name);
            console.log("Song Title: " + data.tracks.items[0].name);
            console.log("Album Name: " + data.tracks.items[0].album.name);
            console.log("Listen on Spotify: " + data.tracks.items[0].external_urls.spotify);
        });
      break;
    case "movie-this":
    //api search
    var movieQuery = process.argv.slice(3);
    if (!process.argv[3]) {
      movieQuery = "Mr. Nobody";
    }
    var movieUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&apikey=trilogy";
    axios.get(movieUrl).then(function (response, err) {
      console.log("Title: " + response.data.Title);
      console.log("Year Released: " + response.data.Year);
      console.log("IMDB Rating: " + response.data.imdbRating);
      console.log("Rotten Tomatoes Rating: " + response.data.Ratings[0].Value);
      console.log("Movie Was Produced In: " + response.data.Country);
      console.log("Language(s): " + response.data.Language);
      console.log("Plot: " + response.data.Plot);
      console.log("Cast: " + response.data.Actors);

      if (err) {
        console.log("Error: " + err)
      }
    })
      
      break;
    case "do-what-it-says":
    fs.readFile("random.txt", 'utf8', function (error, data) {
      if (error) {
        console.log("Error: " + error);
        return;
      };
      var ranString = data.split(',');
      var ranQuery = ranString[1];

      spotify.search({
        type: "track",
        query: ranQuery,
      }, function (err, data) {
        if (err) {
          return console.log("Error:" + err);
        }

        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Appears on: " + data.tracks.items[0].album.name);
        console.log("Listen on Spotify: " + data.tracks.items[0].preview_url);

      });
    });


      break;
    default:
    console.log("Please choose from concert-this, spotify-this-song, movie-this or do-what-it-says");
  }