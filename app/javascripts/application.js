//= require "jquery"
//= require "underscore"
//= require "talker"

$(function() {
  
  $("div.flash").click(function() {
    $(this).remove();
    return false;
  });
  
  if ($("#invitees")[0]) {
    window.setTimeout(function(){ $('#invitees').focus(); }, 10);
  }
  
  if ($.cookie("browser_warn") != 1 && ($.browser.msie && $.browser.version[0] < 7) || $.browser.opera) {
    $.cookie("browser_warn", 1);
    $.facebox("<h3>Talker is not supported in this browser.</h3>"+
              "<p>It's possible (and probable) that you'll experience various issues using Talker with this browser.</p>"+
              "<p>Please report any problem to our <a href='http://talker.tenderapp.com/'>support site</a>.</p>");
  }
  
});