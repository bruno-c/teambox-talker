 // FF cannot be smart enough to fire onscroll event in the right order.
// the good news is that FF does provide mousedown and mouseup events when you touch the scrollbars.
// so for Safari we use the canScroll variable to determine wether or not to enabled/disabled the autoscrolling.
// in FF we will disable autoscroll if scrolling occurs between mousedown and mouseup events... provided the user
// hasn't scrolled to the bottom of the page.

Talker.MainScroller = Class.extend({
  init: function(){
    var self = this;
    
    self.defaultScrollAmount = 50000;

    self.scrollBy = function(height) {
      window.scrollBy(0, height);
    }

    self.scrollToBottom = function() {
      if (self.defaultScrollAmount !== 0){
        self.scrollBy(self.defaultScrollAmount);
      }
    }

    self.atBottom = function() {
      return !($(window).height() - $(document).height() + $(window).scrollTop());
    }

    $(window).mousewheel(function(event, delta) {
      if (delta > 0){
        self.defaultScrollAmount = 0;
      } else if (self.atBottom()) {
        self.defaultScrollAmount = 50000;
      }
    });

    self.onJoin =
    self.onLeave =
    self.onNoticeInsertion =
    self.onMessageInsertion = 
    self.onLoaded = 
    self.onResize = 
    self.onMessageSent = function(event) {
      self.scrollToBottom();
    }
  }
});

if ($.browser.safari) { // webkit akshully only browser to handle order of onscroll events properly.
  Talker.Scroller = Talker.MainScroller.extend({
    init: function() {
      var self = this;
      
      self._super(false);
      
      $(window).scroll(function(e){
        if (!self.scrollingWithJS){
          self.defaultScrollAmount = self.atBottom() ? 50000 : 0 ;
        }
      });
    },
    scrollBy: function(height) {
      var self = this;
      
      self.scrollingWithJS = true;
      window.scrollBy(0, height);
      self.scrollingWithJS = false;
    }
  });  
} else { // gecko based browsers and others
  // hack to determine wether or not we scroll from user or not uses mouse down/up to determiner it.
  // this has one drawback.  If a user has the mouse down during a call to scroll they might not scroll
  // will see if users report any issues with this.
  Talker.Scroller = Talker.MainScroller.extend({
    init: function() {
      var self = this;
      self._super(false);
      
      $(document).mousedown(function(e) {
        self.defaultScrollAmount = 0;
      }).mouseup(function(e) {
        if (self.atBottom()){
          self.defaultScrollAmount = 50000;
        }
      });
    }
  });
}
