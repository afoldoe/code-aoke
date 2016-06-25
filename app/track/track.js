//import spotify api config variables and request.
var spotifyAPI = require('../../config/spotify_api.js');
var video = require('../video/video.js');
var request = require('request');
var rp = require('request-promise');
(function(){

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
var checkedVideos = [];
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

var videoCheck = function(data, callback, send){
  checkedVideos.length = 0;
  var promisesAll = [];
  console.log(data.tracks.items.length);
  var url = "https://www.googleapis.com/youtube/v3/search";
  for (i = 0 ; i < data.tracks.items.length; i ++){
    // console.log(data.tracks.items[i].name);
    var properties = {
        key: 'AIzaSyB379-eVXShLJqsXfu06uASkyQmrN-wYPg',
        q: 'karaoke ' + data.tracks.items[i].artists[0].name + data.tracks.items[i].name,
        part: 'snippet',
        type: 'video',
        videoEmbeddable: true,
        maxResults: 3,
        format: 'json'
      }
      // console.log('inside of videoCheck');
      var p = new Promise(function(resolve, reject){
          rp.get({url : url, qs : properties}, function(error, response, json){
          if(error){
            console.log(error);
          };
          if (!error) {
            // console.log('no error');
            var videoJson  = JSON.parse(json);
            for (i = 0 ; i < videoJson.items.length; i ++){
              if (wordInString(videoJson.items[i].snippet.title, 'karaoke')){
                console.log(data.tracks.items[i].name);
                checkedVideos.push(data.tracks.items[i]);
                return;
            }
            // return;
          }
        }
        // console.log(checkedVideos);
      }).then(function(){
        // console.log('rp finished');
        resolve('success!')
      });
    })
    promisesAll.push(p);
  }
  // console.log(promisesAll);

  Promise.all(promisesAll).then(function(){
    console.log('Promise All Finished')
    // console.log(checkedVideos);
    callback(checkedVideos, send);
  });
}


var trackConstruct = function(data, send){
  // console.log(data);
  console.log('inside trackConstruct')
  fetchResponse = [];
  tracks.length = 0;
  fetchResponse.length = 0;
  // console.log(data.tracks.items.length);
  for (i = 0 ; i < data.length; i ++){
    // console.log(data[i].name);
    if (data[i].popularity > 50){
      var opts = {
        track: data[i].name,
        artist: data[i].artists[0].name,
        image: data[i].album.images[0].url,
        album: data[i].album.name,
        time: millisToMinutesAndSeconds(data[i].duration_ms),
        artistHref: data[i].artists[0].href,
        isExplicit: data[i].explicit,
      }
      var track = new Track(opts);
      tracks.push(track);
    };
  };
  console.log(tracks.length);
  if (!tracks.length){
    console.log('ZERO')
    fetchResponse = null
    send(fetchResponse);
  }
  // console.log(tracks);
  var index;
  var track;
  if (tracks.length){
    console.log('LENGTH');
    for (;fetchResponse.length < 3;){
      index = getRandomInt(tracks.length);
      // console.log(index);
      track = tracks[index];
      // console.log(track);
      // console.log(fetchResponse);
      if(fetchResponse.indexOf(track) === -1){
        // console.log(track);
        fetchResponse.push(track);
        // return
      }
    }
    send(fetchResponse);
  }
}
var trackRequest = function(data, type, send){
  console.log(data);
  console.log(type);
  console.log('inside of trackRequest');
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
        // console.log(error);
        // console.log(json);
        videoCheck(json, trackConstruct, send);
        // trackConstruct(json, send);
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
  trackRequest(term, ' ' , send)
}
module.exports = {
  genreFetch : genreFetch,
  yearFetch : yearFetch,
  termFetch : termFetch
}
})();
