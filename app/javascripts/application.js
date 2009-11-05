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
});