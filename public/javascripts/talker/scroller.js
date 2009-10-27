function Scroller(options){
  var self = this;
  
  self.options = {
    scrollLimit: 85
  };
  
  self.options = $.extend(self.options, options);
  
  self.scrollToBottom = function(forceScroll){
    if (self.shouldScrollToBottom() || forceScroll){
      window.setTimeout(function(){
        window.scrollTo(0, self.getWindowHeight() + self.getScrollHeight());
      }, 10);
    }
  }
  
  self.shouldScrollToBottom = function(){
    return (self.getWindowHeight() + self.getScrollOffset() - self.getScrollHeight() + self.options.scrollLimit) > 0
  }
  
  self.getWindowHeight = function(){
    return window.innerHeight || document.body.clientHeight
  }
  
  self.getScrollOffset = function(){
    return window.pageYOffset || document.documentElement.scrollTop  || document.body.scrollTop
  }
  
  self.getScrollHeight = function(){
    return Math.max(document.documentElement.offsetHeight, document.body.scrollHeight)
  }
}