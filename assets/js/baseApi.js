// 每次发起请求时，都会调用ajaxProfile函数
$.ajaxPrefilter(function(options) {
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);

})