class FixTwitterStatusPluginDoubleInsertion < ActiveRecord::Migration
  def self.up
    p = Plugin.find_by_name('Twitter Statuses')
    p.source = <<-EOS
plugin.onMessageInsertion = function(event){
  var twitter_status_expression = /https*:\\/\\/twitter.com\\/\\w+\\/statuse?s?\\/(\\d+)/i;
  var last_anchor = Talker.getLastInsertion().find('a');

  var last_href = last_anchor.attr('href') || '';

  if (twitter_status_expression.test(last_href)){
    var id = last_href.match(twitter_status_expression)[1];
    var url = 'http://twitter.com/statuses/show/' + id + '.json?callback=?';
    
    if (last_anchor.hasClass('transformed')){
      return true; // Do not transform the link a second time.
    }
    
    $.getJSON(url, function(data){
      if (!last_anchor.hasClass('transformed')){
        last_anchor.html($('<q/>').css({
          clear: 'both',
          float: 'left'
        }).append(
          $('<img/>').attr({src: data.user.profile_image_url, height: 48, width: 48})
          .css('margin', '4px')
        ).append('"' + data.text + '"')).addClass('transformed'); // tag as tranformed so we don't do it again
      }
    });
  }
}
EOS
    p.save
  end

  def self.down
    p = Plugin.find_by_name('Twitter Statuses')
    p.source = <<-EOS
plugin.onMessageInsertion = function(event){
  var last_insertion = Talker.getLastRow();
  var twitter_status_expression = /https*:\\/\\/twitter.com\\/\\w+\\/statuses\\/(\\d+)/i;
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
EOS
    p.save
  end
end
