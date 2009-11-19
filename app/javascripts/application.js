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
  
  if (!$.browser.safari && !$.browser.mozilla && $.cookie("browser_warn") != 1) {
    $.cookie("browser_warn", 1);
    $.facebox("<h3>Talker has only been tested under Safari and Firefox.</h3>"+
              "<p>It's possible (and probable) that you'll experience various issues using Talker with this browser.</p>"+
              "<p>Please report any problem to our <a href='http://talker.tenderapp.com/'>support site</a>.</p>");
  }
  
});