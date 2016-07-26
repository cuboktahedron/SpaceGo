define(function(require) {
  "use strict";

  // Constants
  var Constants = require('Constants');
  var StoneType = Constants.StoneType;

  // Dispatchers
  var FD = require('FrontDispatcher');
  var BD = require('BackDispatcher');

  var Field = function() {};
  Field.prototype = {
    init: function(size) {
      var that = this;
      var x, y;
      this._size = size;
      this._phase = StoneType.Black;
      this._field = [];
      this._center = { x: Math.floor(size / 2), y: Math.floor(size / 2) };

      for (x = 0; x < size; x++) {
        this._field[x] = [];
        for (y = 0; y < size; y++) {
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
            center: $.extend({}, that._center),
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

        that._center.x = (that._size + pl.grabInfo.center.x - dx) % that._size;
        that._center.y = (that._size + pl.grabInfo.center.y - dy) % that._size;

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
            center: $.extend({}, that._center),
          });
        }
      });
    },

    startUp: function() {
      this._emitRefreshAll();
    },

    _toLocalPosition: function(pl) {
      var x, y;
      var block = pl.unit * this._size;

      // to main board coord
      x = (pl.x - pl.margin + block) % block;
      y = (pl.y - pl.margin + block) % block;

      // to local coord
      x = Math.round(x / pl.unit),
      y = Math.round(y / pl.unit),

      // slide center
      x = (this._center.x - (Math.floor(this._size / 2)) + x + this._size) % this._size;
      y = (this._center.y - (Math.floor(this._size / 2)) + y + this._size) % this._size;

      return {
        x: x,
        y: y,
      };
    },

    /**
     * @param pos {Object} Put position. This is main board of it.
     *     {
     *       x: {number}
     *       y: {number}
     *     }
     */
    _putStone: function(pos) {
      if (this._canPutStone(pos)) {
        this._field[pos.x][pos.y] = this._phase;
        this._switchTurn();
        this._capture();

        // TEST: move center
//        this._center.x = (this._center.x + 1) % this._size;
//        this._center.y = (this._center.y + 1) % this._size;

        this._emitRefreshAll();
      }
    },

    _canPutStone: function(pos) {
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
    },

    _isOuterField: function(pos) {
      return pos.x < 0 || pos.x >= this._size || pos.y < 0 || pos.y >= this._size;
    },

    _isSurrounded: function(pos) {
      // TODO: not implemented
      return false;
    },

    _capture: function() {
      // TODO: not implemented
      return false;
    },

    _switchTurn: function() {
      if (this._phase == StoneType.Black) {
        this._phase = StoneType.White;
      } else {
        this._phase = StoneType.Black;
      }
    },

    _emitRefreshAll: function() {
        BD.emit('refreshAll', {
          field: {
            center: this._center,
            size: this._size,
            stones: this._field,
          }
        });
    },
  };

  return Field;
});

