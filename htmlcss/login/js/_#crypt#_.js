/* _crypt_.js
 * 通过http://tool.chinaz.com/js.aspx js混淆加密后得到crypt.js
 */
function mc(c){
  ret = "";
  var hexchars = "0123456789ABCDEF";
  if(c == ' '.charCodeAt()) {
    ret = "+";
  } else if ((c < '0'.charCodeAt() && c != '-'.charCodeAt() && c != '.'.charCodeAt()) ||
      (c < 'A'.charCodeAt() && c > '9'.charCodeAt()) ||
      (c > 'Z'.charCodeAt() && c < 'a'.charCodeAt() && c != '_'.charCodeAt()) ||
      (c > 'z'.charCodeAt())) {
    ret = "%";
    ret += hexchars.charAt(c >> 4);
    ret += hexchars.charAt(c & 15);
  } else {
    ret = String.fromCharCode(c);
  }
  return ret;
}

function m(ch) {
  return (((ch & 1) << 7)|((ch & (0x2)) << 5)|((ch & (0x4)) << 3)|((ch & (0x8)) << 1)|((ch & (0x10)) >> 1)|((ch & (0x20)) >> 3)|((ch & (0x40)) >> 5)| ((ch & (0x80)) >> 7));
}

function md6(str) {
  var s="";
  var ii = 0xbb;
  for (i = 0; i < str.length; i++) {
    ii = m(str.charCodeAt(i))^ (0x35^(i&0xff));
    var ss = ii.toString(16);
    s += mc(ii);
  };
  return s;
}