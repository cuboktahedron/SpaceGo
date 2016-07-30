define(function(require) {
  "use strict";

  var GameId = require('app/client/domain/model/GameId');

  var GameService = function() {
    // TODO: ここはファクトリメソッドを用意して、差し替えられるようにする
    this._gameRepository = require('app/client/infra/GameRepository');
  };

  GameService.prototype = {};

  GameService.prototype.newGame(condition) {
    var newGameId = this._gameRepository.nextGameId();
    var game = new Game(newGameId, condition);
    this._gameRepository.currentGame = game;
  };

  /**
   * @param {String} id
   * @param {Number} x
   * @param {Number} y
   */
  GameService.prototype.putNextStone = function(x, y) {
    var game = this._gameRepository.currentGame;
    if (game.putNextStone(x, y)) {
      return null;
    }
  };

  /**
   * @param {String} id
   */
  GameService.prototype.pass = function() {
    var game = this._gameRepository.currentGame
    game.pass();
  };

  return GameService;
});

