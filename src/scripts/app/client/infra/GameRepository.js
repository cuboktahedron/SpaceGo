define(function(require) {
  "use strict";

  var GameRepository = {};

  Object.defineProperties(GameRepository, {
    currentGame: {
      get: function() { return this._currentGame; },
      set: function(value) { this._currentGame = value; }
    },
  });

  return GameRepository;
});

