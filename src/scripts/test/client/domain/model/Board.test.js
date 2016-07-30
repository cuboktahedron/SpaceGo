define(function(require) {

  var Stone = require('app/client/domain/model/Stone');
  var Board = require('app/client/domain/model/Board');

  describe('Board', function() {
    it("returns size", function() {
      var board = new Board(5);
      assert.equal(board.size, 5);
    });

    it("allows putting stone", function() {
      var board = new Board(5);

      assert.isTrue(board.putStone(1, 1, Stone.Black));
      assert.isTrue(board.putStone(1, 2, Stone.White));
      assert.isTrue(board.getStone(1, 1).equals(Stone.Black));
      assert.isTrue(board.getStone(1, 2).equals(Stone.White));
    });

    it("rejects putting stone at outer point", function() {
      var board = new Board(5);

      assert.isFalse(board.canPutStone(-1,  0, Stone.Black));
      assert.isFalse(board.canPutStone( 5,  0, Stone.Black));
      assert.isFalse(board.canPutStone( 0, -1, Stone.Black));
      assert.isFalse(board.canPutStone( 0,  5, Stone.Black));
    });

    it("returns empty stone", function() {
      var board = new Board(5);

      assert.isNull(board.getStone(1, 2));
    });
  });
});

