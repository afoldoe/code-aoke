$("#genre-filter").click(function(){
  $("#genre2").fadeIn("slow");
  $("#year-filter").hide();
  $("#genre-filter").hide();
  $("#term-filter").hide();
  $("#genre-submit").fadeIn("slow");
});

$("#year-filter").click(function(){
  $("#genre-filter").hide();
  $("#term-filter").hide();
  $("#year-filter").hide();
  $("#year").fadeIn("slow");
  $("#year-submit").fadeIn("slow");
});

$("#term-filter").click(function(){
  $("#term-select").fadeIn("slow");
  $("#year-filter").hide();
  $("#genre-filter").hide();
  $("#term-filter").hide();
  $("#term-submit").fadeIn("slow");
});
