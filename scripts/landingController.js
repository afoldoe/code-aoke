(function(module){
  var controller = {};
  controller.gameStartController = function() {
    $('#genre-filter').show();
    $('#year-filter').show();
    $('#term-filter').show();
    $('#year').hide();
    $('#genre2').hide();
    $('#song-filter').slideDown();
    $('html, body').animate({
      scrollTop: $('#song-filter').offset().top
    }, 2000);
  };

  controller.aboutHandler = function() {
    $('html, body').animate({
      scrollTop: $('#about').offset().top
    }, 2000);
  };

  controller.navHandler = function() {
    $('nav').hide();
    $('#menuIcon').on('click', function() {
      $('nav').slideToggle();
    });
  };
    // $(window).scroll(function() {
    //   if($(window).scrollTop() < 100) {
    //     $('nav').addClass('scrollDown');
    //     $('nav').removeClass('scrollUp');
    //   } else {
    //     $('nav').removeClass('scrollDown');
    //     $('nav').addClass('scrollUp');
    //   }
    // });

  $('#about').on('click', controller.aboutHandler);
  $('#startButton').on('click', controller.gameStartController);
  $('#gameStartNav').on('click', controller.gameStartController);
  module.controller = controller;
})(window);
