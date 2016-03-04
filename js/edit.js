/**
 * edit.js
 * @author Arvin (arvin@reqianduan.com)
 * @link   http://www.reqianduan.com
 * @date   2016-03-02 14:53:03
 */

Vue.config.debug = true;

// 初始化mdit
var md = window.markdownit({
    breaks:true,
    linkify: true,
    typographer: true
});

// 请求数据
chrome.runtime.sendMessage({ action: 'getMarkdownData' }, function(response) {

    // debug
    console.log(response);

    // 数据准确
    if (response.status === 'success') {

        // 保存到window变量
        window.reqianduan.data = response.data;
        window.reqianduan.data.title = reqianduan.data.title.trim();
        window.reqianduan.data.result = md.render(reqianduan.data.markdown);

        // 初始化Vue
        var app = new Vue({
            el: '#app',
            data: reqianduan.data,
            methods: {
                // 保存到本地
                save: function(e){
                    var data = this.markdown,
                        fileName = this.title+'.md';
                    saveAsFile(data, fileName);
                    e.preventDefault();
                },
                // 发起采集
                upload: function(){
                    reqianduan.addPage(reqianduan.data);
                },
                // 关闭Tab
                close: function(e){
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        chrome.tabs.remove(tabs[0].id);
                    });
                    e.preventDefault();
                }
            }
        });

        // 监控左栏
        app.$watch('markdown', function(newValue, oldValue){
            app.result = md.render(newValue);
        })
    }
});

var saveAsFile = (function () {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (data, fileName) {
        var blob = new Blob([data], {type: "octet/stream"}),
            url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

String.prototype.trim = function(){
    return this == null ?
            "" :
            ( this + "" ).replace( /^[\s]+|[\s]+$/g, "" );
}