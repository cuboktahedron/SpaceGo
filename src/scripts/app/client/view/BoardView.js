define(function(require) {
  "use strict";

  // Constants
  var MouseButton = {
    Left: 1,
    Middle: 2,
    Right: 3,
  };
  var Stone = require('app/client/domain/model/Stone');

  // Mediator
  var GameMediator = require('app/client/mediator/GameMediator.js');

  var BoardView = function(mediator) {
    this._mediator = mediator;
    this._cachedGameState = null;

    this._init();
  };

  BoardView.prototype._init = function() {
    this._$canvas = $('#board');
    this._canvas = $('#board')[0];
    this._$backCanvas = $('#back-board');
    this._backCanvas = $('#back-board')[0];
    this._ctx = this._canvas.getContext('2d');
    this._backCtx = this._backCanvas.getContext('2d');
    this._baseCanvasSize = { x: 748, y: 748 };
    this._height = this._canvas.width;
    this._width = this._canvas.height;

    var that = this;
    this._mediator.on('refreshAll', function(gameState) {
      that._cachedGameState = gameState;
      that._refreshAll(gameState);
    });

    //      BD.on('hoverOnStone', function() {
    //        that._$canvas.removeClass('grabbing');
    //        that._$canvas.addClass('grabbable');
    //      });
    //
    //      BD.on('hoverOnNone', function(pl) {
    ////        that._hoverOnNone(pl);
    //        that._$canvas.removeClass('grabbable');
    //        that._$canvas.removeClass('grabbing');
    //      });

    //      var previousMouseMove = Date.now();
    //      this._$canvas.mousemove(function(e) {
    //        var unit = 44;
    //        var margin = 198;
    //
    //        if (Date.now() - previousMouseMove > 50) {
    //          if (that._$canvas.hasClass('grabbing')) {
    //            FD.emit('pan', {
    //              unit: unit,
    //              grabInfo: grabInfo,
    //              dx: Math.floor(e.offsetX / that._canvasRatio) - grabInfo.x,
    //              dy: Math.floor(e.offsetY / that._canvasRatio) - grabInfo.y,
    //            });
    //          } else {
    //            FD.emit('hover', {
    //              x: Math.floor(e.offsetX / that._canvasRatio),
    //              y: Math.floor(e.offsetY / that._canvasRatio),
    //              margin: margin,
    //              unit: unit,
    //            });
    //          }
    //
    //          previousMouseMove = Date.now();
    //        }
    //      });

    (function() {
      var unit = 44;
      var mouseDownOriginalOffset = null;

      that._$canvas.mousedown(function(e) {
        if (e.which !== MouseButton.Left) {
          return;
        }

        mouseDownOriginalOffset = {
          x: e.offsetX,
          y: e.offsetY,
        }

        var localPos = that._calculateLocalPosition(e.offsetX, e.offsetY);
        var cgs = that._cachedGameState;
        if (cgs.board.existsStone(localPos.x, localPos.y)) {
          that._grabBoard();
        }
      });

      that._$canvas.mouseup(function(e) {
        if (e.which !== MouseButton.Left) {
          return;
        }

        e.stopPropagation();

        if (grabCancel.call(that)) {
          return;
        }

        var offset = {
          x: e.offsetX,
          y: e.offsetY,
        };
        if (!isStrictSamePos.call(that, offset, mouseDownOriginalOffset)) {
          return;
        }

        var localPos = that._calculateLocalPosition(e.offsetX, e.offsetY);
        var cgs = that._cachedGameState;

        that._mediator.putStone(localPos.x, localPos.y);
      });

      $(document).mouseup(function(e) {
        if (e.which !== MouseButton.Left) {
          return;
        }

        grabCancel.call(that);
      });

      var grabCancel = function() {
        if (this._$canvas.hasClass('grabbing')) {
          this._$canvas.removeClass('grabbing');
          mouseDownOriginalOffset = null;
          return true;
        } else {
          return false;
        }
      };

      var isStrictSamePos = function(pos1, pos2) {
        var unit = 44;

        var x1 = Math.floor(pos1.x / this._canvasRatio);
        var y1 = Math.floor(pos1.y / this._canvasRatio);
        var x2 = Math.floor(pos2.x / this._canvasRatio);
        var y2 = Math.floor(pos2.y / this._canvasRatio);

        x1 = Math.round(x1 / unit);
        y1 = Math.round(y1 / unit);
        x2 = Math.round(x2 / unit);
        y2 = Math.round(y2 / unit);

        console.log(x1, y1, x2, y2);
        return x1 === x2 && y1 === y2;
      };
    })();

    $(window).resize(function(e) {
      var rect = that._canvas.getBoundingClientRect();
      that._canvasRatio = rect.width / that._baseCanvasSize.x;
    }).trigger('resize');
  };

  BoardView.prototype._grabBoard = function() {
    this._$canvas.removeClass('grabbable');
    this._$canvas.addClass('grabbing');
  };

  BoardView.prototype._calculateLocalPosition = function(cx, cy) {
    var unit = 44;
    var halfUnit = unit / 2;
    var margin = 176;
    var x, y;
    var cgs = this._cachedGameState;
    var block = unit * cgs.board.size;

    // to canvas coord
    x = Math.floor(cx / this._canvasRatio);
    y = Math.floor(cy / this._canvasRatio);

    // to main board coord
    x = (x - margin + block) % block;
    y = (y - margin + block) % block;

    // to local coord
    x = Math.round((x - halfUnit) / unit);
    y = Math.round((y - halfUnit) / unit);

    // slide center
    //      x = (this.center.x - (Math.floor(this.size / 2)) + x + this.size) % this.size;
    //      y = (this.center.y - (Math.floor(this.size / 2)) + y + this.size) % this.size;

    return {
      x: x,
      y: y,
    };
  };

  BoardView.prototype._refreshAll = function(gs) {
    this._clearBoard(this._backCtx);
    this._clearBoard(this._ctx);
    this._writeBoard(gs);
    this._writeStars(gs);
    this._writeStones(gs);

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
  };

  BoardView.prototype._clearBoard = function(ctx) {
    ctx.fillStyle = 'rgb(64, 64, 64)';
    ctx.fillRect(0, 0, this._width, this._height);
  };

  BoardView.prototype._writeBoard = function(gs) {
    var c = this._backCtx;
    var x, y;
    var unit = 44;
    var halfUnit = unit / 2;
    var margin = 176;

    c.beginPath();
    c.strokeStyle = 'rgb(255, 255, 255)';
    c.lineWidth = 3;
    for (x = 0; x < gs.board.size; x++) {
      c.moveTo(unit * x + halfUnit + margin, margin - halfUnit);
      c.lineTo(unit * x + halfUnit + margin, this._height - margin + halfUnit);
    }

    for (y = 0; y < gs.board.size; y++) {
      c.moveTo(margin - halfUnit,               unit * y + halfUnit + margin);
      c.lineTo(this._width - margin + halfUnit, unit * y + halfUnit + margin);
    }

    c.closePath();
    c.stroke();
  };

  BoardView.prototype._writeStars = function(gs) {
    var c = this._backCtx;
    var i;
    var x, y;
    var xx, yy;
    var unit = 44;
    var halfUnit = unit / 2;
    var margin = 176;
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
      xx = x;
      yy = y;
      //        xx = (gs.board.size + Math.floor(gs.board.size / 2) + x - gs.board.center.x) % gs.board.size;
      //        yy = (gs.board.size + Math.floor(gs.board.size / 2) + y - gs.board.center.y) % gs.board.size;

      c.beginPath();
      c.arc(xx * unit + halfUnit + margin, yy * unit + halfUnit + margin, 6, 0, Math.PI * 2, true);
      c.fill();
      c.closePath();
    }
  };

  BoardView.prototype._writeStones = function(gs) {
    var c = this._backCtx;
    var x, y;
    var xx, yy;
    var unit = 44;
    var halfUnit = unit / 2;
    var margin = 176;

    c.lineWidth = 3;

    for (x = 0; x < gs.board.size; x++) {
      for (y = 0; y < gs.board.size; y++) {
        xx = x;
        yy = y;
        //          xx = (gs.board.size + Math.floor(gs.board.size / 2) + x - gs.board.center.x) % gs.board.size;
        //          yy = (gs.board.size + Math.floor(gs.board.size / 2) + y - gs.board.center.y) % gs.board.size;

        if (gs.board.getStone(x, y) === Stone.Black) {
          c.beginPath();
          c.strokeStyle = 'rgb(255, 255, 255)';
          c.fillStyle = 'rgb(0, 0, 0)';
          c.arc(xx * unit + halfUnit + margin, yy * unit + halfUnit + margin, 20, 0, Math.PI * 2, true);
          c.stroke();
          c.fill();
          c.closePath();
        } else if (gs.board.getStone(x, y) === Stone.White) {
          c.beginPath();
          c.strokeStyle = 'rgb(0, 0, 0)';
          c.fillStyle = 'rgb(255, 255, 255)';
          c.arc(xx * unit + halfUnit + margin, yy * unit + halfUnit + margin, 20, 0, Math.PI * 2, true);
          c.stroke();
          c.fill();
          c.closePath();
        }
      }
    }
  };

  return BoardView;
});

