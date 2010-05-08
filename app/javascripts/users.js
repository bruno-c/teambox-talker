// Pass timezone offset from the browser to backend using a magic cookie
$.cookie("tzoffset", (new Date()).getTimezoneOffset());

String.prototype.assetHash = function() {
  var start = 0;
  for (var i = 0; i < this.length; i++){
    start += this.charCodeAt(i);
  }
  return parseInt(start);
}

function assetHost(path) {
  var domain = "talkerapp.com";
  var id = path.assetHash() % 4;
  return "//assets" + id + "." + domain + path;
}

function avatarUrl(user, size) {
  size = size || 18;
  return assetHost("/avatar/" + MD5(user.email || "") + ".jpg?s=" + size);
}

$(function() {
  $("#room_access_private, #room_access_public").change(function() {
    var privateAccess = $("#room_access_private")[0].checked;
    if (privateAccess) {
      $("#invitees").show();
    } else {
      $("#invitees").hide();
    }
  }).trigger("change"); 
});
