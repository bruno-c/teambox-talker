// Simulate HTML5 placeholder attribute behaviour
$(function() {
  if (!$.browser.safari) {
    $("input[type=text], input[type=search]").
      focus(function() { 
        if ($(this).val() == $(this).attr('placeholder')) {
          $(this).val('').removeClass("placeholder");
        }
      }).
      blur(function() {
        if ($(this).val() == '' || $(this).val() == $(this).attr('placeholder')) {
          $(this).addClass("placeholder").val($(this).attr('placeholder'));
        } 
      }).
      trigger("blur");
  }
});