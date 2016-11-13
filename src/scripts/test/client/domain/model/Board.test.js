define(function(require) {

  var Stone = require('app/client/domain/model/Stone');
  var Board = require('app/client/domain/model/Board');
  var BoardUtil;

  describe('Board', function() {
    it("returns size", function() {
      var board = new Board(5);
      assert.equal(board.size, 5);
    });

    it("allows putting stone", function() {
      var board = new Board(5);

      assert.equal(board.putStone(1, 1, Stone.Black), 0);
      assert.equal(board.putStone(1, 2, Stone.White), 0);
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

    it("rejects putting stone at suicide point", function() {
      var N = null;
      var B = Stone.Black;
      var W = Stone.White;

      var board = BoardUtil.setupBoard([
        [ N, W, W, W ],
        [ W, N, W, N ],
        [ N, W, W, W ],
        [ W, W, N, W ],
      ]);

      assert.isFalse(board.canPutStone(0, 0, B));
      assert.isFalse(board.canPutStone(1, 1, B));
      assert.isFalse(board.canPutStone(3, 1, B));
      assert.isFalse(board.canPutStone(0, 2, B));
      assert.isFalse(board.canPutStone(2, 3, B));
    });

    it("rejects recapturing ko immediately", function() {
      var N = null;
      var B = Stone.Black;
      var W = Stone.White;

      var board = BoardUtil.setupBoard([
        [ N, N, N, N ],
        [ N, W, B, N ],
        [ W, N, N, B ],
        [ N, W, B, N ],
      ]);

      board.putStone(1, 2, B);
      assert.equal(board.putStone(2, 2, W), 1);
      assert.equal(board.putStone(1, 2, B), -1);
    });

    it("captures enemy stones", function() {
      var N = null;
      var B = Stone.Black;
      var W = Stone.White;

      var board = BoardUtil.setupBoard([
        [ N, W, N, W ],
        [ W, N, B, N ],
        [ W, B, W, B ],
        [ W, B, W, B ],
      ]);

      assert.equal(board.putStone(2, 0, B), 2);
    });
  });

  BoardUtil = {};
  BoardUtil.setupBoard = function(boardData) {
    var board = new Board(boardData.length);
    var x, y;

    for (x = 0; x < board.size; x++) {
      for (y = 0; y < board.size; y++) {
        if (boardData[y][x] == null) {
          continue;
        }

        if (board.putStone(x, y, boardData[y][x]) === -1) {
          throw new Error("Invalid boardData passed.");
        }
      }
    }

    return board;
  };
});

