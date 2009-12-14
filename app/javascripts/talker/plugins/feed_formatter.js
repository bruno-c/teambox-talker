Talker.FeedFormatter = function() {
  var self = this;
  
  self.onMessageReceived = function(event) {
    if (event.feed) {
      var html = '<small class="timestamp"><%= published %></small>' +
                 '<a href="//<%= source %>" class="favicon">' +
                 '  <img src="//<%= source %>/favicon.ico" alt="<%= source %>" />' +
                 '</a>' +
                 '<a href="//<%= url %>" class="title"><%= title %></a>' +
                 '<b class="content_tail"><!----></b>' +
                 '<pre class="content"><%= content %></pre>';
      
      Talker.insertMessage(event, _.template(html, event.feed));
      Talker.getLastRow().addClass("feed");
      
      return false;
    }
  }
};
