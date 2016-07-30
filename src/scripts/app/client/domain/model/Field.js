define(function(require) {
  "use strict";

  // Constants
  var Constants = require('app/client/Constants');
  var StoneType = Constants.StoneType;

  // Dispatchers
  var FD = require('app/client/FrontDispatcher');
  var BD = require('app/client/BackDispatcher');

  var Field = function() {};
  Field.prototype = {};

  Object.defineProperties(Field.prototype, {
    size: {
      set: function(value) { this._size = value; },
      get: function()      { return this._size;  },
    },

    center: {
      set: function(value) { this._center = value; },
      get: function()      { return this._center; },
    }
  });

  Field.prototype.init = function(setting) {
    var that = this;
    var x, y;
    this.size = setting.size;
    this._phase = StoneType.Black;
    this._field = [];
    this.center = { x: Math.floor(this.size / 2), y: Math.floor(this.size / 2) };

    for (x = 0; x < this.size; x++) {
      this._field[x] = [];
      for (y = 0; y < this.size; y++) {
        this._field[x][y] = StoneType.None;
      }
    }

    FD.on('putStone', function(pl) {
      var pos = that._toLocalPosition(pl);
      that._putStone(pos);
    });

    FD.on('touch', function(pl) {
      var pos = that._toLocalPosition(pl);
      if (that._field[pos.x][pos.y] !== StoneType.None) {
        BD.emit('grab', {
          x: pl.x,
          y: pl.y,
          center: $.extend({}, that.center),
        });
      }
    });

    FD.on('pan', function(pl) {
      var dx, dy;
      if (pl.dx < 0) {
        dx = Math.ceil(pl.dx / pl.unit);
      } else if (pl.dx > 0) {
        dx = Math.floor(pl.dx / pl.unit);
      } else {
        dx = 0;
      }

      if (pl.dy < 0) {
        dy = Math.ceil(pl.dy / pl.unit);
      } else if (pl.dy > 0) {
        dy = Math.floor(pl.dy / pl.unit);
      } else {
        dy = 0;
      }

      that.center.x = (that.size + pl.grabInfo.center.x - dx) % that.size;
      that.center.y = (that.size + pl.grabInfo.center.y - dy) % that.size;

      that._emitRefreshAll();
    });

    FD.on('hover', function(pl) {
      var pos = that._toLocalPosition(pl);
      if (that._field[pos.x][pos.y] !== StoneType.None) {
        BD.emit('hoverOnStone');
      } else {
        BD.emit('hoverOnNone', {
          x: pos.x,
          y: pos.y,
          center: $.extend({}, that.center),
        });
      }
    });
  };


  Field.prototype.startUp = function() {
    this._emitRefreshAll();
  };

  Field.prototype._toLocalPosition = function(pl) {
    var x, y;
    var block = pl.unit * this.size;

    // to main board coord
    x = (pl.x - pl.margin + block) % block;
    y = (pl.y - pl.margin + block) % block;

    // to local coord
    x = Math.round(x / pl.unit),
    y = Math.round(y / pl.unit),

    // slide center
    x = (this.center.x - (Math.floor(this.size / 2)) + x + this.size) % this.size;
    y = (this.center.y - (Math.floor(this.size / 2)) + y + this.size) % this.size;

    return {
      x: x,
      y: y,
    };
  };

    /**
     * @param pos {Object} Put position. This is main board of it.
     *     {
     *       x: {number}
     *       y: {number}
     *     }
     */
  Field.prototype._putStone = function(pos) {
    if (this._canPutStone(pos)) {
      this._field[pos.x][pos.y] = this._phase;
      this._switchTurn();
      this._capture();

      // TEST: move center
//        this.center.x = (this.center.x + 1) % this.size;
//        this.center.y = (this.center.y + 1) % this.size;

      this._emitRefreshAll();
    }
  };

  Field.prototype._canPutStone = function(pos) {
    if (this._isOuterField(pos)) {
      return false;
    }

    if (this._field[pos.x][pos.y] !== StoneType.None) {
      return false;
    }

    if (this._isSurrounded(pos)) {
      return false;
    }

    return true;
  };

  Field.prototype._isOuterField = function(pos) {
    return pos.x < 0 || pos.x >= this.size || pos.y < 0 || pos.y >= this.size;
  };

  Field.prototype._isSurrounded = function(pos) {
    // TODO: not implemented
    return false;
  };

  Field.prototype._capture = function() {
    // TODO: not implemented
    return false;
  };

  Field.prototype._switchTurn = function() {
    if (this._phase == StoneType.Black) {
      this._phase = StoneType.White;
    } else {
      this._phase = StoneType.Black;
    }
  };

  Field.prototype._emitRefreshAll = function() {
    BD.emit('refreshAll', {
      field: {
        center: this.center,
        size: this.size,
        stones: this._field,
      }
    });
  };

  return Field;
});

