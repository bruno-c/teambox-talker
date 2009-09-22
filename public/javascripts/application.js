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

$(function() {
  $("#users input.admin, #users input.suspended").click(function () {
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
});