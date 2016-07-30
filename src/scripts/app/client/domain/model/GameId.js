define(function(require) {
  "use strict";

  /**
   * @param {String} id
   */
  var GameId = function(id) {
    this._id = id;
  };

  GameId.prototype = {};

  Object.defineProperties(GameId.prototype, {
    id: {
      get: function() { return this._id;  },
      configurable: false,
    },
  });

  GameId.prototype.equals = function(o) {
    if (!(o instanceof GameId)) {
      return false;
    }

    return this.id === o.id;
  }

  return GameId;
});

