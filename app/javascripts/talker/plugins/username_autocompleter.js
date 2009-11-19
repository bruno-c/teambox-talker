Talker.UsernameAutocompleter = function(){
  var self = this;
  
  $('#msgbox').autocompleter("@", function(pattern) {
    var names = _.select(Talker.getRoomUsernames(), function(name) { return name.match("^" + pattern); });
    // Remove current user name
    names = _.reject(names, function(name) { return name === Talker.currentUser.name });
    return names;
  });
}