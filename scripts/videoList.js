(function(module){

  var videoList = {};

  videoList.toHtml = function(track){
    $('#track-list').empty();
    getCompiledTemplate("video").then(function(handlebarsCompile){
      var html = handlebarsCompile(track);
      $('#video-list').append(html);
    });
  }


  videoList.fetchAll = function(){
    $('#track-list').on('click', '.track-title' , function(e){
      var trackTitle = $(this).text();
      var trackArtist = $(this).siblings('.track-artist').text();
      console.log(trackArtist);
      console.log(trackTitle);
      $.ajax({
        type: 'POST',
        url: '/video',
        data: {
          track : trackTitle,
          artist : trackArtist
        }
      })
      .then(function(data){
        data.forEach(function(track){
          console.log(track);
          videoList.toHtml(track);
        });
      });
    });
  };

  videoList.initAll = function(){
    videoList.fetchAll();
    videoList.showVideos();
  };

  videoList.showVideos = function() {
    $('#track-list').on('click', '.track-title' , function(e){
      $('#track-list').slideUp(3000, function() {
        $('html, body').animate({
          scrollTop: $('#video-list').offset().top
        }, 2000);
        $('#track-list').empty();
      });
      console.log('slide slide');
    });
  };

  module.videoList = videoList;

})(window);
