jQuery.ajaxSetup({ 
  beforeSend: function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
});

jQuery.fn.submitWithAjax = function(callback) {
  this.submit(function() {
    $.post(this.action, $(this).serialize(), callback, "script");
    return false;
  });
  return this;
};

// Pass timezone offset from the browser to backend using a magic cookie
$.cookie("tzoffset", (new Date()).getTimezoneOffset());

if (typeof console == 'undefined'){
  console = {};
  console.info = console.debug = console.warn = function(){ };
}

$(function() {
  $("#people input.admin, #people input.suspended").click(function () {
    var url = $(this).parents("form")[0].action;
    var state = this.name;
    
    $.ajax({
      type: "POST",
      url: url,
      data: "_method=put&" + state + "=" + (this.checked ? "1" : "0"),
      error: function() {
        alert("Failed to update this user. Refresh and try again");
      }
    });
  });
  
  $("div.flash").click(function() {
    $(this).remove();
    return false;
  });
  
  // Simulate HTML5 placeholder attribute behaviour
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

if (!Date.prototype.adjustedFromUTC){
  Date.prototype.adjustedFromUTC = function(offset_in_seconds){
    var d = new Date();
    d.setTime(d.getTime() + offset_in_seconds);
    return d;
  }
}

function getDateFromMilliseconds(milliseconds){
  var d = new Date();
  d.setTime(milliseconds);
  return d;
}
