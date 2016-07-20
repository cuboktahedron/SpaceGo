define(function(require) {
  "use strict";

  var FD = require('FrontDispatcher');
  var BD = require('BackDispatcher');
  var FieldView = function() {};
  FieldView.prototype = {
    init: function() {
      this._canvas = $('#field')[0];
      this._ctx = this._canvas.getContext('2d');
      this._height = this._canvas.width;
      this._width = this._canvas.height;

      var that = this;
      BD.on('refreshAll', function(payload) {
        that._refreshAll(payload);
      });
    },

    _refreshAll: function(pl) {
      this._ctx.fillStyle = 'rgb(0, 0, 0)';
      this._ctx.fillRect(0, 0, this._width, this._height);
    },
  };

  return FieldView;
});

