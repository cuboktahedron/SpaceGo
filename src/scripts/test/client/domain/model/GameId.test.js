define(function(require) {

  var GameId = require('app/client/domain/model/GameId');

  describe('GameId', function() {
    it("equals self", function() {
      var id = new GameId(1);
      assert.isTrue(id.equals(id));
    });

    it("equals another GameId with save value", function() {
      var id = new GameId(1);
      var id2= new GameId(1);
      assert.isTrue(id.equals(id2));
    });

    it("doesn't equals another GameId with save value", function() {
      var id = new GameId(1);
      var id2= new GameId(2);
      assert.isFalse(id.equals(id2));
    });

    it("doesn't equals value of another Type", function() {
      var id = new GameId(1);
      assert.isFalse(id.equals({ id: 1 }));
    });
  });
});

