// Pass timezone offset from the browser to backend using a magic cookie
$.cookie("tzoffset", (new Date()).getTimezoneOffset());

function avatarUrl(user, size) {
  size = size || 18;
  return "/avatar/" + MD5(user.email || "") + ".jpg?s=" + size;
}

$(function() {
  $("#permissions #user_admin").change(function() {
    if (this.checked) { // admin
      $("#room_access input").attr("checked", true).attr("disabled", true);
    } else {
      $("#room_access input").removeAttr("disabled");
    }
  }).trigger("change");
});