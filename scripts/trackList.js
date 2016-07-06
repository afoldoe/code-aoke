(function(module){
  var trackList = {};

  //appends track selection to html
  trackList.toHtml = function(track){
    $('#track-list').empty();
    getCompiledTemplate('track').then(function(handlebarsCompile){
      // console.log(handlebarsCompile);
      var html = handlebarsCompile(track);
      // console.log(html);
      $('#track-list').append(html);
    });
  };

  //call to Spotify API to get a list of songs in the genre the user selected
  trackList.genreFetch = function(){
    $('#genre-form').submit(function(e){
      // trackList.All.length = 0;
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

  //call to Spotify API to get a list of songs in the decade the user selected
  trackList.yearFetch = function(){
    $('#year-form').submit(function(e){
      e.preventDefault();
    // console.log($(this));
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

  //call to Spotify API to get a list of songs based on the term the user inputed
  trackList.termFetch = function(){
    $('#term-form').submit(function(e){
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

  //hide hides the #about section and #song-filter and shows trackList
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

  //intitializes tracklist
  trackList.initAll = function(){
    trackList.showVideos();
    trackList.genreFetch();
    trackList.yearFetch();
    trackList.termFetch();
  };

  module.trackList = trackList;

})(window);
