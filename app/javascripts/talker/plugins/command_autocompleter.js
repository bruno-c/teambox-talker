Talker.CommandAutocompleter = function(){
  var self = this;
  
  self.current_cycle_command = null;
  
  $('#msgbox').keydown(function(e){
    if ($('#msgbox').getCaretPosition() == 1 && $('#msgbox').val().substring(0, 1) == '/'){
      if (e.which == 9) { // tab
        var command = self.nextCommand();
        $('#msgbox').insertAtCaret(command);
        $('#msgbox').setCaretPosition(1, command.length + 1)
        e.preventDefault();
      }
      
      if (e.which == 32) { // space
        $('#msgbox').insertAtCaret($('#msgbox').getSelectedText() + ' ');
        e.preventDefault();
      }
    }
  });
  
  self.nextCommand = function() {
    var commands = Talker.getCommands();
    
    if (self.current_cycle_command == null || _.indexOf(commands, self.current_cycle_command) == commands.length - 1) {
      return self.current_cycle_command = commands[0];
    } else {
      return self.current_cycle_command = commands[_.indexOf(commands, self.current_cycle_command) + 1];
    }
  };
}