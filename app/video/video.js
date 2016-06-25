var request = require('request');

(function(){

  //////////// Helper functions /////////////
  //////////////////////////////////////////
  var wordInString = function(s, word){
    return new RegExp( '\\b' + word + '\\b', 'i').test(s);
  }

  ///// Constructor and and API functions ///
  //////////////////////////////////////////
  var Video = function(opts){
    this.title = opts.title,
    this.channel = opts.channel,
    this.image = opts.image,
    this.id = opts.id,
    this.description = opts.description
  };

  var videos = [];

  var videoRequest = function(track, artist, callback, send){
    console.log(track);
    console.log(artist);
    var url = "https://www.googleapis.com/youtube/v3/search";
    var properties = {
        // channelId: id,
        key: 'AIzaSyC5e_6oGK54wZOj8AjkG4U7exOpX8uDBL4', //Use the API key to authorize the search
        q: 'karaoke ' + artist + ' ' + track, //Specifies the query term to search for
        part: 'snippet', //Specifies a comma-separated list of one or more SEARCH resource properties that the API response will include. SNIPPET is the parameter value.
        type: 'video', //Excludes playlists and channels from results
        videoEmbeddable: true, //Specifies only embeddable videos
        maxResults: 15, //maximim number of results
        format: 'json'
      }
      console.log('inside of videoRequest');
      request.get({url : url, qs : properties}, function(error, response, json){
        if(error){
          console.log(error);
        };
        if (!error) {
          console.log('no error');
          var requestJson  = JSON.parse(json);
        }
        callback(requestJson, send);
      });
  }

  var videoConstruct = function(data, send){
    videos.length = 0;
    console.log('inside video construct')
    for (i = 0 ; i < data.items.length; i ++){
        // console.log(wordInString(data.items[i].snippet.title, 'karaoke'));
        if (wordInString(data.items[i].snippet.title, 'karaoke')){
          var opts = {
            title : data.items[i].snippet.title,
            channel : data.items[i].snippet.channelTitle,
            id : data.items[i].id.videoId,
            image : data.items[i].snippet.thumbnails.high.url,
            description : data.items[i].snippet.description
          }
          var video = new Video(opts);
          videos.push(video);
        }
      };
      send(videos);
  }

  /////// DRY code called at routes ///////
  ////////////////////////////////////////
  var videoFetch = function(track , artist, send){
      videoRequest(track , artist, videoConstruct, send);
  }

  module.exports = {
    videoFetch : videoFetch,
    videoRequest: videoRequest
    }
})();
