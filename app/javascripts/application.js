//= require "jquery"
//= require "underscore"
//= require "talker"

$(function() {
  
  $("div.flash").click(function() {
    $(this).remove();
    return false;
  });

  window.setTimeout(function(){
    $("#invite_talker_team").click(function(){
      $('#invitees').val('gary@talkerapp.com\nmacournoyer@talkerapp.com\n' + $('#invitees').val());
    });
    $('#invitees').focus(); 
  }, 10);
  
  
  $('#room_name').click(function() {
    $('#rooms').toggle();
    $(this).find('span.switch_rooms').toggleClass('hide_rooms').toggleClass('show_rooms');
  })
  
  if ($.browser.safari){
    $('#rooms_controller.show input.search').css('width', '100%')
  }
  
});

