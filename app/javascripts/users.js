// Pass timezone offset from the browser to backend using a magic cookie
$.cookie("tzoffset", (new Date()).getTimezoneOffset());

$(function() {

  $("#people input.admin, #people input.suspended").click(function () {
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

function avatarUrl(user, size) {
  size = size || 16;
  return "/avatar/" + MD5(user.email || "") + ".jpg?s=" + size;
}