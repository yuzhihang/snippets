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
    //offsetTop或者getboundingrect判断元素相对body的位置
}
//
// 首先需要明确3个定义：
//
// 文档高度：整个页面的高度
//
// 可视窗口高度：你看到的浏览器可视屏幕高度
//
// 滚动条滚动高度: 滚动条下滑过的高度
//
// 当 文档高度 = 可视窗口高度 + 滚动条高度  时,滚动条正好到底。
//
//
//
// 首先在mounted中添加监听：window.addEventListener('scroll', this.scrollFn);   // 监听scroll
//
// 然后创建3个函数分别获取文档高度、可视窗口高度、滚动条高度：
//
// //文档高度
//
// getScrollTop(){
//     var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
//     if(document.body){
//         bodyScrollTop = document.body.scrollTop;
//     }
//     if(document.documentElement){
//         documentScrollTop = document.documentElement.scrollTop;
//     }
//     scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
//     return scrollTop;
// }
//
// //可视窗口高度
//
// getWindowHeight(){
//     var windowHeight = 0;
//     if(document.compatMode == "CSS1Compat"){
//         windowHeight = document.documentElement.clientHeight;
//     }
//     else{
//         windowHeight = document.body.clientHeight;
//     }
//     return windowHeight;
// }
//
// //滚动条高度
//
// getScrollHeight(){
//     var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
//     if(document.body){
//         bodyScrollHeight = document.body.scrollHeight;
//     }
//     if(document.documentElement){
//         documentScrollHeight = document.documentElement.scrollHeight;
//     }
//     scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
//     return scrollHeight;
// }
//
// 然后在scrollFn函数中判断:
//
//     scrollFn(){
//     if(this.getScrollTop() + this.getWindowHeight() == this.getScrollHeight()){
//         这里执行动态获取数据的函数
//     }
// }
//
// 最后记得销毁监听：
// 　　destroyed() {
//     window.removeEventListener('scroll', this.scrollFn); // 销毁监听
// }
//
// 如此即可实现滑动加载更多。


////================================================================

/*
*JQ的offset().top与JS的getBoundingClientRect区别详解，JS获取元素距离视窗顶部可变距离
 壹 ❀ 引

我在 JQ的offset().top与js的offsetTop区别详解 这篇博客中详细分析了JQ方法offset().top与JS属性offsetTop的区别，并得出了一条offset().top = offsetTop - scrollTop的结论，不过此结论只适用于监听元素滚动条，而window的滚动条并不满足。那么在滚动window滚动条时如何获取元素距离视窗顶部的距离呢，这就不得说说本文的主角getBoundingClientRect方法。

 贰 ❁ 关于getBoundingClientRect()

我们可以先拷贝下面的代码，动手起来跟着操作一遍，印象会深刻，需要引入JQ，这里提供一个静态资源地址，进去搜索JQ直接复制地址引入即可：

复制代码
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="css/demo.css">
</head>
<body>
    <div class="child"></div>
</body>
<script src="https://cdn.staticfile.org/jquery/3.4.1/jquery.js"></script>
<script src="js/app.js"></script>
</html>
复制代码
复制代码
* {
    padding: 0;
    margin: 0;
    list-style: none;
    outline: none;
}

.child {
    margin-top: 200px;
    margin-left: 200px;
    height: 200px;
    width: 200px;
    background: #bbded6;
    border: 5px solid #8ac6d1;
}
复制代码
复制代码
// JS getBoundingClientRect()
let child = document.querySelector('.child');
console.log(child.getBoundingClientRect());

//JQ offset()
// let son = $('.child');
// son.offset();

// JS offsetTop
// child.offsetTop;
复制代码
这里我们在页面定义了一个宽高各200px且包含5px边框的盒子，由于没设置box-size = ’border-box'属性，所以盒子总宽高为210px，这里我们直接打印出getBoundingClientRect方法结果，如下：



可以看到getBoundingClientRect()返回了一个 DOMRect 对象，该对象包含了元素多个属性，其中最显眼的width与height毫无悬念就是元素宽高，除此之外还包含top，bottom，right，left与x，y属性。

不难猜出，top和left为元素左上顶点距离视窗顶端与左侧距离，而right与bottom为右下顶点距离视窗左侧与顶端距离。而x与left一致，y与top一致。



现在修改代码，将css中的margin-top修改为1000px，同时使用scroll事件打印getBoundingClientRect的top值与滚动条距离，其它不变，像这样：

window.onscroll = function () {
    //输出top值与滚动条距离
    console.log(child.getBoundingClientRect().top, document.documentElement.scrollTop);
};
当滚动条滚动，可以发现getBoundingClientRect().top值加上document.documentElement.scrollTop的值终等于1000，而这1000正是元素距离视窗顶部的距离。



现在将JQ的代码与输出offsetTop的代码取消注释，并加入到scroll事件中，再次滚动滚动条像这样：

复制代码
// JS getBoundingClientRect()
let child = document.querySelector('.child');
let son = $('.child');
window.onscroll = function () {
    //输出getBoundingClientRect的top值，JQ的offset().top与offsetTop
  console.log(child.getBoundingClientRect().top,son.offset().top,child.offsetTop);
};
复制代码


可以看到getBoundingClientRect().top是顺着滚动条下移慢慢变小的，毕竟元素距离视窗顶部越来越近了，而offset().top与offsetTop一直保持1000，为什么呢？

首先，我们知道offsetTop获取的是元素距离自己最近的offsetParent（position为非static且距离自己最近的祖先元素）的距离，且这个距离不随滚动条滚动变化，也就是说这个距离开始是多少就是多少，是个恒定值。

而JQ的offset().top获取的是元素距离文档顶端的距离。怎么去理解这个文档呢，我们把浏览器网页可读范围比喻成一幅画，这幅画包含了html，所以如果html内容越多（比如给html设置上margin），这幅画就会越长；而视窗呢可以比喻成一块玻璃，我们透过玻璃看这幅画，如果画的高度比玻璃还高那就有了滚动条，当滚动往下拉时，等同于玻璃位置不变，但是画会往上移。

知道这个概念后，我们再来想想上面例子为什么offset().top一直不变，当滚动条下拉，画往上移，而画中的元素是随着画一起运动的，很明显该元素相对画顶端的距离也一直没变，这下总知道为啥是1000了吧。

而getBoundingClientRect获取的是元素距离视窗顶端的距离，当画上移，元素肯定距离视窗顶端越来越近，所以这个距离一定越来越小。

 叁 ✿ getBoundingClientRect与offset().top的区别

那么到这，我们知道了getBoundingClientRect参照是视窗顶端，而JQ的offset().top参照的是文档，两者参照对象不同。

当监听的是window的滚动条时，元素的getBoundingClientRect().top会原来越小，而offset().top一直不变。

当监听某个元素的滚动条时，元素的getBoundingClientRect().top会与offset().top保持一致，比如我让一个ul包含了多个li，滚动ul的滚动条时，获取第一个li的相关属性，有兴趣可以将下面的代码替换一下：

 View Code


可以看到getBoundingClientRect().top与offset().top的值完全一致。

 肆 ❤ 获取元素距离距离视窗顶部的可变距离

楼层导航，懒加载，返回顶部按钮等等，只要涉及scroll事件，都无法避免的要去计算某个元素距离视窗顶部的距离，经过前文的分析，不管是监听window滚动条还是元素滚动条，其实都有两种可行方法。

如果是监听的是window的滚动条，那么可以使用：

window.onscroll = function () {
    可变距离 = document.querySelector('元素').getBoundingClientRect().top
};
其次可以获取元素的offsrtTop减去滚动条距离，前提是得保证元素的offsetParent为html元素或者body：

var offsetTop = document.querySelector('元素').offsetTop;
window.onscroll = function () {
    可变距离 = offsetTop - document.documentElement.scrollTop;
};
如果监听的是元素的滚动条，获取元素内子元素距离视窗的高度可以使用JQ的offset().top：

document.querySelector('父元素').onscroll = function () {
    子元素可变距离 = $('子元素元素').offset().top;
};
其次可以使用子元素的offsetTop减去父元素滚动条距离，当然你也得保证子元素的offsetParent为html或body：

var parent = document.querySelector('父元素');
var son = document.querySelector('子元素');
parent.onscroll = function () {
    子元素可变距离 = son.offsetTop - parent.scrollTop;
};
 伍 ☸ 总

那么结合文章开头的另一篇博客以及本文，我们详细介绍了JQ的offset().top与JS的offsetTop以及getBoundingClientRect的区别：

我们知道了offset().top参照对象是文档上边界，当监听window滚动条，它的效果与offsetTop类似，都是固定不变的值，毕竟在元素上移时，整体的文档也上移了。

我们知道offsetTop的参照对象是一个可变的offsetParent，而且得到的值永远不变。

我们还知道了好用的getBoundingClientRect方法，它的参照对象是视窗顶端，不管滚动条是window还是元素的，我们可以时时拿到可变尺寸。

当然我们还了解了特定情况下，使用offsetTop - scrollTop一样能拿到这个可变值。

那么到这里，本文结束。
*
* */

////================================================================
/*
JavaScript 监听元素是否进入/移出可视区域
原创latency_cheng 发布于2018-12-11 23:13:27 阅读数 2902  收藏
展开
JavaScript 监听元素是否进入/移出可视区域
常规操作
防抖节流
IntersectionObserver
兼容的代码
常规操作
  通常的做法是，监听srcoll事件，根据元素的offset来判断。

window.addEventListener('scroll', this.scrollHandle, true);
  使用getBoundingClientRec()来获取元素的位置。

scrollHandle () {
    const offset = this.$el.getBoundingClientRect(); // vue中，使用this.$el获取当前组件的根元素
    const offsetTop = offset.top;
    const offsetBottom = offset.bottom;
    const offsetHeight = offset.height;
    // 进入可视区域
    if (offsetTop <= window.innerHeight && offsetBottom >= 0) {
        console.log('进入可视区域');
        // do something...
    } else {
        console.log('移出可视区域');
        // do something...
    }
}

  记得在适当的时候移除事件监听

window.removeEventListener('scroll', this.scrollHandle, true);
  但是这种操作，使得我们的开销变得很大，所以可以考虑防抖和节流。

防抖节流
  关于防抖和节流，看过不一样的理解，有的人认为防抖和节流是一个意思，在这里，按照我的理解，给防抖和节流的定义如下：
  防抖：在停止触发一段时间后再调用方法；
  节流：再一段时间内至少调用一次方法；
  具体的原理就不讲了，直接上代码，iselapsed参数表示是否等待上一次，也就是iselapsed为true，则为节流。

/**
 * 防抖节流
 * @param {*} action 回调
 * @param {*} delay 等待的时间
 * @param {*} context this指针
 * @param {Boolean} iselapsed 是否等待上一次
 * @returns {Function}
 */
// function throttle (action, delay, context, iselapsed) {
//     let timeout = null;
//     let lastRun = 0;
//     return function () {
//         if (timeout) {
//             if (iselapsed) {
//                 return;
//             } else {
//                 clearTimeout(timeout);
//                 timeout = null;
//             }
//         }
//         let elapsed = Date.now() - lastRun;
//         let args = arguments;
//         if (iselapsed && elapsed >= delay) {
//             runCallback();
//         } else {
//             timeout = setTimeout(runCallback, delay);
//         }
//         /**
//          * 执行回调
//          */
//         function runCallback() {
//             lastRun = Date.now();
//             timeout = false;
//             action.apply(context, args);
//         }
//     };
// }
//
// 在这里，我希望方法在一段时间内至少执行一次，所以我用节流
//
// window.addEventListener('scroll', this.scrollHandle, true);
// this.scrollHandle = throttle(this.scrollThrottle, 200, this, true)
// scrollThrottle () {
//     const offset = this.$el.getBoundingClientRect();
//     const offsetTop = offset.top;
//     const offsetBottom = offset.bottom;
//     const offsetHeight = offset.height;
//     // 进入可视区域
//     if (offsetTop <= window.innerHeight && offsetBottom >= 0) {
//         console.log('进入可视区域');
//         // do something...
//     } else {
//         console.log('移出可视区域');
//         this.enabledPause = false;
//         // do something...
//     }
// }
// IntersectionObserver
// 安卓设备和部分浏览器支持IntersectionObserver来通知我们元素进入/移出可视区域。
//   判断是否支持IntersectionObserver：
//
// if ('IntersectionObserver' in window &&
//     'IntersectionObserverEntry' in window &&
//     'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
//     // do something
// }
// 创建IntersectionObserver,并传入回调，指定进入/移出可视区域时的操作。还可以传入一个对象（{threshold, root}），用来配置IntersectionObserver。
//   threshold属性决定了什么时候触发回调函数。它是一个数组，每个成员都是一个门槛值，例如[0, 0.25, 0.5, 0.75, 1]。默认为[0]，即交叉比例（intersectionRatio）达到0时触发回调函数。
//   root属性用来指定根元素。
//   callback函数的参数entries是一个数组，每个成员都是一个IntersectionObserverEntry对象，其中的intersectionRatio属性表示监听的元素与根元素的交叉的比例，>0则表示此时进入可视区域。
//
// this.observer = new IntersectionObserver(entries => {
//     if (entries[0].intersectionRatio > 0) {
//         console.log('进入可视区域');
//         // do something
//     } else {
//         console.log('移出可视区域');
//         // do something
//     }
// });
// 开始监听
//
// this.observer.observe(this.$el);
// 取消监听
//
// this.observer.disconnect();
// 兼容的代码
// 因为iOS不支持IntersectionObserver，所以我们要在不支持的时候继续监听scroll事件。
//   贴上完整的代码
//
// import throttle from '../throttle.js';
// export default {
//     data () {
//         return {
//             observer: null,
//             scrollHandle: throttle(this.scrollThrottle, 200, this, true)
//         };
//     },
//     mounted () {
//         // 判断是否支持 IntersectionObserver
//         if ('IntersectionObserver' in window &&
//             'IntersectionObserverEntry' in window &&
//             'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
//             this.observer = new IntersectionObserver(entries => {
//                 if (entries[0].intersectionRatio > 0) {
//                     console.log('进入可视区域');
//                     // do something
//                 } else {
//                     console.log('移出可视区域');
//                     // do something
//                 }
//             });
//         }
//     },
//     methods: {
//         startObserve () {
//             if (this.observer) {
//                 this.observer.observe(this.$el);
//             } else {
//                 window.addEventListener('scroll', this.scrollHandle, true);
//             }
//         },
//         endObserve () {
//             if (this.observer) {
//                 this.observer.disconnect();
//             } else {
//                 window.removeEventListener('scroll', this.scrollHandle, true);
//             }
//         },
//         scrollThrottle () {
//             const offset = this.$el.getBoundingClientRect();
//             const offsetTop = offset.top;
//             const offsetBottom = offset.bottom;
//             const offsetHeight = offset.height;
//             // 进入可视区域
//             if (offsetTop <= window.innerHeight && offsetBottom >= 0) {
//                 console.log('进入可视区域');
//                 // do something
//             } else {
//                 console.log('移出可视区域');
//                 // do something
//             }
//         }
//     }
// }
//
// throttle.js
//
// /**
//  * 回调节流
//  *
//  * @export
//  * @param {*} action 回调
//  * @param {*} delay 等待的时间
//  * @param {*} context this指针
//  * @param {Boolean} iselapsed 是否等待上一次
//  * @returns {Function}
//  */
// export default function throttle (action, delay, context, iselapsed) {
//     let timeout = null;
//     let lastRun = 0;
//     return function () {
//         if (timeout) {
//             if (iselapsed) {
//                 return;
//             } else {
//                 clearTimeout(timeout);
//                 timeout = null;
//             }
//             // return;
//         }
//         let elapsed = Date.now() - lastRun;
//         let args = arguments;
//         if (iselapsed && elapsed >= delay) {
//             runCallback();
//         } else {
//             timeout = setTimeout(runCallback, delay);
//         }
//         /**
//          * 执行回调
//          */
//         function runCallback() {
//             lastRun = Date.now();
//             timeout = false;
//             action.apply(context, args);
//         }
//     };
// }
//  */
