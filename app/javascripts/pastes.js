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

Talker.Paste.Updater = function(editor) {
  var self = this;
  
  self.onMessageReceived = function(event) {
    // Do not apply local diff
    if (event.user.id == Talker.currentUser.id) return false;
    
    var attribs = createAttributions(event.content);
    editor.applyChangesToBase(attribs.changeset, event.user.id.toString(),
                              { numToAttrib: attribs.pool });
  };
  
  self.onJoin = function(event) {
    
  };
};