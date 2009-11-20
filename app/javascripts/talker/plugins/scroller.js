// FF cannot be smart enough to fire onscroll event in the right order.
// the good news is that FF does provide mousedown and mouseup events when you touch the scrollbars.
// so for Safari we use the canScroll variable to determine wether or not to enabled/disabled the autoscrolling.
// in FF we will disable autoscroll if scrolling occurs between mousedown and mouseup events... provided the user
// hasn't scrolled to the bottom of the page.
Talker.Scroller = function() {
  var self = this;
  self.scrollAmount = 0;
  
  self.scrollToBottom = function(){
    if (self.scrollAmount){
      window.scrollBy(0, self.scrollAmount);
    }
  }
  
  $(window).mousewheel(function(event, delta) {
    if (delta > 0){
      self.disableAutoScrolling();
    } else if (self.atBottom()) {
      self.enableAutoScrolling();
    }
  });

  if ($.browser.mozilla){
    $(document).mousedown(function(e) {
      self.disableAutoScrolling()
    }).mouseup(function(e) {
      if (self.atBottom()){
        self.enableAutoScrolling();
      }
    });
  }
  
  self.shouldScrollToBottom = function(){
    return self.allowScrollingToBottom;
  }
  
  self.atBottom = function(){
    return self.getWindowHeight() + self.getScrollOffset() - self.getScrollHeight() >= 0;
  }
  
  self.getWindowHeight = function(){
    return window.innerHeight || document.body.clientHeight
  }
  
  self.getScrollOffset = function(){
    return window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
  }
  
  self.getScrollHeight = function(){
    return Math.max(document.documentElement.offsetHeight, document.body.scrollHeight);
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