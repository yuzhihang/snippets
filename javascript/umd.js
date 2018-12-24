!function (factory) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = factory();// commonjs
    else if ("function" == typeof define && define.amd)
        define([], factory); //amd
    else {
        ("undefined" !== typeof window ? window : "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : this).Plotly = factory();
    }
}(function () {
    //initializer function implementation
});

