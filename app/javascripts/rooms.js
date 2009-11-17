$(function() {
  // Room name dropdown
  $('#room_name').click(function() {
    $('#rooms').toggle();
    $(this).find('span.switch_rooms').toggleClass('hide_rooms').toggleClass('show_rooms');
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