define(function(require) {
  "use strict";

  // Constants
  var Constants = require('Constants');
  var StoneType = Constants.StoneType;

  // Dispatchers
  var FD = require('FrontDispatcher');
  var BD = require('BackDispatcher');

  var FieldView = function() {};
  FieldView.prototype = {
    init: function() {
      this._$canvas = $('#field');
      this._canvas = $('#field')[0];
      this._ctx = this._canvas.getContext('2d');
      this._height = this._canvas.width;
      this._width = this._canvas.height;

      var that = this;
      BD.on('refreshAll', function(payload) {
        that._refreshAll(payload);
      });

      this._$canvas.click(function(e) {
        var unit = 45;
        var margin = 204;

        FD.emit('putStone', {
          x: e.offsetX,
          y: e.offsetY,
          margin: margin,
          unit: unit,
        });
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
      var i;
      var x, y;
      var xx, yy;
      var unit = 45;
      var margin = 204;
      var stars = [
        { x: 2, y:2 },
        { x: 6, y:2 },
        { x: 4, y:4 },
        { x: 2, y:6 },
        { x: 6, y:6 },
      ]

      c.fillStyle = 'rgb(255, 255, 255)';
      for (i = 0; i < stars.length; i++) {
        x = stars[i].x;
        y = stars[i].y;
        xx = (pl.field.size + Math.floor(pl.field.size / 2) + x - pl.field.center.x) % pl.field.size;
        yy = (pl.field.size + Math.floor(pl.field.size / 2) + y - pl.field.center.y) % pl.field.size;

        c.beginPath();
        c.arc(xx * unit + margin, yy * unit + margin, 6, 0, Math.PI * 2, true);
        c.fill();
        c.closePath();
      }
    },

    _writeStones: function(pl) {
      var c = this._ctx;
      var x, y;
      var xx, yy;
      var unit = 45;
      var margin = 204;

      c.lineWidth = 3;

      for (x = 0; x < pl.field.size; x++) {
        for (y = 0; y < pl.field.size; y++) {
          xx = (pl.field.size + Math.floor(pl.field.size / 2) + x - pl.field.center.x) % pl.field.size;
          yy = (pl.field.size + Math.floor(pl.field.size / 2) + y - pl.field.center.y) % pl.field.size;

          console.log(StoneType.Black);
          if (pl.field.stones[x][y] === StoneType.Black) {
            c.beginPath();
            c.strokeStyle = 'rgb(255, 255, 255)';
            c.fillStyle = 'rgb(0, 0, 0)';
            c.arc(xx * unit + margin, yy * unit + margin, 20, 0, Math.PI * 2, true);
            c.stroke();
            c.fill();
            c.closePath();
          } else if (pl.field.stones[x][y] === StoneType.White) {
            c.beginPath();
            c.strokeStyle = 'rgb(0, 0, 0)';
            c.fillStyle = 'rgb(255, 255, 255)';
            c.arc(xx * unit + margin, yy * unit + margin, 20, 0, Math.PI * 2, true);
            c.stroke();
            c.fill();
            c.closePath();
          }
        }
      }
    },
  };

  return FieldView;
});

