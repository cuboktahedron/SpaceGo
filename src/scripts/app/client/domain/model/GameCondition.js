define(function(require) {
  "use strict";

  var GameCondition = function(condition) {
    this._boardSize = condition.boardSize;
  };

  GameCondition.prototype = {};

  Object.defineProperties(GameCondition.prototype, {
    boardSize: {
      get: function() { return this._boardSize; },
      configurable: false,
    },
  });

  GameCondition.prototype.equals = function(o) {
    if (!(o instanceof GameCondition)) {
      return false;
    }

    return this.boardSize === o.boardSize;
  }

  return GameCondition;
});

