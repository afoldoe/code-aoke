(function(module){

  var videoList = {};

  videoList.toHtml = function(track){
    $('#track-list').empty();
    getCompiledTemplate("video").then(function(handlebarsCompile){
      // console.log(handlebarsCompile);
      var html = handlebarsCompile(track);
      // console.log(html);
      $('#video-list').append(html);
    });
  }

  videoList.fetchAll = function(){
    $('#track-list').on('click', '.track' , function(e){
      console.log($(this).text());
      var trackTitle = $(this).text();
      var trackArtist = $(this).siblings('.track-artist').text();
      console.log(trackArtist);
      console.log('works')
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
          // console.log(track);
          videoList.toHtml(track);
        })
      })
    });
  }
  videoList.initAll = function(){
    videoList.fetchAll()
  }

  module.videoList = videoList;

})(window)
