// FF cannot be smart enough to fire onscroll event in the right order.
// the good news is that FF does provide mousedown and mouseup events when you touch the scrollbars.
// so for Safari we use the canScroll variable to determine wether or not to enabled/disabled the autoscrolling.
// in FF we will disable autoscroll if scrolling occurs between mousedown and mouseup events... provided the user
// hasn't scrolled to the bottom of the page.
Talker.Scroller = function() {
  var self = this;
  var scrollLimit = 50;
  
  self.scrollingWithScript = false;
  
  self.scrollToBottom = function(forceScroll){
    if (self.shouldScrollToBottom() || forceScroll){
      self.scrollNudge();
    }
  }
  
  self.scrollNudge = function(amount){
    window.scrollBy(0, (amount || 500000));
  }
  
  $(window).mousewheel(function(event, delta) {
    self.allowScrollingToBottom = (self.getWindowHeight() + self.getScrollOffset() - self.getScrollHeight()) == 0;
  });
  
  self.shouldScrollToBottom = function(){
    return self.allowScrollingToBottom;
  }
  
  self.atBottom = function(){
    return self.getWindowHeight() + self.getScrollOffset() - self.getScrollHeight() > 0
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
  
  self.onJoin =
  self.onLeave =
  self.onMessageReceived = 
  self.onInsertion = // also called when an image is loaded
  self.onAfterMessageReceived = function(event) {
    self.scrollToBottom();
  }
  
  self.onLoaded = 
  self.onMessageSent = function(event) {
    self.scrollToBottom(true);
  }
}