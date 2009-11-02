Talker.Notifier = function(){
  var self = this;
  
  self.enabled = false;
  
  var dom_element, on_focus, on_blur;
  
  if ($.browser.mozilla) {
    dom_element = document, on_focus = "focus", on_blur = "blur";
  } else if ($.browser.msie) {
    dom_element = document, on_focus = "focusin", on_blur = "focusout";
  } else { // safari and others
    dom_element = window, on_focus = "focus", on_blur = "blur";
  }
  

  $(dom_element)
    .bind(on_focus, function(e){
      Talker.trigger("Focus");
      self.enabled = false;
    })
    .bind(on_blur, function(){ 
      Talker.trigger("Blur");
      self.enabled = true;
    });
  
  self.onJoin = 
  self.onLeave = 
  self.onMessageReceived = function(event) {
    if (self.enabled) Talker.trigger("Notification", event);
  }
}