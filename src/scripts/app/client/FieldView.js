define(function(require) {
  "use strict";

  // Constants
  var Constants = require('Constants');
  var MouseButton = Constants.View.MouseButton;
  var StoneType = Constants.StoneType;

  // Dispatchers
  var FD = require('FrontDispatcher');
  var BD = require('BackDispatcher');

  var FieldView = function() {};
  FieldView.prototype = {
    init: function() {
      this._$canvas = $('#field');
      this._canvas = $('#field')[0];
      this._$backCanvas = $('#back-field');
      this._backCanvas = $('#back-field')[0];
      this._ctx = this._canvas.getContext('2d');
      this._backCtx = this._backCanvas.getContext('2d');
      this._baseCanvasSize = { x: 748, y: 748 };
      this._height = this._canvas.width;
      this._width = this._canvas.height;

      var that = this;
      BD.on('refreshAll', function(payload) {
        that._refreshAll(payload);
      });

      var grabInfo;
      BD.on('grab', function(pl) {
        that._$canvas.addClass('grabbing');
        grabInfo = pl;
      });

      BD.on('hoverOnStone', function() {
        that._$canvas.removeClass('grabbing');
        that._$canvas.addClass('grabbable');
      });

      BD.on('hoverOnNone', function(pl) {
//        that._hoverOnNone(pl);
        that._$canvas.removeClass('grabbable');
        that._$canvas.removeClass('grabbing');
      });

      $(document).mouseup(function(e) {
        var unit = 44;
        var margin = 198;

        if (e.which !== MouseButton.Left) {
          return;
        }

        if (that._$canvas.hasClass('grabbing')) {
          that._$canvas.removeClass('grabbing');
          return;
        }

        FD.emit('putStone', {
          x: Math.floor(e.offsetX / that._canvasRatio),
          y: Math.floor(e.offsetY / that._canvasRatio),
          margin: margin,
          unit: unit,
        });
      });

      var previousMouseMove = Date.now();
      this._$canvas.mousemove(function(e) {
        var unit = 44;
        var margin = 198;

        if (Date.now() - previousMouseMove > 50) {
          if (that._$canvas.hasClass('grabbing')) {
            FD.emit('pan', {
              unit: unit,
              grabInfo: grabInfo,
              dx: Math.floor(e.offsetX / that._canvasRatio) - grabInfo.x,
              dy: Math.floor(e.offsetY / that._canvasRatio) - grabInfo.y,
            });
          } else {
            FD.emit('hover', {
              x: Math.floor(e.offsetX / that._canvasRatio),
              y: Math.floor(e.offsetY / that._canvasRatio),
              margin: margin,
              unit: unit,
            });
          }

          previousMouseMove = Date.now();
        }
      });

      this._$canvas.mousedown(function(e) {
        var unit = 44;
        var margin = 198;

        if (e.which !== MouseButton.Left) {
          return;
        }

        FD.emit('touch', {
          x: Math.floor(e.offsetX / that._canvasRatio),
          y: Math.floor(e.offsetY / that._canvasRatio),
          margin: margin,
          unit: unit,
        });
      });

      $(window).resize(function(e) {
        var rect = that._canvas.getBoundingClientRect();
        that._canvasRatio = rect.width / that._baseCanvasSize.x;
      }).trigger('resize');
    },

    _refreshAll: function(pl) {
      this._clearBoard(this._backCtx);
      this._clearBoard(this._ctx);
      this._writeBoard(pl);
      this._writeStars(pl);
      this._writeStones(pl);

      var unit = 44;
      var halfUnit = unit / 2;
      var margin = 198;
      var unit4 = unit * 4;
      var unit5 = unit * 5;
      var unit8 = unit * 8;
      var unit9 = unit * 9;

      this._ctx.save();
      this._ctx.globalAlpha = 0.4;
      this._ctx.fillStyle = 'rgb(0, 255, 255)';
      this._ctx.fillRect(0, 0, this._width, this._height);
      this._ctx.restore();

      this._ctx.save();
      this._ctx.globalAlpha = 0.7;

      // left-up
      this._ctx.drawImage(this._backCanvas, margin + unit5 - halfUnit, margin + unit5 - halfUnit, unit4, unit4, 0, 0, unit4, unit4);

      // right-up
      this._ctx.drawImage(this._backCanvas, margin - halfUnit, margin + unit5 - halfUnit, unit4, unit4, margin + unit8 + halfUnit, 0, unit4, unit4);

      // left-down
      this._ctx.drawImage(this._backCanvas, margin + unit5 - halfUnit, margin - halfUnit, unit4, unit4, 0, margin + unit8 + halfUnit, unit4, unit4);

      // right-down
      this._ctx.drawImage(this._backCanvas, margin - halfUnit, margin - halfUnit, unit4, unit4, margin + unit8 + halfUnit, margin + unit8 + halfUnit, unit4, unit4);

      // up
      this._ctx.drawImage(this._backCanvas, margin - halfUnit, margin + unit5 - halfUnit, unit9, unit4, margin - halfUnit, 0, unit9, unit4);

      // left
      this._ctx.drawImage(this._backCanvas, margin + unit5 - halfUnit, margin - halfUnit, unit4, unit9, 0, margin - halfUnit, unit4, unit9);

      // down
      this._ctx.drawImage(this._backCanvas, margin - halfUnit, margin - halfUnit, unit9, unit4, margin - halfUnit, margin + unit8 + halfUnit, unit9, unit4);

      // right
      this._ctx.drawImage(this._backCanvas, margin - halfUnit, margin - halfUnit, unit4, unit9, margin + unit8 + halfUnit, margin - halfUnit, unit4, unit9);

      this._ctx.restore();
      this._ctx.drawImage(this._backCanvas, margin - halfUnit, margin - halfUnit, unit9, unit9, margin - halfUnit, margin - halfUnit, unit9, unit9);
    },

    _clearBoard: function(ctx) {
      ctx.fillStyle = 'rgb(64, 64, 64)';
      ctx.fillRect(0, 0, this._width, this._height);
    },

    _writeBoard: function(pl) {
      var c = this._backCtx;
      var x, y;
      var unit = 44;
      var halfUnit = unit / 2;
      var margin = 198;

      c.beginPath();
      c.strokeStyle = 'rgb(255, 255, 255)';
      c.lineWidth = 3;
      for (x = 0; x < pl.field.size; x++) {
        c.moveTo(unit * x + margin, margin - halfUnit);
        c.lineTo(unit * x + margin, this._height - margin + halfUnit);
      }

      for (y = 0; y < pl.field.size; y++) {
        c.moveTo(margin - halfUnit,               unit * y + margin);
        c.lineTo(this._width - margin + halfUnit, unit * y + margin);
      }

      c.closePath();
      c.stroke();
    },

    _writeStars: function(pl) {
      var c = this._backCtx;
      var i;
      var x, y;
      var xx, yy;
      var unit = 44;
      var margin = 198;
      var stars = [
        { x: 2, y:2 },
        { x: 4, y:4 },
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
      var c = this._backCtx;
      var x, y;
      var xx, yy;
      var unit = 44;
      var margin = 198;

      c.lineWidth = 3;

      for (x = 0; x < pl.field.size; x++) {
        for (y = 0; y < pl.field.size; y++) {
          xx = (pl.field.size + Math.floor(pl.field.size / 2) + x - pl.field.center.x) % pl.field.size;
          yy = (pl.field.size + Math.floor(pl.field.size / 2) + y - pl.field.center.y) % pl.field.size;

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

