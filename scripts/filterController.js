$("#genre-filter").click(function(){
  $("#genre").show();
  $("#year-filter").hide();
  $("#term-filter").hide();
  $("#genre-filter").hide();
  $("#genre-submit").show();
});

$("#year-filter").click(function(){
  $("#year").show();
  $("#term-filter").hide();
  $("#genre-filter").hide();
  $("#year-filter").hide();
  $("#year-submit").show();
});

$("#term-filter").click(function(){
  $("#term-select").show();
  $("#year-filter").hide();
  $("#genre-filter").hide();
  $("#term-filter").hide();
  $("#term-submit").show();
});
