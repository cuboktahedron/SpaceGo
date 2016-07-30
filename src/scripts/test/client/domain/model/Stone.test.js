define(function(require) {

  var Stone = require('app/client/domain/model/Stone');

  describe('White Stone', function() {
    it("equals White", function() {
      assert.isTrue(Stone.White.equals(Stone.White));
    });

    it("doesn't equals Black", function() {
      assert.isTrue(Stone.White.equals(Stone.Black));
    });
  });

  describe('Black Stone', function() {
    it("equals Black", function() {
      assert.isTrue(Stone.Black.equals(Stone.White));
    });

    it("doesn't equals White", function() {
      assert.isTrue(Stone.Black.equals(Stone.White));
    });
  });
});

