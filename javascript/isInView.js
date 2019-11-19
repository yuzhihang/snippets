// 输入框获取焦点, 键盘完全弹出再调整输入框位置(因ios键盘弹出不会触发resize事件, 故延时600ms)
// 选择setInterval轮询几次更好
setTimeout(() => {
    // 挂载this上, 或者声明一个全局变量, 用于在失去焦点时, 要不要执行调整代码(非第三方不调整)
    this.inputIsNotInView = this.notInView()

    if (this.inputIsNotInView) {
        // Width, Height: 分别是键盘没有弹出时window.innerWidth和window.innerHeight
        // 88: 是第三方输入法比原生输入法多的那个tool bar(输入时显示带选项) 的高度, 做的不是太绝, 高度是统一的
        // ios第三方输入法的tool bar 甚至 键盘也被当作可视区域了(包含在键盘弹出时的window.innerHeight)
        if (Width != 750) {
            let bottomAdjust = (Height - window.innerHeight - 88) + 'px'
            $(this.inputBoxContainer).css('bottom', bottomAdjust)
        }
        else {
            // 'iphone 6 6s, 需要额外减去键盘高度432(见下图), 还算有良心, 高度和原生保持一致')
            let bottomAdjust = (Height - window.innerHeight - 88 - 432) + 'px'
            $(this.inputBoxContainer).css('bottom', bottomAdjust)
        }
    }
}, 600)

--------------------------------------------------------------------------------------

// 失去焦点, 键盘开始收起, 隐藏inputBox; 等键盘完全收起, 再显示inputBox, 设置在底部, 避免闪跳
if (this.inputIsNotInView) {
    // display和opacity + bottom 会有闪跳
    $(this.inputBoxContainer).css({ 'opacity': 0, bottom: 0 })
    setTimeout(() => {
        $(this.inputBoxContainer).css('opacity', 1)
    }, 600)
}

// --------------------------------------------------------------------------------------
    //判断元素是否在可视区域，不在的话返回true, 在返回false
    notInView() {
    // getBoundingClientRect 是获取定位的，很怪异, (iphone 6s 10.0 bate版表现特殊)
    // top: 元素顶部到窗口（可是区域）顶部
    // bottom: 元素底部到窗口顶部
    // left: 元素左侧到窗口左侧
    // right: 元素右侧到窗口左侧
    // width/height 元素宽高
    let bottom = this.inputBoxContainer.getBoundingClientRect().bottom

    // 可视区域高度 - 元素底部到窗口顶部的高度 < 0, 则说明被键盘挡住了
    if (window.innerHeight - bottom < 0) {
        return true
    }
    return false
}
