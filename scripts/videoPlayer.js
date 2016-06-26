(function(module){
  var videoPlayer = {};

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

  videoPlayer.Ready = function(){
    $('#video-list').on('click', '.video-image', function(){
      $("#video-selection").show();
      $('#video-list').empty();
      var id = $(this).parent('div , .video-details').attr('id');
      var videoName = $(this).siblings('.video-title').text();
      console.log(videoName);
      onYouTubeIframeAPIReady(id);
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
    player.playVideo();//won't work on mobile
    var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    if (requestFullScreen) {
      requestFullScreen.bind(iframe)();
    }
  })

  function onPlayerStateChange(event){
    if(event.data === 0) {
      // document.webkitExitFullscreen();
      function exitFullscreen() {
        if(document.exitFullscreen) {
          document.exitFullscreen();
        } else if(document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if(document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
      exitFullscreen();
      $('#fullview').remove();
      $('#salute').remove();
      $('#nextAction').append("<button id='playAgain'>Play Again</button>");
      $('#nextAction').on('click', function(){
        $('#player').fadeOut('slow', function(){
          $(this).hide();
        });
        $('#video-selection').fadeOut('slow', function(){
          $(this).hide();
        });
        $("#year-select").show();
        $("#genre-select").show();
        $("#term-select").show();
        $("#song-filter").show();
      });
    }
  }

  videoPlayer.initAll = function(){
    videoPlayer.Ready();
  }

  module.videoPlayer = videoPlayer;

})(window);
