var spotifyAPI = require('../../config/spotify_api.js');
var request = require('request');

var client_id = spotifyAPI.client_id;
var client_secret = spotifyAPI.client_secret;
var redirect_uri = spotifyAPI.redirect_uri;

(function(){

var tracks = [];

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


var trackFetch = function(genre, callback){
  track = [];
  console.log('inside of track fetch');
  request.post(authOptions, function(error, response, json) {
      if (!error && response.statusCode === 200) {
        // use the access token to access the Spotify Web API
        var token = json.access_token;
        console.log(json.access_token);
        var options = {
          url: 'https://api.spotify.com/v1/search?q='+ genre +'&type=track&limit=50',
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options, function(error, response, json) {
          // bodyJSON = JSON.parse(body);
          for (i = 0 ; i < json.tracks.items.length; i ++){
            if (json.tracks.items[i].popularity > 50){
              tracks.push(json.tracks.items[i]);
            };
          };
          console.log(tracks);
          callback();
        });
      }
    });
}

module.exports = {
  trackFetch : trackFetch,
  tracks : tracks
}
})()
