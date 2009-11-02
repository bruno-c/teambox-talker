function Notifier(){
  var self = this;
  
  self.enabled = false;
  
  var dom_element, on_focus, on_blur, on_focus_handler = function(e){
    self.enabled = false;
  };
  
  if ($.browser.mozilla) {
    dom_element = document, on_focus = "focus", on_blur = "blur";
  } else if ($.browser.msie) {
    dom_element = document, on_focus = "focusin", on_blur = "focusout";
  } else { // safari and others
    dom_element = window, on_focus = "focus", on_blur = "blur";
  }
  

  $(dom_element)
  .bind(on_focus, on_focus_handler)
  .click(on_focus_handler)
  .bind(on_blur, function(){ 
    self.enabled = true;
    self.counter = 0;
  });
  
  self.push = function(data){
    if (window.notifications.notifications_support()){
      if (self.enabled){
        if (typeof self[data.type] == 'function'){
          self[data.type](data);
        // }else{
        //   console.debug("*** Notifier is unable to handle data type: (" + data.type + ") with data.");
        }
      }
    }
  }
  
  self.message = function(data){
    self.counter = self.counter + 1;
    window.notifications.notify({
      title: (data.private ? 'Private Message' : 'Message'),
      description: data.content
    });
  }
}