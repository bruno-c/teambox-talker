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
});