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
  });
  
  
  // search input fixes for various browsers.
  if ($.browser.safari) {
    $('#rooms_controller.show input.search').css('width', '100%')
  }
  
  if ($.browser.mozilla) {
    $('input[placeholder]').each(function(){
      $(this).data('original_color', $(this).css('color'));
      
      if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')){
        $(this).val($(this).attr('placeholder')).css('color', '#CCC');
      }
      
      $(this).focus(function(){
        $(this).css('color', $(this).data('original_color')).val($(this).val() == $(this).attr('placeholder') ? '' : $(this).val());
      }).blur(function() {
        if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')){
          $(this).css('color', '#CCC').val($(this).attr('placeholder'));
        } else {
          $(this).css('color', $(this).attr('original_color'));
        }
      })
    });
  }
  
  $('#toggle_extras').click(function() {
    var expanded_src = '/images/icons/toggle.png';
    var normal_src = '/images/icons/toggle-expand.png';
    
    $('#toggle_extras').attr('src', $('#toggle_extras').attr('src') == expanded_src ? normal_src : expanded_src );
    $('#log_links').slideToggle(100, 'swing');
  })
});