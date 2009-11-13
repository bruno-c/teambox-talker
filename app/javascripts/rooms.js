$(function() {
  
  $("#room a#edit").click(function() {
    $("#room").hide();
    $("#edit_room").show();
    return false;
  });
  $("#edit_room form").
    submitWithAjax().
    find("a.cancel").click(function() {
      $("#room").show();
      $("#edit_room").hide();
      return false;
    });
  
  // File Upload
  if ($("#room")[0]) {
    new AjaxUpload('upload', {
      action: $("#upload").attr("href"),
      name: "data",
      responseType: "json",
      onComplete: function(file, response) {
        alert("Upload done!");
        console.info(response);
        Talker.send(response.url);
      }
    });
  }
  
});