define(function(require) {
  "use strict";

  var GameService = require('app/client/app/service/GameService');
  var EventEmitter = require('lib/eventemitter2');

  var GameMediator = function() {
    EventEmitter.call(this);

    // TODO: ファクトリメソッドを使うようにする
    this._gameService = new GameService();
  };

  GameMediator.prototype = Object.create(EventEmitter.prototype);

  GameMediator.prototype.startGame= function(condition) {
    this._GameService.newGame(condition);
  };

  GameMediator.prototype.clickCanvasLeft = function() {
  };

  GameMediator.prototype.pass = function() {
    this._gameService.pass();
  };

  return GameMediator;
});

