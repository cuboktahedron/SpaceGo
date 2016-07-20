define(function(require) {
  "use strict";

  var FD = require('FrontDispatcher');
  var BD = require('BackDispatcher');
  var Field = function() {};
  Field.prototype = {
    init: function(size) {
      this._size = size;

      FD.on('putStone', this._putStone);
    },

    startUp: function() {
      BD.emit('refreshAll', {
      });
    },

    _putStone: function(pl) {

      BD.emit('refreshAll', {
      });
    },
  };

  return Field;
});

