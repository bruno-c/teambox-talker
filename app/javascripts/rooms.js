$(function() {
  // Room name dropdown
  $('#rooms_controller.show #room_name').click(function(e) {
    $('#rooms').toggle();
    $(this).find('span.switch_rooms').toggleClass('hide_rooms').toggleClass('show_rooms');
    e.stopPropagation();
  });
  
  $(document).click(function(e){
    $('#rooms_controller.show #rooms').hide();
    $('#rooms_controller.show #room span.switch_rooms').removeClass('show_rooms').addClass('hide_rooms');
  });
  
  // File Upload
  // if ($('#upload')[0]){
  //   new AjaxUpload('#upload', {
  //     action: $('a#upload').attr('href'),
  //     name: 'upload',
  //     responseType: 'json',
  //     onComplete: function(response) {
  //       $("#upload").show();
  //       $("#upload_loader").hide();
  //       if (response.error) {
  //         alert("Error uploading file: " + response.error);
  //       } else {
  //         Talker.sendMessage(response.url);
  //       }
  //     },
  //     onSubmit: function() {
  //       if ($.browser.safari){
  //         $.get("/close_connection", {async: false});
  //       }
  //       $("#upload").hide();
  //       $("#upload_loader").show();
  //     }
  //   });
  // }
  $("a#upload").ajaxUpload({
    closeConnection: "/close_connection",
    onComplete: function(response) {
      $("#upload").show();
      $("#upload_loader").hide();
      if (response.error) {
        alert("Error uploading file: " + response.error);
      } else {
        Talker.sendMessage(response.url);
      }
    },
    onSubmit: function() {
      $("#upload").hide();
      $("#upload_loader").show();
    }
  });
  
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
  
  $("input#guest_url").live("click", function() {
    this.select();
  });
});