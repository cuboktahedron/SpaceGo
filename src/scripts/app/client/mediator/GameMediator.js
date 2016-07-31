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
    var gameState = this._gameService.newGame(condition);

    this.emit('refreshAll', gameState);
  };

  GameMediator.prototype.putStone = function(x, y) {
    var gameState = this._gameService.putNextStone(x, y);
    if (gameState != null) {
      this.emit('refreshAll', gameState);
    }
  };

  GameMediator.prototype.mouseUpLeftOnBoard = function(data) {

  };

  GameMediator.prototype.pass = function() {
    var gameState = this._gameService.pass();
  };

  return GameMediator;
});

