Talker.TwitterStatuses = function() {
  var self = this;

  self.onAfterMessageReceived = function(event){
    var last_insertion = Talker.Logger.lastRow();
    var twitter_status_expression = /https*:\/\/twitter.com\/\w+\/status\/(\d+)/i;
    var last_anchor = last_insertion.find('a');
    var last_href = last_anchor.attr('href') || '';
    
    if (last_href.match(twitter_status_expression)){
      var id = last_href.match(twitter_status_expression)[1];
      var url = 'http://twitter.com/statuses/show/' + id + '.json?callback=?';
      
      $.getJSON(url, function(data){
        last_insertion.find('a').html($('<q/>').css({
          clear: 'both',
          float: 'left'
        }).append(
          $('<img/>').attr({src: data.user.profile_image_url, height: 48, width: 48})
          .css('margin', '4px')
        ).append('"' + data.text + '"'));
      });
    }
  }
  
};
