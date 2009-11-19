$(function() {
  // Room name dropdown
  $('#room_name').click(function(e) {
    $('#rooms').toggle();
    $(this).find('span.switch_rooms').toggleClass('hide_rooms').toggleClass('show_rooms');
    e.stopPropagation();
  });
  
  $(document).click(function(e){
    $('#rooms').hide();
    $('#room span.switch_rooms').removeClass('show_rooms').addClass('hide_rooms');
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
  
  $("div#guest_access a").
    live("click", function() {
      var link = $(this);
      link.hide();
      $("#guest_access_loader").show();
      $.post(this.href, function() {
        if (link.hasClass("enable"))
          var action = "enabled";
        else
          var action = "disabled";
        Talker.sendAction(action + " guest access", {update:true});
      });
      return false;
    });
    
});