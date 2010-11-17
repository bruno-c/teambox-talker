Talker.FeedFormatter = function() {
  var self = this;

  var template = '\
    <small class="timestamp"><@= FormatHelper.formatDate(published) @></small> \
    <a href="http://<@=  @>/" class="favicon"> \
      <img src="//<@= h(source) @>/favicon.ico" /> \
    </a> \
    <a href="<@= h(url) @>" class="title"> \
      <@= h(author) @>: <@= h(title) @> \
      <b class="fade"><!----></b> \
    </a> \
    <b class="content_tail"><!----></b> \
    <pre class="content"><@= h(content) @></pre>';
  
  self.onMessageReceived = function(event) {
    if (event.feed) {
      Talker.insertMessage(event, _.template(template, event.feed));
      Talker.getLastRow().addClass("feed");
      return false;
    }
  }
};
