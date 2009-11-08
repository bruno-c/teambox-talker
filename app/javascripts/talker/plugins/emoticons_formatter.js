Talker.EmoticonsFormatter = function() {
  var self = this;

  self.onAfterMessageReceived = function(event){
    _.each(Talker.emoticons, function(emoticon){
      var element = Talker.Logger.lastRow().find('p:last').get(0);
      emoticon.findAndReplace(element);
    });
  }
};

Talker.Emoticon = function(matchers, path, meaning){
  var self = this;
  
  self.strings = matchers ;
  self.path = path;
  self.meaning = meaning;
  
  self.findAndReplace = function(domElement){
    _.each(self.strings, function(string){
     $(domElement).findAndReplace(string, self.replacementString(string));
    });
  }
  
  self.replacementString = function(string){
    return '<img src="' 
        + self.path 
        + '" class="emoticons" height="16" width="16" alt="' 
        + string
        + '" title="' 
        + self.meaning + '"  />';
  }
  
  return self;
}

if (!Talker.emoticons){
  Talker.emoticons = [];
}

Talker.emoticons.push(new Talker.Emoticon(['>:-)', '>:)'],            "/images/icons/smiley-evil.png",    "evil"));
Talker.emoticons.push(new Talker.Emoticon([':-))', ':))'],            "/images/icons/smiley-lol.png",     "laughing"));
Talker.emoticons.push(new Talker.Emoticon([':-)',  ':)'],             "/images/icons/smiley.png",         "smiling"));
Talker.emoticons.push(new Talker.Emoticon([':-D'],                    "/images/icons/smiley-grin.png",    "grin"));
Talker.emoticons.push(new Talker.Emoticon(['X(', 'X-('],              "/images/icons/smiley-mad.png",     "angry"));
Talker.emoticons.push(new Talker.Emoticon([':(', ':-('],              "/images/icons/smiley-sad.png",     "sad"));
Talker.emoticons.push(new Talker.Emoticon([';(', ';-('],              "/images/icons/smiley-cry.png",     "cry"));
Talker.emoticons.push(new Talker.Emoticon(['B)', 'B-)', '8)', '8-)'], "/images/icons/smiley-cool.png",    "cool"));
Talker.emoticons.push(new Talker.Emoticon([':S', ':-S'],              "/images/icons/smiley-confuse.png", "confused"));
Talker.emoticons.push(new Talker.Emoticon([':O', ':-O'],              "/images/icons/smiley-eek.png",     "shocked"));
Talker.emoticons.push(new Talker.Emoticon([':P', ':-P'],              "/images/icons/smiley-razz.png",    "razz"));
// 
