(function(module){
  var controller = {};

  //to show only game sections on game start
  controller.gameStartController = function() {
    $('html, body').animate({
      scrollTop: $('#song-filter').offset().top
    }, 2000);
    $('#about').fadeOut('slow');
  };

  //toggles nav bar
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


  $('#startButton').on('click', controller.gameStartController);
  $('#gameStartNav').on('click', controller.gameStartController);
  module.controller = controller;
})(window);
