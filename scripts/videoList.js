(function(module){

  var videoList = {};

  //compiles Handlebars template and appends video templates to the page
  videoList.toHtml = function(track){
    $('#track-list').empty();
    getCompiledTemplate('video').then(function(handlebarsCompile){
      var html = handlebarsCompile(track);
      $('#video-list').append(html);
    });
  };

  //AJAX call to youtube API that searches youtube based on the title and artist of the track the user selected
  videoList.fetchAll = function(){
    $('#track-list').on('click', '.track-title' , function(e){
      var trackTitle = $(this).text(); //gets title of selected
      var trackArtist = $(this).siblings('.track-artist').text(); //gets artist
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

  //initialzies videoList
  videoList.initAll = function(){
    videoList.fetchAll();
    videoList.showVideos();
  };

  //shows the videoList and hides the track-list
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
