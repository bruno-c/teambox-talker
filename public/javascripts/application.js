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
  $("input.admin").click(function () {
    var url = $(this).parents("form")[0].action;
    $.ajax({
      type: "POST",
      url: url,
      data: "_method=put&admin=" + (this.checked ? "1" : "0"),
      error: function() {
        alert("Failed to set this user as admin. Refresh and try again");
      }
    });
  });
});