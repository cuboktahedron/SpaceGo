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
      this._writeBoard(pl);
      this._writeStars(pl);
      this._writeStones(pl);
    },

    _writeBoard: function(pl) {
      var c = this._ctx;
      var x, y;
      var unit = 45;
      var margin = 204;

      c.fillStyle = 'rgb(0, 0, 0)';
      c.fillRect(0, 0, this._width, this._height);

      c.beginPath();
      c.strokeStyle = 'rgb(255, 255, 255)';
      c.lineWidth = 3;
      for (x = 0; x < pl.field.size; x++) {
        c.moveTo(unit * x + margin, margin);
        c.lineTo(unit * x + margin, this._height - margin);
      }

      for (y = 0; y < pl.field.size; y++) {
        c.moveTo(margin,               unit * y + margin);
        c.lineTo(this._width - margin, unit * y + margin);
      }

      c.closePath();
      c.stroke();
    },

    _writeStars: function(pl) {
      var c = this._ctx;
      var x, y;
      var unit = 45;
      var margin = 204;
    },

    _writeStones: function(pl) {
      var c = this._ctx;
      var x, y;
      var unit = 45;
      var margin = 204;

      c.strokeStyle = 'rgb(255, 255, 255)';
      c.fillStyle = 'rgb(0, 0, 0)';
      c.lineWidth = 3;

      for (x = 0; x < pl.field.size; x++) {
        for (y = 0; y < pl.field.size; y++) {
          c.beginPath();
          c.arc(x * unit + margin, y * unit + margin, 20, 0, Math.PI * 2, true);
          c.stroke();
          c.fill();
          c.closePath();
        }
      }
    },
  };

  return FieldView;
});

