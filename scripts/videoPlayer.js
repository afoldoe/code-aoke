(function(module){
  var videoPlayer = {};
  var player;
  var videoData;
  var title;
  var video_id;

  videoPlayer.fetchInfo = function() {
    videoData = player.getVideoData();
    title = videoData['title'];
    video_id = videoData['video_id'];
  };

  videoPlayer.createTable = function(callback) {
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS favorites (' +
      'id INTEGER PRIMARY KEY, ' +
      'title VARCHAR (50), ' +
      'url VARCHAR (50));', // what SQL command do we run here inside these quotes?
      function(result) {
        console.log('Successfully set up the articles table.', result);
        if (callback) callback();
      }
    );
  };

  videoPlayer.insertFavorite = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO favorites (title, url) VALUES(?, ?);',
          'data': [title, video_id],
        }
      ],
      callback
    );
  };


  function onYouTubeIframeAPIReady(id) {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: id,
      events: {
        'onReady': onPlayerReady
        //  'onStateChange': onPlayerStateChange
      }
    });
  }

  videoPlayer.Ready = function(){
    $('#video-list').on('click', '.video-image', function(){
      $('#video-list').empty();
      var id = $(this).parent('div , .video-details').attr('id');
      console.log(this);
    // var id = $(this).parent('.video-details').id
    // console.log(id);
      onYouTubeIframeAPIReady(id);
    });
  };

  function onPlayerReady(event) {
    event.target.playVideo();
    videoPlayer.fetchInfo();
  }

  videoPlayer.getFavorites = function() {
    webDB.execute('SELECT * FROM favorites', function(rows) {
      if(rows.length) {
        rows.forEach(function(song) {
          var songTitle = song.title;
          var songID = song.ytID;
          var songURL = 'https://www.youtube.com/watch?' + songID;
          console.log(songURL);
          console.log(songTitle);
          videoPlayer.favoriteToHtml(song);

        });
      }
    });
  };

  videoPlayer.favoriteToHtml = function(song) {
    getCompiledTemplate('favorite').then(function(handlebarsCompile){
      // console.log(handlebarsCompile);

      var html = handlebarsCompile(song);
      // console.log(html);
      $('#favorites').append(html);
    });
  };
  videoPlayer.eventHandlers = function() {
    $('#faveButton').on('click', function(e) {
      videoPlayer.insertFavorite();
    });
    $('#favoritesNav').on('click', function (e) {
      e.preventDefault();
      videoPlayer.getFavorites();
      $('nav').toggle();
      $('#favorites').slideDown(500);
    });
    $('#closeFavorites').on('click', function() {
      $('#favorites').slideUp(500);
    });
  };

  videoPlayer.initAll = function(){
    videoPlayer.Ready();
    videoPlayer.createTable();
    videoPlayer.eventHandlers();
  };

  module.videoPlayer = videoPlayer;

})(window);
