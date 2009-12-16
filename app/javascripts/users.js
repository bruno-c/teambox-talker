// Pass timezone offset from the browser to backend using a magic cookie
$.cookie("tzoffset", (new Date()).getTimezoneOffset());

String.prototype.retardedHash = function() {
  var start = 0;
  for (var i = 0; i < this.length; i++){
    start += this.charCodeAt(i);
  }
  return parseInt(start);
}

function assetHost(path) {
  var domain = "talkerapp.com";
  var id = path.retardedHash() % 4;
  return "//assets" + id + "." + domain + path;
}

function avatarUrl(user, size) {
  size = size || 18;
  return assetHost("/avatar/" + MD5(user.email || "") + ".jpg?s=" + size);
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