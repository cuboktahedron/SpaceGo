define(function(require) {

  var FD = require('app/client/FrontDispatcher');
  var BD = require('app/client/BackDispatcher');

  before(function() {
    FD.removeAllListeners();
    BD.removeAllListeners();
  });

  describe('Field', function() {
    var Field = require('app/client/Field');
    it('inits field', function() {
      var field = new Field();
      field.init({
        size: 5,
      });
      assert.equal(field.size, 5);
    });

    it('does not moves center', function() {
      var field = new Field();
      field.init({
        size: 5,
      });

      FD.emit('pan', {
        dx: -9,
        dy: 9,
        grabInfo: {
          center: {
            x: 2, y: 2
          }
        },
        unit: 10,
      });

      assert.deepEqual(field.center, { x: 2, y: 2 });
    });

    it('moves center', function() {
      var field = new Field();
      field.init({
        size: 5,
      });

      FD.emit('pan', {
        dx: -11,
        dy: 25,
        grabInfo: {
          center: {
            x: 2, y: 2
          }
        },
        unit: 10,
      });

      assert.deepEqual(field.center, { x: 3, y: 0 });
    });

    it('moves center with up-left overflow', function() {
      var field = new Field();
      field.init({
        size: 5,
      });

      FD.emit('pan', {
        dx: 20,
        dy: 10,
        grabInfo: {
          center: {
            x: 0, y: 0
          }
        },
        unit: 10,
      });

      assert.deepEqual(field.center, { x: 3, y: 4 });
    });

    it('moves center with down-right overflow', function() {
      var field = new Field();
      field.init({
        size: 5,
      });

      FD.emit('pan', {
        dx: -20,
        dy: -10,
        grabInfo: {
          center: {
            x: 4, y: 4
          }
        },
        unit: 10,
      });

      assert.deepEqual(field.center, { x: 1, y: 0 });
    });

    it('emits refreshAll after move center', function() {
      var field = new Field();
      field.init({
        size: 5,
      });

      BD.on('refreshAll', function() {
        assert.isTrue(true);
      });

      FD.emit('pan', {
        dx: 0,
        dy: 0,
        grabInfo: {
          center: {
            x: 0, y: 0
          }
        },
        unit: 10,
      });
    });
  });
});

