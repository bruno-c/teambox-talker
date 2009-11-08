// replaces strings
jQuery.fn.findAndReplace = function(string, replacement, options) {
  function innerfindAndReplace(node, string) {
    var skip = 0;
    if (node.nodeType == 3) {
      var pos = node.data.toUpperCase().indexOf(string);
      if (pos >= 0) {
        var spannode = document.createElement('span');
        var middlebit = node.splitText(pos);
        var endbit = middlebit.splitText(string.length);
        var replacementSpan = document.createElement('span');
        replacementSpan.innerHTML = replacement;
        spannode.appendChild(replacementSpan);
        middlebit.parentNode.replaceChild(spannode, middlebit);
        skip = 1;
      }
    } else if (node.nodeType == 1 && node.childNodes && !/(script|style|pre)/i.test(node.tagName)) {
      for (var i = 0; i < node.childNodes.length; ++i) {
        i += innerfindAndReplace(node.childNodes[i], string);
      }
    }
    return skip;
  }
  
  return this.each(function() {
    innerfindAndReplace(this, string.toUpperCase());
  });
};