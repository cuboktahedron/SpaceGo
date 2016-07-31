define(function(require) {
  "use strict";

  var GameRepository = {};

  Object.defineProperties(GameRepository, {
    currentGame: {
      get: function() { return this._currentGame; },
      set: function(value) { this._currentGame = value; }
    },
  });

  var id = 0;
  GameRepository.nextGameId = function() {
    id++;
    return "" + id;
  };

  return GameRepository;
});

