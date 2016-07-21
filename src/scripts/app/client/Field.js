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
      var x, y;

      this._size = size;
      this._field = [];

      for (x = 0; x < size; x++) {
        this._field[x] = [];
        for (y = 0; y < size; y++) {
          this._field[x][y] = null;
        }
      }

      FD.on('putStone', this._putStone);
    },

    startUp: function() {
      BD.emit('refreshAll', {
        field: {
          size: this._size,
          stones: [
            StoneType.Black
          ],
        }
      });
    },

    _putStone: function(pl) {

      BD.emit('refreshAll', {
        field: {
          size: this._size,
        }
      });
    },
  };

  return Field;
});

