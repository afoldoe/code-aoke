//import spotify api config variables and request.
var spotifyAPI = require('../../config/spotify_api.js');
var video = require('../video/video.js');
var request = require('request');
(function(){
//////////// Helper functions /////////////
//////////////////////////////////////////
var consoleLog = function(data){
  console.log(data)
}
// var trackRandomize = function(track, send){
//   for (;fetchResponse.length < 3;){
//     var index = getRandomInt(tracks.length);
//     var track = tracks[index];
//     if(fetchResponse.indexOf(track) === -1){
//       fetchResponse.push(track);
//     }
//   }
//   send(fetchResponse);
// }
var wordInString = function(s, word){
  return new RegExp( '\\b' + word + '\\b', 'i').test(s);
}
var millisToMinutesAndSeconds = function(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}
var getRandomInt = function(max) {
  return Math.abs(Math.floor((Math.random() * max)));
}
/////////////// Variables ////////////////
//////////////////////////////////////////
var client_id = spotifyAPI.client_id;
var client_secret = spotifyAPI.client_secret;
var redirect_uri = spotifyAPI.redirect_uri;
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
///// Constructor and and API functions ///
//////////////////////////////////////////
var Track = function(opts){
  this.track = opts.track;
  this.artist = opts.artist;
  this.image = opts.image;
  this.album = opts.album;
  this.time = opts.time;
  this.artistHref = opts.artistHref;
  this.isExplicit = opts.isExplicit;
}
var resultState;
var videoCheck = function(data, callback, send){
  var checkedVideos = [];
  // var thatdata = data;
  // console.log(data);
  var url = "https://www.googleapis.com/youtube/v3/search";
  for (i = 0 ; i < data.tracks.items.length; i ++){
    var properties = {
        key: 'AIzaSyB379-eVXShLJqsXfu06uASkyQmrN-wYPg',
        q: 'karaoke ' + data.tracks.items[i].artists[0].name + data.tracks.items[i].name,
        part: 'snippet',
        type: 'video',
        videoEmbeddable: true,
        maxResults: 3,
        format: 'json'
      }
      console.log('inside of videoCheck');
      request.get({url : url, qs : properties}, function(error, response, json){
        if(error){
          console.log(error);
        };
        if (!error) {
          console.log('no error');
          var videoJson  = JSON.parse(json);
          for (i = 0 ; i < videoJson.items.length; i ++){
            if (wordInString(videoJson.items[i].snippet.title, 'karaoke')){
              console.log('true');
              checkedVideos.push(data.tracks.items[i]);
          }
        }
      }
      console.log(checkedVideos);
    });
  }
  // callback(checkedVideos, send);
}
var trackConstruct = function(data, send){
  tracks.length = 0;
  fetchResponse.length = 0;
  for (i = 0 ; i < data.tracks.items.length; i ++){
    if (data.tracks.items[i].popularity > 50){
      var opts = {
        track: data.tracks.items[i].name,
        artist: data.tracks.items[i].artists[0].name,
        image: data.tracks.items[i].album.images[0].url,
        album: data.tracks.items[i].album.name,
        time: millisToMinutesAndSeconds(data.tracks.items[i].duration_ms),
        artistHref: data.tracks.items[i].artists[0].href,
        isExplicit: data.tracks.items[i].explicit,
      }
      var track = new Track(opts);
      tracks.push(track);
    };
  };
  // trackRandomize(track, send);
  // console.log(tracks);
  for (;fetchResponse.length < 3;){
    var index = getRandomInt(tracks.length);
    var track = tracks[index];
    if(fetchResponse.indexOf(track) === -1){
      fetchResponse.push(track);
    }
  }
  send(fetchResponse);
}
var trackRequest = function(data, type, send){
  console.log('inside of trackRequest');
  console.log(data);
  request.post(authOptions, function(error, response, json){
    if (!error && response.statusCode === 200) {
      var token = json.access_token;
      var options = {
        url: 'https://api.spotify.com/v1/search?q='+ type + ':' + data + '&type=track&limit=50',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        json: true
      };
      request.get(options, function(error, response, json){
        // videoCheck(json, trackConstruct, send);
        trackConstruct(json, send);
      });
    }
  });
};
/////// DRY code called at routes ///////
////////////////////////////////////////
var genreFetch = function(genre, send){
  trackRequest(genre, 'genre', send);
}
var yearFetch = function(year, send) {
    trackRequest(year, 'year', send);
}
var termFetch = function(term, send) {
  trackRequest(term, '', send)
}
module.exports = {
  genreFetch : genreFetch,
  yearFetch : yearFetch,
  termFetch : termFetch
}
})();
