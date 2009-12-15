Talker.CommandAutocompleter = function(){
  var self = this;
  
  Talker.getMessageBox().autocompleter("/", function(pattern) {
    return _.select(Talker.getCommands(), function(name) { return name.match("^" + pattern); })
  }, {startOnly:true});
}