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
  
  $("div#guest_access").
    find(".enable a").
      click(function() {
        var link = $(this);
        $.post(this.href, function(data) {
          $("#guest_url").text(data.url);
          link.parent().hide().next(".disable").show();
        }, "json");
        return false;
      }).
    end().
    find(".disable a").
      click(function() {
        var link = $(this);
        $.post(this.href, function() {
          link.parent().hide().prev(".enable").show();
        });
        return false;
      }).
    end();
    
});