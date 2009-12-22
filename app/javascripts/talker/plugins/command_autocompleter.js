Talker.CommandAutocompleter = function(){
  var self = this;
  
  Talker.getMessageBox().autocompleter("/", Talker.getCommands, {startOnly:true});
}