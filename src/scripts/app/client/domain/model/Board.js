define(function(require) {
  "use strict";

  /**
   * @param {Number} size
   */
  var Board = function(size) {
    var x, y;

    if (Math.round(size) !== size) {
      throw new Error("Size must be integer");
    }

    if (size < 5 && size > 19) {
      throw new Error("Size must be between 5 and 19");
    }

    this._size = size;
    this._coodinates = [];
    for (x = 0; x < size; x++) {
      this._coodinates[x] = [];
      for (y = 0; y < size; y++) {
        this._coodinates[x][y] = null;
      }
    }
  };

  Board.prototype = {};

  Object.defineProperties(Board.prototype, {
    size: {
      get: function() { return this._size; },
      configurable: false,
    },
  });

  Board.prototype.getStone = function(x, y) {
    return this._coodinates[x][y];
  };

  Board.prototype.putStone = function(x, y, stone) {
    if (!this.canPutStone(x, y, stone)) {
      return false;
    }

    this._coodinates[x][y] = stone;
    return true;
  };

  Board.prototype.canPutStone = function(x, y, stone) {
    if (this._isOuterField(x, y)) {
      return false;
    }

    if (this._existsStone(x, y)) {
      return false;
    }

    if (this._isBanPoint(x, y, stone)) {
      return false;
    }

    return true;
  };

  Board.prototype._isOuterField = function(x, y) {
    return x < 0 || x >= this.size || y < 0 || y >= this.size;
  };

  Board.prototype._existsStone = function(x, y) {
    return this._coodinates[x][y] != null;
  };

  Board.prototype._isBanPoint = function(x, y) {
    // TODO: not implemented
    return false;
  };

  return Board;
});

