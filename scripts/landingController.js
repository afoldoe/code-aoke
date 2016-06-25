(function(module){
  var controller = {};
  controller.gameStartController = function() {
      $('html, body').animate({
          scrollTop: $("#song-filter").offset().top
      }, 2000);
      $('#about').fadeOut('slow');
  };

  controller.navHandler = function() {
    $(window).scroll(function() {
      if($(window).scrollTop() < 100) {
        $('nav').addClass('scrollDown');
        $('nav').removeClass('scrollUp');
      } else {
        $('nav').removeClass('scrollDown');
        $('nav').addClass('scrollUp');
      }
    });
  };

  $('#startButton').on('click', controller.gameStartController);
  $('#gameStartNav').on('click', controller.gameStartController);
  module.controller = controller;
})(window);
