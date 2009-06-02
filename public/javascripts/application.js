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