//= require "jquery"
//= require "underscore"
//= require "talker"

$(function() {
  
  $("div.flash").click(function() {
    $(this).remove();
    return false;
  });

  $("#invite_talker_team").click(function(){
    $('#invitees').val('gary@talkerapp.com\nmacournoyer@talkerapp.com\n' + $('#invitees').val());
  });
  window.setTimeout(function(){ $('#invitees').focus(); }, 10);
  
});