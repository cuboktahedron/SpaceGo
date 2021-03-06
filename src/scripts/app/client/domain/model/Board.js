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
    this._coordinates = [];
    this._lastCoordinates = null;
    this._secondLastCoordinates = null;
    for (x = 0; x < size; x++) {
      this._coordinates[x] = [];
      for (y = 0; y < size; y++) {
        this._coordinates[x][y] = null;
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
    return this._coordinates[x][y];
  };

  Board.prototype.putStone = function(x, y, stone) {
    var coords;

    if (!this.canPutStone(x, y, stone)) {
      return -1;
    }

    this._rotateLastCoordinates();
    this._coordinates[x][y] = stone;

    coords = this._capture(x, y, stone);
    return coords.length;
  };

  Board.prototype._rotateLastCoordinates = function() {
    var x, y;

    // the first step
    if (this._lastCoordinates == null) {
      this._lastCoordinates = [];

      for (x = 0; x < this.size; x++) {
        this._lastCoordinates[x] = [];
        for (y = 0; y < this.size; y++) {
          this._lastCoordinates[x][y] = this._coordinates[x][y];
        }
      }

      return;
    }

    // the second step
    if (this._secondLastCoordinates == null) {
      this._secondLastCoordinates = [];
      for (x = 0; x < this.size; x++) {
        this._secondLastCoordinates[x] = [];
        for (y = 0; y < this.size; y++) {
          this._secondLastCoordinates[x][y] = this._lastCoordinates[x][y];
          this._lastCoordinates[x][y] = this._coordinates[x][y];
        }
      }

      return;
    }

    // the second step or later
    for (x = 0; x < this.size; x++) {
      for (y = 0; y < this.size; y++) {
        this._secondLastCoordinates[x][y] = this._lastCoordinates[x][y];
        this._lastCoordinates[x][y] = this._coordinates[x][y];
      }
    }
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
    return this._coordinates[x][y] != null;
  };

  Board.prototype.isBanPoint = function(x, y, stone) {
    if (this.existsStone(x, y)) {
      return false;
    }

    if (this.dryPutStone(x, y, stone) === -1) {
      return true;
    }

    return false;
  };

  Board.prototype.dryPutStone = function(x, y, stone) {
    var coords;
    var dryBoard = this._copy();

    dryBoard._rotateLastCoordinates();
    dryBoard._coordinates[x][y] = stone;

    coords = dryBoard._capture(x, y, stone);
    if (coords.length === 0) {
      if(dryBoard._isSurroundedByEnemy(x, y, stone)) {
        return -1;
      }
    }

    if (dryBoard._isRecapturingKoimmediately()) {
      return -1;
    }

    return coords.length;
  };

  Board.prototype._copy = function() {
    var dryBoard = new Board(this.size);
    var xi, yi;
    var existsLast = (this._lastCoordinates != null);
    var existsSecondLast = (this._secondLastCoordinates != null);

    if (existsLast) {
      dryBoard._lastCoordinates = [];
      for (xi = 0; xi < dryBoard.size; xi++) {
        dryBoard._lastCoordinates[xi] = [];
      }
    }

    if (existsSecondLast) {
      dryBoard._secondLastCoordinates = [];
      for (xi = 0; xi < dryBoard.size; xi++) {
        dryBoard._secondLastCoordinates[xi] = [];
      }
    }

    for (xi = 0; xi < dryBoard.size; xi++) {
      for (yi = 0; yi < dryBoard.size; yi++) {
        if (existsSecondLast) {
          dryBoard._secondLastCoordinates[xi][yi] = this._secondLastCoordinates[xi][yi];
        }
        if (existsLast) {
          dryBoard._lastCoordinates[xi][yi] = this._lastCoordinates[xi][yi];
        }

        dryBoard._coordinates[xi][yi] = this._coordinates[xi][yi];
      }
    }

    return dryBoard;
  };

  Board.prototype._isRecapturingKoimmediately = function() {
    var x, y;

    if (this._secondLastCoordinates == null) {
      return false;
    }

    for (x = 0; x < this.size; x++) {
      for (y = 0; y < this.size; y++) {
        if (this._coordinates[x][y] !== this._secondLastCoordinates[x][y]) {
          return false;
        }
      }
    }

    return true;
  };

  Board.prototype._capture = function(x, y, myStone) {
    var stone;
    var searched = [];
    var xi, yi;
    var coords = [],
      coords1 = [],
      coords2 = [],
      coords3 = [],
      coords4 = [];
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

    if (!this.searchSpace(this._correctCoordinate(x - 1), y, stone, searched, coords1)) {
      coords = coords1.concat();
    }
    if (!this.searchSpace(x, this._correctCoordinate(y - 1), stone, searched, coords2)) {
      coords = coords.concat(coords2);
    }
    if (!this.searchSpace(this._correctCoordinate(x + 1), y, stone, searched, coords3)) {
      coords = coords.concat(coords3);
    }
    if (!this.searchSpace(x, this._correctCoordinate(y + 1), stone, searched, coords4)) {
      coords = coords.concat(coords4);
    }

    for (i = 0; i < coords.length; i++) {
      coord = coords[i];
      this._coordinates[coord.x][coord.y] = null;
    }

    return coords;
  };

  Board.prototype.searchSpace = function(xx, yy, myStone, searched, coords) {
    if (searched[xx][yy]) {
      return false;
    }

    if (this._coordinates[xx][yy] == null) {
      return true;
    }

    searched[xx][yy] = true;

    if (this._coordinates[xx][yy].equals(myStone)) {
      coords.push({x: xx, y: yy});
      if (this.searchSpace(this._correctCoordinate(xx - 1), yy, myStone, searched, coords)) return true;
      if (this.searchSpace(xx, this._correctCoordinate(yy - 1), myStone, searched, coords)) return true;
      if (this.searchSpace(this._correctCoordinate(xx + 1), yy, myStone, searched, coords)) return true;
      if (this.searchSpace(xx, this._correctCoordinate(yy + 1), myStone, searched, coords)) return true;
    }

    return false;
  };

  Board.prototype._isSurroundedByEnemy = function(x, y, myStone) {
    var searched = [];
    var xi, yi;
    var coords = [];

    for (xi = 0; xi < this.size; xi++) {
      searched[xi] = [];
      for (yi = 0; yi < this.size; yi++) {
        searched[xi][yi] = false;
      }
    }

    return !this.searchSpace(x, y, myStone, searched, coords);
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

