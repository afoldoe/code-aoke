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
               controls: 0,
               showinfo: 0,
               disablekb: 1,
               modestbranding: 1
           },
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
      onYouTubeIframeAPIReady(id);
      $('#fullscreen').append("<button id='fullview'>Play Fullscreen</button>");
      $('#message').append("<h1 id='salute'>For Those About to Rock, We Salute You!</h1>");
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

  videoPlayer.initAll = function(){
    videoPlayer.Ready();
  }

  module.videoPlayer = videoPlayer;

})(window);
