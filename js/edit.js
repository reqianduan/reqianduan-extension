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

            // 保存到windows变量
            reqianduan.data = response.data;

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
        $('#result').html( md.render( $('#source').val() ) );
    }

    // 监控左栏事件
    $('#source').on('change update keyup', function(){
        updateResult();
    });

    // 采集到热前端
    $('#btn_upload').click(function () {
        // 更新数据
        reqianduan.data.markdown = $('#source').val();

        // 发起采集
        reqianduan.addPage(reqianduan.data);
    });

});