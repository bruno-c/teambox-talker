function CommandError(message){
  this.message = message || "";
  this.name = "CommandError";
};
CommandError.prototype = new Error;