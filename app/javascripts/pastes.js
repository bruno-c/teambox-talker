Talker.Paste = {};

// Rewrite an attribution in a changeset
Talker.Paste.rewriteAttributions = function(cs, attrib, userId, first) {
  var re = new RegExp("\\*" + attrib, first ? "" : "g");
  return cs.replace(re, "*" + userId);
}
// Create an attribution pool from a changeset, extracting user ids from
// the changeset and replacing w/ indexes in the attribution pool.
Talker.Paste.createAttributions = function(cs) {
  var pool = [];
  var authors = {};
  var matches = null;
  var re = /\*(\d+)[^\d]/g;
  while (matches = re.exec(cs)) {
    var id = matches[1];
    var num = authors[id];
    if (num == null) {
      authors[id] = num = pool.length;
      pool.push(["author", id]);
    }
    cs = Talker.Paste.rewriteAttributions(cs, id, num, true);
  }
  return { changeset: cs, pool: pool };
}

Talker.userColors = {};
Talker.Paste.Updater = function(editor) {
  var self = this;
  
  self.addColor = function(userId, color) {
    Talker.userColors[userId] = color;
    editor.setAuthorInfo(userId.toString(), {bgcolor: color});
  };
  
  self.onMessageReceived = function(event) {
    // Do not apply local diff
    if (event.user.id == Talker.currentUser.id) return false;
    
    self.addColor(event.user.id.toString(), event.color);
    
    var attribs = Talker.Paste.createAttributions(event.content);
    
    try {
      editor.applyChangesToBase(attribs.changeset, event.user.id.toString(),
                                { numToAttrib: attribs.pool });
    } catch (e) {
      editor.setEditable(false);
      Talker.client.close();
      alert("Looks like your paste is out of sync with the server. Please refresh to edit this paste again.");
    }
  };
};