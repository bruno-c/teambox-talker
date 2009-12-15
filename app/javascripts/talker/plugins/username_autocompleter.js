Talker.UsernameAutocompleter = function(){
  var self = this;
  
  Talker.getMessageBox().autocompleter("@", function() {
    return _reject(Talker.getRoomUsernames(), function(name){
      return name === Talker.currentUser.name
    });
  });
}