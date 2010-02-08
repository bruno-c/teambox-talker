$(function() {
  $.getJSON('http://twitter.com/favorites/78322132.json?callback=?', function(tweets){
    $.each(tweets, function(i, tweet){
      var element = $('<div class="tweet"><a><img/><p><strong></strong> <span></span></p></a></div>');
      element.find("a").attr('href', 'http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id);
      element.find("img").attr('src', tweet.user.profile_image_url);
      element.find("strong").text(tweet.user.screen_name);
      element.find("span").text(tweet.text);
      element.appendTo("#tweets");
    });
  });
  
  $.getJSON('http://www.rss2json.com/rss2json?url=http://talkerapp.tumblr.com/rss&callback=?', function(data){
    $.each(data.entries, function(i, entry){
      var element = $('<p><a/></p>');
      element.find("a").attr('href', entry.link).text(entry.title);
      element.appendTo("#news");
      if (i == 4) return false;
    });
  });
});
