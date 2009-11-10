Talker.ImageFormatter = function() {
  var self = this;
  
  self.onMessageReceived = function(event){
    var image_expression = /(^https?:\/\/[^\s]+\.(?:gif|png|jpeg|jpg)$)/gi;
    var image_match = event.content.match(image_expression);
    
    if ($('#talker_image_preloading_div').length == 0){
      $("<div/>").attr('id', 'talker_image_preloading_div')
        .css({position:'absolute', top: '-100px', left: '-100px', height: '100px', width: '100px', overflow: 'hidden'})
        .appendTo(document.body);
    }
    
    if (image_match){
      var fallback = $('<a/>').attr('href', image_match[0]).attr('target', '_blank').html(image_match[0]);
      Talker.Logger.insertContent(event, fallback);
      Talker.trigger('Insertion', event);
      
      var img = $('<img/>').load(function(){
        $(this).remove();
        
        fallback.replaceWith(
              '<a href="' 
            + image_match[0]
            + '" target="_blank"><img src="' 
            + image_match[0]
            + '" style="max-height: 300px; max-width: ' + Talker.Logger.maximumContentWidth() + ';" />'
            + '</a>'
        );
        
        Talker.trigger('Insertion', event);
      });
    
      $('#talker_image_preloading_div').append(
        img.attr('src', image_match[0])
      );

      return false;
    }
  }
  
  self.onResize = function() {
    var maxWidth = Talker.Logger.maximumContentWidth();
    
    $("#log img[class!='avatar']").each(function(){
      $(this).css({'max-width': 'auto'});
      $(this).css({'max-width': maxWidth + 'px'});
    });
  }
};
