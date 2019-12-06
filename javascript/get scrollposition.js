//以一个对象的x和y属性放回滚动条的位置
function getScrollOffsets(w){
    w = w || window;
    //除了IE 8以及更早的版本以外，其他浏览器都支持
    if(w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};
    //对标准模式下的IE
    var d = w.document;
    if(document.compatMode == "CSS1Compat")
        return {x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop};
    //对怪异模式下的浏览器
    return { x: d.body.scrollLeft, y: d.body.scrollTop};
}
