/**
* Holds a message in memory until we need to use it.
*/
function Message(options){
  this.options = {
    id: Math.uuid(),
    partial: true
  };
  $.extend(this.options, options);
  
  this.json = function(){
    JSON.encode(this.options);
  }
}