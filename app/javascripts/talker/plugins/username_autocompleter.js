Talker.UsernameAutocompleter = function(){
  var self = this;
  
  Talker.getMessageBox().autocompleter("@", function(pattern) {
    var regexp = new RegExp("^" + pattern, "i");
    var names = _.select(Talker.getRoomUsernames(), function(name) { return name.match(regexp); });
    // Remove current user name
    names = _.reject(names, function(name) { return name === Talker.currentUser.name });
    return names;
  });
}