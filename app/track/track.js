//import spotify api config variables and request.
var spotifyAPI = require('../../config/spotify_api.js');
var request = require('request');

(function(){

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

  function getRandomInt(max) {
    return Math.abs(Math.floor((Math.random() * max)));
  }

  var client_id = spotifyAPI.client_id;
  var client_secret = spotifyAPI.client_secret;
  var redirect_uri = spotifyAPI.redirect_uri;

  var Track = function(opts){
    this.track = opts.track;
    this.artist = opts.artist;
    this.image = opts.image;
    this.album = opts.album;
    this.time = opts.time;
    this.artistHref = opts.artistHref;
    this.isExplicit = opts.isExplicit;
  }

  var tracks = [];
  var fetchResponse = [];

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };



//the callback is our server app res.send wrapped in a function
var genreFetch = function(genre, callback){
  tracks.length = 0;
  fetchResponse.length = 0;
  console.log('inside of track fetch');
  request.post(authOptions, function(error, response, json) {
    if (!error && response.statusCode === 200) {
      var token = json.access_token;
      var genreOptions = {
        url: 'https://api.spotify.com/v1/search?q=genre:' + genre + '&type=track&limit=50',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
        request.get(genreOptions, function(error, response, json) {
          for (i = 0 ; i < json.tracks.items.length; i ++){
            if (json.tracks.items[i].popularity > 50){
              var opts = {
                track: json.tracks.items[i].name,
                artist: json.tracks.items[i].artists[0].name,
                image: json.tracks.items[i].album.images[0].url,
                album: json.tracks.items[i].album.name,
                time: millisToMinutesAndSeconds(json.tracks.items[i].duration_ms),
                artistHref: json.tracks.items[i].artists[0].href,
                isExplicit: json.tracks.items[i].explicit,
              }
              var track = new Track(opts);
              tracks.push(track);
            };
          };
          for (;fetchResponse.length < 5;){
            var index = getRandomInt(tracks.length);
            var track = tracks[index];
            if(fetchResponse.indexOf(track) === -1){
              fetchResponse.push(track);
            }
          }
          callback(fetchResponse);
        });
      }
    });
}

var yearFetch = function(year, callback) {
  tracks.length = 0;
  fetchResponse.length = 0;
  request.post(authOptions, function(error, response, json) {
    if (!error && response.statusCode === 200) {
    var year_token = json.access_token;
    var yearOptions = {
      url: 'https://api.spotify.com/v1/search?q=year:' + year + '&type=track&limit=50',
      headers: {
        'Authorization': 'Bearer ' + year_token
      },
      json: true
    };

    request.get(yearOptions, function(error, response, json) {
      for (i = 0 ; i < json.tracks.items.length; i ++){
        if (json.tracks.items[i].popularity > 50){
          var opts = {
            track: json.tracks.items[i].name,
            artist: json.tracks.items[i].artists[0].name,
            image: json.tracks.items[i].album.images[0].url,
            album: json.tracks.items[i].album.name,
            time: millisToMinutesAndSeconds(json.tracks.items[i].duration_ms),
            artistHref: json.tracks.items[i].artists[0].href,
            isExplicit: json.tracks.items[i].explicit,
          }
          var track = new Track(opts);
          tracks.push(track);
        };
      };
      for (;fetchResponse.length < 5;){
        var index = getRandomInt(tracks.length);
        var track = tracks[index];
        if(fetchResponse.indexOf(track) === -1){
          fetchResponse.push(track);
        }
      }
      callback(fetchResponse);
    });
    }
  });
}

var termFetch = function(term, callback) {
  tracks.length = 0;
  fetchResponse.length = 0;
  request.post(authOptions, function(error, response, json) {
    if (!error && response.statusCode === 200) {
    var term_token = json.access_token;
    var termOptions = {
      url: 'https://api.spotify.com/v1/search?q=' + term + '&type=track&limit=50',
      headers: {
        'Authorization': 'Bearer ' + term_token
      },
      json: true
    };

    request.get(termOptions, function(error, response, json) {
      for (i = 0 ; i < json.tracks.items.length; i ++){
        if (json.tracks.items[i].popularity > 50){
          var opts = {
            track: json.tracks.items[i].name,
            artist: json.tracks.items[i].artists[0].name,
            image: json.tracks.items[i].album.images[0].url,
            album: json.tracks.items[i].album.name,
            time: millisToMinutesAndSeconds(json.tracks.items[i].duration_ms),
            artistHref: json.tracks.items[i].artists[0].href,
            isExplicit: json.tracks.items[i].explicit,
          }
          var track = new Track(opts);
          tracks.push(track);
        };
      };
      for (;fetchResponse.length < 5;){
        var index = getRandomInt(tracks.length);
        var track = tracks[index];
        if(fetchResponse.indexOf(track) === -1){
          fetchResponse.push(track);
        }
      }
      callback(fetchResponse);
    });
    }
  });
}



/// VIDEO CODE TO BE REFACTORED TO YOUTUBE TRACK FILTER ////
var videos = [];
var Video = function(opts){
  this.title = opts.title,
  this.image = opts.image,
  this.id = opts.id
};

var videoFetch = function(track , artist, callback){
  var url = "https://www.googleapis.com/youtube/v3/search";
  var properties = {
      key: 'AIzaSyB379-eVXShLJqsXfu06uASkyQmrN-wYPg', //Use the API key to authorize the search
      q: 'karaoke ' + artist + track, //Specifies the query term to search for
      part: 'snippet', //Specifies a comma-separated list of one or more SEARCH resource properties that the API response will include. SNIPPET is the parameter value.
      type: 'video', //Excludes playlists and channels from results
      videoEmbeddable: true, //Specifies only embeddable videos
      maxResults: 3, //maximim number of results
      format: 'json'
    }

  console.log('inside of videoFetch');
  videos.length = 0;
  request.get({url : url, qs : properties}, function(error, response, json){
    if(error){
      console.log(error);
    };
    if (!error) {
      console.log('no error');
      json  = JSON.parse(json);
      // console.log(json.items);
      for (i = 0 ; i < json.items.length; i ++){
        var opts = {
          title : json.items[i].snippet.title,
          id : json.items[i].id.videoId,
          image : json.items[i].snippet.thumbnails.high.url
        }
        var video = new Video(opts);
        videos.push(video);
      };
      callback(videos);
    }
  });
}


//this allows other parts of our application to access tracks and trackFetch
module.exports = {
  genreFetch : genreFetch,
  yearFetch : yearFetch,
  termFetch : termFetch,
  tracks : tracks,
  videoFetch : videoFetch,
  videos : videos
}
})();
