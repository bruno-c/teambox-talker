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
  var domain = location.host.match(/^\w+\.(.*)$/)[1];
  var id = path.retardedHash() % 4;
  return "//assets" + id + "." + domain + path;
}

function avatarUrl(user, size) {
  size = size || 18;
  return assetHost("/avatar/" + MD5(user.email || "") + ".jpg?s=" + size);
}
