define(function(require) {

  var Game = require('app/client/domain/model/Game');
  var GameId = require('app/client/domain/model/GameId');
  var GameCondition = require('app/client/domain/model/GameCondition');
  var Stone = require('app/client/domain/model/Stone');

  describe('Game', function() {
    it("returns game id", function() {
      var condition = new GameCondition({
        boardSize: 5,
      });
      var game = new Game(new GameId(1), condition);

      assert.isTrue(game.id.equals(new GameId(1)));
    });

    it("switch phase when put stone", function() {
      var condition = new GameCondition({
        boardSize: 5,
      });
      var game = new Game(new GameId(1), condition);

      assert.isTrue(game.phase.equals(Stone.Black));
      assert.isTrue(game.putNextStone(1, 1));
      assert.isTrue(game.phase.equals(Stone.White));
      assert.isTrue(game.putNextStone(1, 2));
      assert.isTrue(game.phase.equals(Stone.Black));
    });

    it("switch phase when pass", function() {
      var condition = new GameCondition({
        boardSize: 5,
      });
      var game = new Game(new GameId(1), condition);

      assert.isTrue(game.phase.equals(Stone.Black));
      game.pass();
      assert.isTrue(game.phase.equals(Stone.White));
      game.pass();
      assert.isTrue(game.phase.equals(Stone.Black));
    });
  });
});

