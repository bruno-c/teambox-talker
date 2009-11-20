// FF cannot be smart enough to fire onscroll event in the right order.
// the good news is that FF does provide mousedown and mouseup events when you touch the scrollbars.
// so for Safari we use the canScroll variable to determine wether or not to enabled/disabled the autoscrolling.
// in FF we will disable autoscroll if scrolling occurs between mousedown and mouseup events... provided the user
// hasn't scrolled to the bottom of the page.
Talker.Scroller = function() {
  var self = this;
  self.scrollAmount = 0;
  self.js_initiated_scroll = false;
  
  self.scrollToBottom = function(force){
    if (force){
      self.forcing = true;
      window.scrollBy(0, self.scrollAmount = 500000);
      self.forcing = false;
    }
    if (self.scrollAmount){
      self.js_initiated_scroll = false;
      window.scrollBy(0, self.scrollAmount);
      self.js_initiated_scroll = true;
    }
  }
  
  $(window).mousewheel(function(event, delta) {
    if (delta > 0){
      self.disableAutoScrolling();
    } else if (self.atBottom()) {
      self.enableAutoScrolling();
    }
  });

  if ($.browser.mozilla) {
    $(document).mousedown(function(e) {
      self.disableAutoScrolling()
    }).mouseup(function(e) {
      if (self.atBottom()){
        self.enableAutoScrolling();
      }
    });
  } else if ($.browser.safari) {
    $(window).scroll(function(e) {
      if (self.js_initiated_scroll && self.atBottom()) {
        self.enableAutoScrolling();
      } else {
        if (self.forcing){ return }
        self.disableAutoScrolling();
      }
    })
  }
  
  self.atBottom = function(){
    return $(window).height() - $(document).height() + $(window).scrollTop() >= 0;
  }
  
  self.scrollInterval = window.setInterval(function(){
    self.scrollToBottom();
  }, 10);
  
  self.enableAutoScrolling = function(){
    self.scrollAmount = 500000;
  }
  
  self.disableAutoScrolling = function(){
    self.scrollAmount = 0;
  }
  
  self.enableAutoScrolling();
  
  self.onJoin =
  self.onLeave =
  self.onNoticeInsertion =
  self.onMessageInsertion = function(event) {
    self.scrollToBottom();
  }
  
  self.onLoaded = 
  self.onMessageSent = function(event) {
    self.scrollToBottom(true);
  }
}