define(function(require) {
  "use strict";

  /**
   * @param {Number} color
   */
  var Stone = function(color) {
    if (color !== 0 && color !== 1) {
      throw new Error("Color must be Black(1) or White(2).");
    }

    this._color = color;
  };

  Stone.prototype = {};

  Object.defineProperties(Stone.prototype, {
    id: {
      get: function() { return this._color;  },
      configurable: false,
    },
  });

  Stone.prototype.equals = function(o) {
    if (!(o instanceof Stone)) {
      return false;
    }

    return this.color === o.color;
  }

  Stone.Black = new Stone(0);
  Stone.White = new Stone(1);

  return Stone;
});

