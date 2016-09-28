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
    if (this.isOuterField(x, y)) {
      return false;
    }

    if (this.isBanPoint(x, y, stone)) {
      return false;
    }

    return true;
  };

  Board.prototype.isOuterField = function(x, y) {
    return x < 0 || x >= this.size || y < 0 || y >= this.size;
  };

  Board.prototype.existsStone = function(x, y) {
    return this._coodinates[x][y] != null;
  };

  Board.prototype.isBanPoint = function(x, y, stone) {
    if (this.existsStone(x, y)) {
      return false;
    }

    // TODO: ban recapuring ko immediately

    if (this.dryPutStone(x, y, stone) === -1) {
      return true;
    }

    return false;
  };

  Board.prototype.dryPutStone = function(x, y, stone) {
    // TODO: make copy method
    var captureData;
    var dryBoard = new Board(this.size);
    var xi, yi;
    for (xi = 0; xi < dryBoard.size; xi++) {
      for (yi = 0; yi < dryBoard.size; yi++) {
        dryBoard._coodinates[xi][yi] = this._coodinates[xi][yi];
      }
    }

    dryBoard._coodinates[x][y] = stone;

    captureData = dryBoard._capture(x, y, stone);
    if (captureData.num === 0) {
      if(dryBoard._isSurroundedByEnemy(x, y, stone)) {
        return -1;
      }
    }

    return captureData.num;
  };

  Board.prototype._capture = function(x, y, myStone) {
    // TODO: not impelemented
    var data = {};

    data.num = 0;
    return data;
  };

  Board.prototype._isSurroundedByEnemy = function(x, y, myStone) {
    var that = this;
    var searched = [];
    var x, y;
    var xi, yi;
    var cc = this._correctCoordinate;
    var searchSpace = function(xx, yy) {
      if (searched[xx][yy]) {
        console.log('a');
        return false;
      }

      if (that._coodinates[xx][yy] == null) {
        return true;
      }

      searched[xx][yy] = true;

      if (that._coodinates[xx][yy].equals(myStone)) {
        if (searchSpace(that._correctCoordinate(xx - 1), yy)) return true;
        if (searchSpace(xx, that._correctCoordinate(yy - 1))) return true;
        if (searchSpace(that._correctCoordinate(xx + 1), yy)) return true;
        if (searchSpace(xx, that._correctCoordinate(yy + 1))) return true;
      }

      return false;
    }

    for (xi = 0; xi < this.size; xi++) {
      searched[xi] = [];
      for (yi = 0; yi < this.size; yi++) {
        searched[xi][yi] = false;
      }
    }

    if (searchSpace(x, y)) {
      return false;

    }

    return true;
  };

  Board.prototype._correctCoordinate = function(n) {
    while (n < 0) {
      n = n + this.size;
    }

    if (n >= this.size) {
      n = n % this.size;
    }

    return n;
  };

  Board.prototype.getState = function() {
    return this;
  };

  return Board;
});

