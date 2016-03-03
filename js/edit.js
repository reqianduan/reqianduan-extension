/**
 * edit.js
 * @author Arvin (arvin@reqianduan.com)
 * @link   http://www.reqianduan.com
 * @date   2016-03-02 14:53:03
 */

$(document).ready(function () {

    // 请求左栏数据
    chrome.runtime.sendMessage({ action: 'getMarkdownData' }, function(response) {

        // debug
        console.log(response);

        // 数据准确
        if (response.status === 'success') {

            // 保存到window变量
            window.reqianduan.data = response.data;

            // 初始化左栏
            $('#source').val( response.data.markdown );

            // 初始化右栏
            updateResult();
        }
    });

    // 初始化mdit
    var md = window.markdownit({
        breaks:true,
        linkify: true,
        typographer: true
    });

    // 更新右栏
    function updateResult(){
        // 重新渲染
        $('#result').html( md.render( $('#source').val() ) );
    }

    // 监控左栏事件
    $('#source').on('change update keyup', function(){
        updateResult();
    });

    // 采集到热前端
    $('#btn_upload').on('click', function () {
        // 更新数据
        reqianduan.data.markdown = $('#source').val();

        // 发起采集
        reqianduan.addPage(reqianduan.data);
    });

    // 保存到本地
    $('#btn_save').on('click', function(e){
        var data = $('#source').val(),
            fileName = reqianduan.data.title+'.md' || "reqianduan.md";
        saveAsFile(data, fileName);
        e.preventDefault();
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

    // 关闭Tab
    $('#btn_close').on('click', function(e){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.remove(tabs[0].id);
        });
        e.preventDefault();
    });

});