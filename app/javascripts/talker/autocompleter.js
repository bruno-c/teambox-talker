(function($){
  $.fn.autocompleter = function(trigger, finder) {
    var element = $(this);
    var currentCycle = null;
    var tab = false;
    
    element.
      keydown(function(e) {
        if (e.which == 9) { // tab
          tab = true;
          e.preventDefault();
        } else {
          tab = false;
          currentCycle = null;
        }
      }).
      keyup(function(e){
        // ignore non-printable characters
        if (!tab && controlChar(e.keyCode)) return;

        var position = element.getCaretPosition();
        var value = element.val();
        var nameStart = value.lastIndexOf(trigger, position);

        if (nameStart != -1 && value.lastIndexOf(" ", position) < nameStart) {
          nameStart = nameStart + 1
          var nameEnd = value.indexOf(" ", position);
          if (nameEnd == -1) nameEnd = position;

          var pattern = value.substring(nameStart, nameEnd);
          var results = finder(pattern);
          var name = cycle(results, e.shiftKey);
          if (name) {
            var completion = name.substring(pattern.length);
            if (tab && results.length == 1) {
              element.insertAtCaret(completion + " ").
                      setCaretPosition(position + completion.length + 1);
            } else {
              element.insertAtCaret(completion).
                      setCaretPosition(position, position + completion.length);
            }
          }
        }
      });

    function controlChar(keyCode) {
      return String.fromCharCode(keyCode).match(/[^\w]/);
    };
    
    function cycle(values, reverse) {
      values = (reverse ? values.reverse() : values);

      if (currentCycle == null || _.indexOf(values, currentCycle) == values.length - 1) {
        return currentCycle = values[0];
      } else {
        return currentCycle = values[_.indexOf(values, currentCycle) + 1];
      }
    };
  }
})(jQuery);
