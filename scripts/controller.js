(function(module){
  var controller = {};
  controller.gameStartController = function() {
      $('html, body').animate({
          scrollTop: $("#gameStart").offset().top
      }, 2000);
  };

  $('#startButton').on('click', controller.gameStartController);
  $('#gameStartNav').on('click', controller.gameStartController);
  module.controller = controller;
})(window);
