Talker.ClearCommand = function() {
  var self = this;
  
  self.command = 'clear';
  self.usage = '/clear';

  self.onCommand = function(event){
    if (event.command == 'clear') {
      Talker.insertNotice({user: {name: ''}, content: 'Last clear occured at this point.'});
      while($('#log tr').length > 1) {
        $('#log tr:first').remove();
      }
      $('#msgbox').val('');
      return false;
    }
  }
}