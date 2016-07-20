define(function(require) {
  "use strict";

  var main = function() {};
  main.prototype = {
    start: function() {
      var fieldView = new(require('FieldView'));
      var field = new(require('Field'));

      fieldView.init();
      field.init(9);

      field.startUp();
    }
  };

  return main;
});

