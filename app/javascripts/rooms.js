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
  if ($("a#upload")[0]) {
    new AjaxUpload('upload', {
      action: $("#upload").attr("href"),
      closeConnection: "/close_connection",
      name: "upload",
      responseType: "json",
      onSubmit: function() {
        $("#upload").hide();
        $("#upload_loader").show();
      },
      onComplete: function(file, response) {
        $("#upload").show();
        $("#upload_loader").hide();
        if (response.error) {
          alert("Error uploading file: " + response.error);
        } else {
          Talker.sendMessage(response.url);
        }
      }
    });
  }
  
});