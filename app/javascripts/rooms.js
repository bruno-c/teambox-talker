$(function() {
  // Hide sidebar
  $('#sidebar .toggle_sidebar').click(function(e) {
    $('#sidebar #room, #sidebar #utilities, #sidebar .logo').toggle();
    $('#main, #message_form, #sidebar .toggle_sidebar').toggleClass('expanded');
    Talker.trigger("Resize");
  });
  $('#message_form .form_help').click(function(e) {
    // This may need some refactoring, duplication with app/javascripts/talker/plugins/help_command.js
    var help_div = $('<div/>').addClass('small');
    $(help_div).append($('<h3/>').html("Help"));
    $(help_div).append($('<p/>').html('If you need a hand with anything send us an <a href="mailto:help@talkerapp.com">email</a>.'));
    $(help_div).append($('<br/>'))
    $(help_div).append($('<h4/>').html("Available commands:"));
    _.each(Talker.getCommandsAndUsage(), function(cmd_usage) {
      $(help_div).append($('<blockquote/>').css({'padding': '3px', 'font-size': 'small', 'font-family': 'monospace'}).html(cmd_usage[1]));
    });
    jQuery.facebox(help_div);
  });

  // Room name dropdown
  $('#rooms_controller.show #room_name').click(function(e) {
    $('#rooms').toggle();
    $(this).find('span.switch_rooms').toggleClass('hide_rooms').toggleClass('show_rooms');
    e.stopPropagation();
  });
  
  $(document).click(function(e){
    $('#rooms_controller.show #rooms').hide();
    $('#rooms_controller.show #room span.switch_rooms').removeClass('show_rooms').addClass('hide_rooms');
  });
  
  // File Upload
  if ($('#upload')[0]){
    new AjaxUpload('#upload', {
      action: $('a#upload').attr('href'),
      name: 'upload',
      responseType: 'json',
      onComplete: function(file, response) {
        $("#upload").show();
        $("#upload_loader").hide();
        if (response.error) {
          alert("Error uploading file: " + response.error);
        } else {
          Talker.sendMessage(response.url);
        }
      },
      onSubmit: function() {
        if ($.browser.safari){
          $.get("/close_connection", {async: false});
        }
        $("#upload").hide();
        $("#upload_loader").show();
      }
    });
  }
  
  $("div#guest_access a").
    live("click", function() {
      var link = $(this);
      link.hide();
      $("#guest_access_loader").show();
      $.post(this.href, function() {
        if (link.hasClass("enable"))
          var action = "enabled";
        else
          var action = "disabled";
        Talker.sendAction(action + " guest access", {update:true});
      });
      return false;
    });
  
  $("input#guest_url").live("click", function() {
    this.select();
  });
});