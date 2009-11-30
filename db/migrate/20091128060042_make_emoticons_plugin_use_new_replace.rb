class MakeEmoticonsPluginUseNewReplace < ActiveRecord::Migration
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
  var element = Talker.getLastRow().find('p:last');

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
plugin.Emoticon = function(matchers, path, meaning){
  var self = this;

  self.strings = matchers ;
  self.path = path;
  self.meaning = meaning;

  self.replacementString = function(string){
    return '<img src="' 
        + self.path 
        + '" class="emoticons" height="16" width="16" alt="' 
        + string
        + '" title="' 
        + self.meaning + '"  />';
  }

  this.findAndReplace = function(domElement){
    _.each(self.strings, function(string){
      $(domElement).findAndReplace(string, self.replacementString(string));
    });
  }
}
plugin.emoticons = [];
plugin.emoticons.push(new plugin.Emoticon(['>:-)', '>:)'],            "/images/icons/smiley-evil.png",    "evil"));
plugin.emoticons.push(new plugin.Emoticon([':-))', ':))'],            "/images/icons/smiley-lol.png",     "laughing"));
plugin.emoticons.push(new plugin.Emoticon([':-)',  ':)'],             "/images/icons/smiley.png",         "smiling"));
plugin.emoticons.push(new plugin.Emoticon([':-D'],                    "/images/icons/smiley-grin.png",    "grin"));
plugin.emoticons.push(new plugin.Emoticon(['X(', 'X-('],              "/images/icons/smiley-mad.png",     "angry"));
plugin.emoticons.push(new plugin.Emoticon([':(', ':-('],              "/images/icons/smiley-sad.png",     "sad"));
plugin.emoticons.push(new plugin.Emoticon([';(', ';-('],              "/images/icons/smiley-cry.png",     "cry"));
plugin.emoticons.push(new plugin.Emoticon(['B)', 'B-)', '8)', '8-)'], "/images/icons/smiley-cool.png",    "cool"));
plugin.emoticons.push(new plugin.Emoticon([':S', ':-S'],              "/images/icons/smiley-confuse.png", "confused"));
plugin.emoticons.push(new plugin.Emoticon([':O', ':-O'],              "/images/icons/smiley-eek.png",     "shocked"));
plugin.emoticons.push(new plugin.Emoticon([':P', ':-P'],              "/images/icons/smiley-razz.png",    "razz"));

plugin.onMessageInsertion = function(event){
  _.each(plugin.emoticons, function(emoticon){
    var element = Talker.getLastRow().find('p:last').get(0);
    emoticon.findAndReplace(element);
  });
}
EOS
    p.save
  end
end
