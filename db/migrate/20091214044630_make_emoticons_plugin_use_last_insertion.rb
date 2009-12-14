class MakeEmoticonsPluginUseLastInsertion < ActiveRecord::Migration
  def self.up
    p = Plugin.find_by_name('Emoticons Formatter')
    p.source = <<-EOS
plugin.Emoticon = function(matcher, path, meaning){
  this.matcher = matcher;

  this.replacementString = [
    ' <img src="', path, 
    '" class="emoticons" height="16" width="16" style="position:relative; top:2px" alt="', meaning, 
    '" title="', meaning, '" /> '
  ].join('');
}

plugin.emoticons = [
  new plugin.Emoticon(/(^|\\s)>:-?\\\(($|\\s)/,       "/images/icons/smiley-evil.png",      "evil"),
  new plugin.Emoticon(/(^|\\s):-?\\)\\)($|\\s)/,      "/images/icons/smiley-lol.png",       "laughing"),
  new plugin.Emoticon(/(^|\\s):-?\\)($|\\s)/,        "/images/icons/smiley.png",           "smiling"),
  new plugin.Emoticon(/(^|\\s):-?D($|\\s)/,         "/images/icons/smiley-grin.png",      "grin"),
  new plugin.Emoticon(/(^|\\s)X-?\\(($|\\s)/,        "/images/icons/smiley-mad.png",       "angry"),
  new plugin.Emoticon(/(^|\\s):-?\\(($|\\s)/,        "/images/icons/smiley-sad.png",       "sad"),
  new plugin.Emoticon(/(^|\\s);-?\\(($|\\s)/,        "/images/icons/smiley-cry.png",       "cry"),
  new plugin.Emoticon(/(^|\\s)[B|8]-?\\)($|\\s)/,    "/images/icons/smiley-cool.png",      "cool"),
  new plugin.Emoticon(/(^|\\s):-?S($|\\s)/,         "/images/icons/smiley-confuse.png",   "confused"),
  new plugin.Emoticon(/(^|\\s):-?O($|\\s)/,         "/images/icons/smiley-eek.png",       "shocked"),
  new plugin.Emoticon(/(^|\\s):-?P($|\\s)/i,        "/images/icons/smiley-razz.png",      "razz")
];

plugin.onMessageInsertion = function(event) {
  var element = Talker.getLastInsertion();

  _.each(plugin.emoticons, function(emoticon) {
    element.replace(emoticon.matcher, emoticon.replacementString);
  });
}
EOS
    p.save
  end

  def self.down
    p = Plugin.find_by_name('Emoticons Formatter')
    p.source = <<-EOS
plugin.Emoticon = function(matcher, path, meaning){
  this.matcher = matcher;

  this.replacementString = [
    ' <img src="', path, 
    '" class="emoticons" height="16" width="16" style="position:relative; top:2px" alt="', meaning, 
    '" title="', meaning, '" /> '
  ].join('');
}

plugin.emoticons = [
  new plugin.Emoticon(/(^|\\s)>:-?\\\(($|\\s)/,       "/images/icons/smiley-evil.png",      "evil"),
  new plugin.Emoticon(/(^|\\s):-?\\)\\)($|\\s)/,      "/images/icons/smiley-lol.png",       "laughing"),
  new plugin.Emoticon(/(^|\\s):-?\\)($|\\s)/,        "/images/icons/smiley.png",           "smiling"),
  new plugin.Emoticon(/(^|\\s):-?D($|\\s)/,         "/images/icons/smiley-grin.png",      "grin"),
  new plugin.Emoticon(/(^|\\s)X-?\\(($|\\s)/,        "/images/icons/smiley-mad.png",       "angry"),
  new plugin.Emoticon(/(^|\\s):-?\\(($|\\s)/,        "/images/icons/smiley-sad.png",       "sad"),
  new plugin.Emoticon(/(^|\\s);-?\\(($|\\s)/,        "/images/icons/smiley-cry.png",       "cry"),
  new plugin.Emoticon(/(^|\\s)[B|8]-?\\)($|\\s)/,    "/images/icons/smiley-cool.png",      "cool"),
  new plugin.Emoticon(/(^|\\s):-?S($|\\s)/,         "/images/icons/smiley-confuse.png",   "confused"),
  new plugin.Emoticon(/(^|\\s):-?O($|\\s)/,         "/images/icons/smiley-eek.png",       "shocked"),
  new plugin.Emoticon(/(^|\\s):-?P($|\\s)/i,        "/images/icons/smiley-razz.png",      "razz")
];

plugin.onMessageInsertion = function(event) {
  var element = Talker.getLastRow().find('p:last');

  _.each(plugin.emoticons, function(emoticon) {
    element.replace(emoticon.matcher, emoticon.replacementString);
  });
}
EOS
    p.save
  end
end
