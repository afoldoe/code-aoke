(function(module){
  var videoPlayer = {};
  var player;
  var videoData;
  var title;
  var video_id;
  var songURL;

  videoPlayer.fetchInfo = function() {
    videoData = player.getVideoData();
    title = videoData['title'];
    video_id = videoData['video_id'];
    songURL = 'https://www.youtube.com/watch?v=' + video_id;
  };

  videoPlayer.createTable = function(callback) {
    webDB.execute(
      'CREATE TABLE IF NOT EXISTS favorites (' +
      'id INTEGER PRIMARY KEY, ' +
      'title VARCHAR (50), ' +
      'url VARCHAR (200));',
      function(result) {
        console.log('Successfully set up the favorites table.', result);
        if (callback) callback();
      }
    );
  };

  videoPlayer.deleteTable = function(callback) {
    webDB.execute(
      'DROP TABLE IF EXISTS favorites;',
      callback
    );
  };

  videoPlayer.insertFavorites = function(callback) {
    webDB.execute(
      [
        {
          'sql': 'INSERT INTO favorites ( title, url) VALUES( ?, ?);',
          'data': [ title, songURL],
        }
      ],
      callback
    );
  };

  function onPlayerReady(event){
    player = event.target;
    iframe = document.querySelector('#player');
    videoPlayer.fetchInfo();
  }

  function onYouTubeIframeAPIReady(id) {
    player = new YT.Player('player', {
      height: '390',
      width: '640',
      videoId: id,
      playerVars: {
        autohide: 1,
        controls: 1,
        showinfo: 0,
        disablekb: 1,
        modestbranding: 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }

  videoPlayer.Ready = function(){
    $('#video-list').on('click', '.video-image', function(){
      $('#video-list').empty();
      var id = $(this).parent('div , .video-details').attr('id');
      var videoName = $(this).siblings('.video-title').text();
      console.log(videoName);
      onYouTubeIframeAPIReady(id);
      $('#selection-title').append('<h1 id="selection-title">'+videoName+'</h1>');
      $('#fullscreen').append('<button id="fullview">Play Fullscreen</button>');
      $('#message').append('<p id="salute">For Those About to Rock, We Salute You!</p>');
      $('#faves').append('<button id="faveButton">Add to Favorites</button>');
      $('#faveButton').on('click', function(e) {
        videoPlayer.insertFavorites();
        console.log('faveButton event');
      });
    });
  };

  videoPlayer.favoriteLoad = function() {

  };

  videoPlayer.getFavorites = function() {
    webDB.execute('SELECT * FROM favorites', function(rows) {
      if(rows.length) {
        rows.forEach(function(song) {
          console.log(song);
          title = song.title;
          songURL = song.url;
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


  $('#fullscreen').on('click', function(){
    player.playVideo();//won't work on mobile
    var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    if (requestFullScreen) {
      requestFullScreen.bind(iframe)();
    }
  });

  function onPlayerStateChange(event){
    if(event.data === 0) {
      $('#fullview').remove();
      $('#nextAction').append('<button id="fullview">Play Again</button>');
      $('#nextAction').append('<button id="fullview">Start Over</button>');
    }
  }

  videoPlayer.initAll = function(){
    videoPlayer.Ready();
    videoPlayer.createTable();
    videoPlayer.eventHandlers();
    videoPlayer.favoriteLoad();
  };

  $('.favoriteTitle').on('click', function(e) {
    e.preventDefault();
    console.log('event fired');
    $('html, body').animate({
      scrollTop: $('#video-selection').offset().top
    }, 2000);
  });

  module.videoPlayer = videoPlayer;

})(window);
