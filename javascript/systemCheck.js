function systemCheck() {
    let ua = window.navigator.userAgent;
    let isIOS = /iphone|ipad|ipod/i.test(ua);
    let isAndroid = /android/i.test(ua);

    return {
        isIOS: isIOS,
        isAndroid: isAndroid
    }
}
