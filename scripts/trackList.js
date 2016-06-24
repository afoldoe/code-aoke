(function(module){
var trackList = {};

trackList.toHtml = function(track){
  $('#track-list').empty();
  getCompiledTemplate("track").then(function(handlebarsCompile){
    // console.log(handlebarsCompile);
    var html = handlebarsCompile(track);
    // console.log(html);
    $('#track-list').append(html);
  });
}

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
        // console.log(track);
      })
    })
  });
};

trackList.yearFetch = function(){
  $('#year-form').submit(function(e){
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
      })
    })
  });
}
trackList.termFetch = function(){
  $('#term-form').submit(function(e){
    e.preventDefault();
    var inputTerm = $(this).find('input').val();
    console.log(inputTerm);
    $.ajax({
      type: 'POST',
      url: '/termTracks',
      data: {
        'term' : inputTerm
      }
    })
    .then(function(data){
      data.forEach(function(track){
        trackList.toHtml(track);
      })
    })
  });
}

trackList.initAll = function(){
  trackList.genreFetch();
  trackList.yearFetch();
  trackList.termFetch();
}

module.trackList = trackList;

})(window);
