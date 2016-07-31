define(function(require) {
  "use strict";

  var Board = require('app/client/domain/model/Board');
  var Stone = require('app/client/domain/model/Stone');

  /**
   * @param {GameId} id
   * @param {GameCondition} condition
   */
  var Game = function(id, condition) {
    this._id = id;
    this._board = new Board(condition.board.size);
    this._phase = Stone.Black;
  };

  Game.prototype = {};

  Object.defineProperties(Game.prototype, {
    id: {
      get: function() { return this._id;  },
    },

    phase: {
      get: function() { return this._phase;  },
    },
  });

  Game.prototype.putNextStone = function(x, y) {
    if (!this._board.putStone(x, y, this.phase)) {
      return false;
    }

    this._switchPhase();
    return true
  };

  Game.prototype.pass = function(x, y) {
    this._switchPhase();
  };

  Game.prototype._switchPhase = function() {
    if (this._phase.equals(Stone.Black)) {
      this._phase = Stone.White;
    } else {
      this._phase = Stone.Black;
    }

    console.log(this._phase);
  };

  Game.prototype.getState = function() {
    return {
      phase: this.phase,
      board: this._board.getState(),
    }
  };

  return Game;
});

