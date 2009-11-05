Talker.EmoticonsFormatter = function() {
  var self = this;

  self.onPostFormatMessage = function(event){
    _.each(Talker.emoticons, function(emoticon){
      emoticon.findAndReplace($('#log p:last').get(0));
    });
  }
};

Talker.Emoticon = function(regexp, path, meaning){
  var self = this;
  
  self.regexp = regexp;
  self.path = path;
  self.meaning = meaning;
  
  self.replacementString = '<img src="' 
      + self.path 
      + '" class="emoticons" height="16" width="16" alt="' 
      + self.regexp.toString()
      + '" title="' 
      + self.meaning + '"  />';
  
  self.findAndReplace = function(domElement){
    findAndReplace(self.regexp, self.replacementString, domElement);
  }
  return self;
}

if (!Talker.emoticons){
  Talker.emoticons = [];
}
Talker.emoticons.push(new Talker.Emoticon('>:-*\\)',          "/images/icons/smiley-evil.png",    "evil"));
Talker.emoticons.push(new Talker.Emoticon(/:-*\)\)/gi,        "/images/icons/smiley-lol.png",     "laughing"));
Talker.emoticons.push(new Talker.Emoticon(/:-*\)/g,           "/images/icons/smiley.png",         "smiling"));
Talker.emoticons.push(new Talker.Emoticon(/:-*D/g,            "/images/icons/smiley-grin.png",    "grin"));
Talker.emoticons.push(new Talker.Emoticon(/X-*\(/gi,          "/images/icons/smiley-mad.png",     "angry"));
Talker.emoticons.push(new Talker.Emoticon(/:-*\(/g,           "/images/icons/smiley-sad.png",     "sad"));
Talker.emoticons.push(new Talker.Emoticon(/;-*\(/g,           "/images/icons/smiley-cry.png",     "cry"));
Talker.emoticons.push(new Talker.Emoticon(/B-*\)/g,           "/images/icons/smiley-cool.png",    "cool"));
Talker.emoticons.push(new Talker.Emoticon(/:-*[S|\/]/gi,      "/images/icons/smiley-confuse.png", "confused"));
Talker.emoticons.push(new Talker.Emoticon(/:-*O/gi,           "/images/icons/smiley-eek.png",     "shocked"));
Talker.emoticons.push(new Talker.Emoticon(/:-*P/gi,           "/images/icons/smiley-razz.png",    "razz"));

