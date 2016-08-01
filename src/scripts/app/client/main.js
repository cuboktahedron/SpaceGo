define(function(require) {
  "use strict";

  var GameMediator = require('app/client/mediator/GameMediator.js');
  var BoardView = require('app/client/view/BoardView');

  var main = function() {};
  main.prototype = {
    start: function() {
      var mediator = new GameMediator();

      var boardView = new BoardView(mediator, 9);

      mediator.startGame({
        board: {
          size: 9,
        },
      });
    }
  };

  return main;
});

