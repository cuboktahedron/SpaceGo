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
        that._putStone(pl);
      });
    },

    startUp: function() {
      BD.emit('refreshAll', {
        field: {
          center: this._center,
          size: this._size,
          stones: this._field,
        }
      });
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

        BD.emit('refreshAll', {
          field: {
            center: this._center,
            size: this._size,
            stones: this._field,
          }
        });
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
  };

  return Field;
});

