define(function(require) {
  "use strict";

  var main = function() {};
  main.prototype = {
    start: function() {
      var fieldView = new(require('app/client/FieldView'));
      var field = new(require('app/client/Field'));

      fieldView.init();
      field.init(9);

      field.startUp();
    }
  };

  return main;
});

