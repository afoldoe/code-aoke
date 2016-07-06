//import spotify api config variables and request.
var spotifyAPI = require('../../config/spotify_api.js');
var video = require('../video/video.js');
var request = require('request');
var rp = require('request-promise');
(function(){

  var wordInString = function(s, word){
    return new RegExp( '\\b' + word + '\\b', 'i').test(s);
  };
  var millisToMinutesAndSeconds = function(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };
  var getRandomInt = function(max) {
    return Math.abs(Math.floor((Math.random() * max)));
  };
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
  };

// var videoCheck = function(data, callback, send){
//   console.log('inside of videoCheck')
//   var tracks = [];
//   var checkedTracks = [];
//   var props = [];
//   checkedTracks.length = 0;
//   tracks.length = 0;
//
//   var url = 'https://www.googleapis.com/youtube/v3/search';
//   for (i = 0 ; i < data.tracks.items.length; i ++) {
//     tracks.push(data.tracks.items[i])
//     var track = data.tracks.items[i].name;
//     var artist = data.tracks.items[i].artists[0].name;
//     var properties = {
//       key: 'AIzaSyC5e_6oGK54wZOj8AjkG4U7exOpX8uDBL4',
//        q: 'karaoke ' + artist + ' ' + track,
//        part: 'snippet',
//        type: 'video',
//        videoEmbeddable: true,
//        maxResults: 10,
//        format: 'json'
//      }
//      var prop = {url: url, qs: properties};
//      props.push(prop);
//    }
//
//     var myPromises = props.map(function(p) {
//       return rp.get(p);
//     });
//
//     // console.log(tracks[0].artists[0].name);
//     // console.log(tracks.length);
//
//   Promise.all(myPromises).then(function(data){
//     console.log('Promise All Finished')
//     data.map(function(i){
//       var titlesArray = [];
//       titlesArray.length = 0;
//       var json = JSON.parse(i);
//       for (i = 0 ; i < json.items.length; i ++){
//         var title = json.items[i].snippet.title;
//         titlesArray.push(title);
//       }
//       // console.log(titlesArray);
//     })
//     for (i = 0 ; i < tracks.length; i ++){
//       console.log('inside of tracks.length loop');
//       // var currentTrack = tracks[i];
//       // console.log(currentTrack);
//       for(i = 0 ; i < titlesArray.length; i ++){
//       //   console.log('inside of titlesArray.length loop');
//
//         console.log(titlesArray[i].indexOf('karaoke'));
//         if (titlesArray.indexOf('karaoke') > -1){
//           console.log('true');
//         }
//     }
//   }
//     // callback(checkedTracks, send);
//   });
// }


  var trackConstruct = function(data, send){
  // console.log(data);
    console.log('inside trackConstruct');
    fetchResponse = [];
    tracks.length = 0;
    fetchResponse.length = 0;
    for (i = 0 ; i < data.tracks.items.length; i ++){
      if (data.tracks.items[i].popularity > 50){
       // console.log(data.tracks.items[i]);
        var opts = {
          track: data.tracks.items[i].name,
          artist: data.tracks.items[i].artists[0].name,
          image: data.tracks.items[i].album.images[0].url,
          album: data.tracks.items[i].album.name,
          time: millisToMinutesAndSeconds(data.tracks.items[i].duration_ms),
          artistHref: data.tracks.items[i].artists[0].href,
          isExplicit: data.tracks.items[i].explicit,
        };
        var track = new Track(opts);
        tracks.push(track);
      };
    };
    console.log(tracks.length);
    if (!tracks.length){
      console.log('ZERO');
      fetchResponse = null;
      send(fetchResponse);
    }
    if (tracks.length){
      console.log('LENGTH');
      for (;fetchResponse.length < 3;){
        var index = getRandomInt(tracks.length);
        var track = tracks[index];
        if(fetchResponse.indexOf(track) === -1){
          fetchResponse.push(track);
        }
      }
      send(fetchResponse);
    }
  };

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
  };
  var yearFetch = function(year, send) {
    trackRequest(year, 'year', send);
  };
  var termFetch = function(term, send) {
    trackRequest(term, ' ' , send);
  };
  module.exports = {
    genreFetch : genreFetch,
    yearFetch : yearFetch,
    termFetch : termFetch
  };
})();
