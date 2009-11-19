Talker.CommandAutocompleter = function(){
  var self = this;
  
  $('#msgbox').autocompleter("/", function(pattern) {
    return _.select(Talker.getCommands(), function(name) { return name.match("^" + pattern); })
  });
}