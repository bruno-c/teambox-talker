// Pass timezone offset from the browser to backend using a magic cookie
$.cookie("tzoffset", (new Date()).getTimezoneOffset());

$(function() {

  $("#people input.admin, #people input.suspended").click(function () {
    var self = $(this);
    var url = self.parents("form")[0].action;
    var state = this.name;
    var loader = self.parents(".content").find(".loader");
    
    loader.show();
    $.ajax({
      type: "POST",
      url: url,
      data: "_method=put&" + state + "=" + (this.checked ? "1" : "0"),
      complete: function() { loader.hide() },
      error: function() {
        alert("Failed to update this user. Refresh and try again");
      }
    });
  });

});

function avatarUrl(user, size) {
  size = size || 18;
  return "/avatar/" + MD5(user.email || "") + ".jpg?s=" + size;
}