Talker.HelpCommand = function() {
  var self = this;
  
  self.command = 'help';
  self.usage = '/help';
  
  self.onCommand = function(event) {
    if (event.command == "help") {
      var help_div = $('<div/>').addClass('small');
      
      $(help_div).append($('<h3/>').html("Help"));
      $(help_div).append($('<p/>').html('If you need a hand with anything send us an <a href="mailto:help@talkerapp.com">email</a>.'));
      $(help_div).append($('<br/>'))
      $(help_div).append($('<h4/>').html("Available commands:"));
      _.each(Talker.getCommandsAndUsage(), function(cmd_usage) {
        $(help_div).append($('<blockquote/>').css({'padding': '3px', 'font-size': 'small', 'font-family': 'monospace'}).html(cmd_usage[1]));
      });
      jQuery.facebox(help_div);
      
      Talker.getMessageBox().val('');
      return false;
    }
  }
}
