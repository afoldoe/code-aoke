(function(module){
  var videoPlayer = {};

  var player;
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
    $('#video-list').empty()
    var id = $(this).parent('div , .video-details').attr('id');
    // var id = $(this).parent('.video-details').id
    // console.log(id);
    onYouTubeIframeAPIReady(id);
   })
  }

 function onPlayerReady(event) {
     event.target.playVideo();
   }

   videoPlayer.initAll = function(){
     videoPlayer.Ready();
   }

  module.videoPlayer = videoPlayer;

})(window);
