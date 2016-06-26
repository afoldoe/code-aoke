(function(module){
  var videoPlayer = {};
<<<<<<< HEAD

  var player;
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
=======
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
>>>>>>> bd137c3789d80db84790962669cbe463cc7e6305

  videoPlayer.Ready = function(){
    $('#video-list').on('click', '.video-image', function(){
      $('#video-list').empty();
      var id = $(this).parent('div , .video-details').attr('id');
      var videoName = $(this).siblings('.video-title').text();
      console.log(videoName);
      onYouTubeIframeAPIReady(id);
<<<<<<< HEAD
      $('#selection-title').append("<h1 id='selection-title'>"+videoName+"</h1>");
      $('#fullscreen').append("<button id='fullview'>Play Fullscreen</button>");
      $('#message').append("<p id='salute'>For Those About to Rock, We Salute You!</p>");
    })
  }

 function onPlayerReady(event){
      player = event.target;
      iframe = document.querySelector('#player');
   }

  $("#fullscreen").on("click", function(){
=======
      $('#selection-title').append('<h1 id="selection-title">'+videoName+'</h1>');
      $('#fullscreen').append('<button id="fullview">Play Fullscreen</button>');
      $('#message').append('<p id="salute">For Those About to Rock, We Salute You!</p>');
    });
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
    $('#faveButton').on('click', function(e) {
      videoPlayer.insertFavorites();
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


  $('#fullscreen').on('click', function(){
>>>>>>> bd137c3789d80db84790962669cbe463cc7e6305
    player.playVideo();//won't work on mobile
    var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    if (requestFullScreen) {
      requestFullScreen.bind(iframe)();
    }
<<<<<<< HEAD
  })
=======
  });
>>>>>>> bd137c3789d80db84790962669cbe463cc7e6305

  function onPlayerStateChange(event){
    if(event.data === 0) {
      $('#fullview').remove();
<<<<<<< HEAD
      $('#nextAction').append("<button id='fullview'>Play Again</button>");
      $('#nextAction').append("<button id='fullview'>Start Over</button>");
=======
      $('#nextAction').append('<button id="fullview">Play Again</button>');
      $('#nextAction').append('<button id="fullview">Start Over</button>');
>>>>>>> bd137c3789d80db84790962669cbe463cc7e6305
    }
  }

  videoPlayer.initAll = function(){
    videoPlayer.Ready();
<<<<<<< HEAD
  }
=======
    videoPlayer.createTable();
    videoPlayer.eventHandlers();
  };
>>>>>>> bd137c3789d80db84790962669cbe463cc7e6305

  module.videoPlayer = videoPlayer;

})(window);
