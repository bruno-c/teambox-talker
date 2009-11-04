function h(string) {
  return string ? string.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;') : '';
}