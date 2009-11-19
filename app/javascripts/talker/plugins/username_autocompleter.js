Talker.UsernameAutocompleter = function(){
  var self = this;
  var currentCycle = null;
  var tab = false;
  
  $('#msgbox').
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
      // TODO ignore non-printable keys, space, arrows, backspace, etc.
      
      var position = $('#msgbox').getCaretPosition();
      var value = $('#msgbox').val();
      var nameStart = value.lastIndexOf("@", position);
    
      if (nameStart != -1 && value.lastIndexOf(" ", position) < nameStart) {
        nameStart = nameStart + 1
        var nameEnd = value.indexOf(" ", position);
        if (nameEnd == -1) nameEnd = position;
      
        var pattern = value.substring(nameStart, nameEnd);
        var users = findUsers(pattern);
        var name = nextUserName(users);
        if (name) var completion = name.substring(pattern.length);
        if (tab && users.length == 2) { // HACK should == 1, Talker.getRoomUsernames returns duplicates
          $('#msgbox').insertAtCaret(completion + " ").
                       setCaretPosition(position + completion.length + 1);
        } else {
          $('#msgbox').insertAtCaret(completion).
                       setCaretPosition(position, position + completion.length);
        }
      }
    });
  
  function findUsers(pattern) {
    return _.select(Talker.getRoomUsernames(), function(name) { return name.match("^" + pattern); });
  }
  
  function nextUserName(usernames, reverse) {
    // TODO remove current user
    // var users = _.reject(usernames, function(user) {
    //   return user == Talker.currentUser.name;
    // });
    var users = usernames;
    
    users = (reverse ? users.reverse() : users);
    
    if (currentCycle == null || _.indexOf(users, currentCycle) == users.length - 1) {
      return currentCycle = users[0];
    } else {
      return currentCycle = users[_.indexOf(users, currentCycle) + 1];
    }
  };
}