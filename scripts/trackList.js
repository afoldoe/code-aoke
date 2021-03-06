(function(module){
  var trackList = {};

  trackList.toHtml = function(track){
    $('#track-list').empty();
    getCompiledTemplate('track').then(function(handlebarsCompile){
      // console.log(handlebarsCompile);
      var html = handlebarsCompile(track);
      // console.log(html);
      $('#track-list').append(html);
    });
  };

  trackList.genreFetch = function(){
    $('#genre-form').submit(function(e){
      // trackList.All.length = 0;
      $("#track-list").show();
      $("#video-list").show();

      e.preventDefault();
      var selectGenre = $(this).find('#genre-select , option:selected').val();
      console.log(selectGenre);
      $.ajax({
        type: 'POST',
        url: '/genreTracks',
        data: {
          'genre' : selectGenre
        }
      })
      .then(function(data){
        data.forEach(function(track){
          trackList.toHtml(track);
          console.log(track);
        });
      });
    });
  };

  trackList.yearFetch = function(){
    $('#year-form').submit(function(e){

    // console.log($(this));
      $("#track-list").show();
      $("#video-list").show();
      
      e.preventDefault();
      var selectYear = $(this).find('#year-select , option:selected').val();
      console.log(selectYear);
      $.ajax({
        type: 'POST',
        url: '/yearTracks',
        data: {
          'year' : selectYear
        }
      })
    .then(function(data){
      data.forEach(function(track){
        trackList.toHtml(track);
      });
    });
    });
  };
  trackList.termFetch = function(){
    $('#term-form').submit(function(e){

      $("#track-list").show();
      $("#video-list").show();

      e.preventDefault();
      var inputTerm = $(this).find('input[type=text]').val();
      console.log(inputTerm);
      $.ajax({
        type: 'POST',
        url: '/termTracks',
        data: {
          'term' : inputTerm
        },
        success: function(data, error, xhr){
          data.forEach(function(track){
            trackList.toHtml(track);
            console.log(track);
          });
        },
        error: function(data, error, xhr){
          alert('Sorry, please choose another track, your search had no results');
        }
      });
    });
  };
  trackList.showVideos = function() {
    $('.filterButton').on('click', function() {
      $('#about').hide();
      $('header').slideUp('slow', function() {
        $('#song-filter').slideUp(3000, function() {
          $('html, body').animate({
            scrollTop: $('#track-list').offset().top
          }, 2000);
        });
      });
    });
  };

  trackList.initAll = function(){
    trackList.showVideos();
    trackList.genreFetch();
    trackList.yearFetch();
    trackList.termFetch();
  };

  module.trackList = trackList;


})(window);
