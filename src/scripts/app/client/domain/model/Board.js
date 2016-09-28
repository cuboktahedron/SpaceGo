define(function(require) {
  "use strict";

  var Stone = require('app/client/domain/model/Stone');

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
    var ss;

    if (!this.canPutStone(x, y, stone)) {
      return -1;
    }

    this._coodinates[x][y] = stone;

    ss = this._capture(x, y, stone);
    return ss.length;
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
    var ss;
    var dryBoard = new Board(this.size);
    var xi, yi;
    for (xi = 0; xi < dryBoard.size; xi++) {
      for (yi = 0; yi < dryBoard.size; yi++) {
        dryBoard._coodinates[xi][yi] = this._coodinates[xi][yi];
      }
    }

    dryBoard._coodinates[x][y] = stone;

    ss = dryBoard._capture(x, y, stone);
    if (ss.length === 0) {
      if(dryBoard._isSurroundedByEnemy(x, y, stone)) {
        return -1;
      }
    }

    return ss.length;
  };

  Board.prototype._capture = function(x, y, myStone) {
    var stone;
    var searched = [];
    var xi, yi;
    var ss = [],
      ss1 = [],
      ss2 = [],
      ss3 = [],
      ss4 = [];
    var coord;
    var i;

    if (myStone.equals(Stone.Black)) {
      stone = Stone.White;
    } else {
      stone = Stone.Black;
    }

    for (xi = 0; xi < this.size; xi++) {
      searched[xi] = [];
      for (yi = 0; yi < this.size; yi++) {
        searched[xi][yi] = false;
      }
    }

    if (!this.searchSpace(this._correctCoordinate(x - 1), y, stone, searched, ss1)) {
      ss = ss1.concat();
    }
    if (!this.searchSpace(x, this._correctCoordinate(y - 1), stone, searched, ss2)) {
      ss = ss.concat(ss2);
    }
    if (!this.searchSpace(this._correctCoordinate(x + 1), y, stone, searched, ss3)) {
      ss = ss.concat(ss3);
    }
    if (!this.searchSpace(x, this._correctCoordinate(y + 1), stone, searched, ss4)) {
      ss = ss.concat(ss4);
    }

    for (i = 0; i < ss.length; i++) {
      coord = ss[i];
      this._coodinates[coord.x][coord.y] = null;
    }

    return ss;
  };

  Board.prototype.searchSpace = function(xx, yy, myStone, searched, ss) {
    if (searched[xx][yy]) {
      return false;
    }

    if (this._coodinates[xx][yy] == null) {
      return true;
    }

    searched[xx][yy] = true;

    if (this._coodinates[xx][yy].equals(myStone)) {
      ss.push({x: xx, y: yy});
      if (this.searchSpace(this._correctCoordinate(xx - 1), yy, myStone, searched, ss)) return true;
      if (this.searchSpace(xx, this._correctCoordinate(yy - 1), myStone, searched, ss)) return true;
      if (this.searchSpace(this._correctCoordinate(xx + 1), yy, myStone, searched, ss)) return true;
      if (this.searchSpace(xx, this._correctCoordinate(yy + 1), myStone, searched, ss)) return true;
    }

    return false;
  };

  Board.prototype._isSurroundedByEnemy = function(x, y, myStone) {
    var searched = [];
    var xi, yi;
    var ss = [];

    for (xi = 0; xi < this.size; xi++) {
      searched[xi] = [];
      for (yi = 0; yi < this.size; yi++) {
        searched[xi][yi] = false;
      }
    }

    return !this.searchSpace(x, y, myStone, searched, ss);
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

