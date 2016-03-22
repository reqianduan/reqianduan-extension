
// 接收消息，并回应
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    // debug
    util.log('[background.js] Got a Message', msg);

    switch(msg.action) {
        case 'addPage':
            // 存储到window
            window.background = msg;

            // 打开编辑页面
            chrome.tabs.create({'url' : 'edit.html'});

            // sendResponse({ status: 'success' });
            break;

        case 'getMarkdownData':
            var response = {
                url      : background.url,
                title    : background.data.title || background.title,
                markdown : background.data.markdown,
                html     : background.data.html,
                links    : background.data.links,
                images   : background.data.images
            };
            sendResponse({ status: 'success', data: response });
            break;
    }
});


// 插件图标点击事件
chrome.browserAction.onClicked.addListener(function (tab) {

	// 访问热前端
    chrome.tabs.create({'url' : 'http://www.reqianduan.com/'});

});


// 右键菜单
chrome.contextMenus.create({
    'title': '采集文章',
    'contexts': ['page', 'frame', 'editable', 'image', 'video', 'audio', 'link', 'selection'],
    'onclick': handler
});
function handler(info, tab) {
    var url   = info.linkUrl,
        title = info.selectionText || url;

    if (!url) {
        url = tab.url;
        title = tab.title;
    }

    // // 检查是否已登录（授权）
    // if (!reqianduan.isAuthenticated()) {
    //     authentication.showAuthWindow(tab, function () {
    //         handler(info, tab);
    //     });
    //     return;
    // }

    loadLayerIntoPage(tab, url, function () {

        // debug
        util.log('[background.js] loadLayerIntoPage callback');

    });
}
function loadLayerIntoPage(tab, url, callback) {
    if (url) {
        util.executeScriptInTab(tab, 'window.__reqianduanUrlToSave = "' + url + '"');
    }

    util.executeMultiScriptFromURLInTab(tab, [
        'js/html2markdown/htmldomparser.js',
        'js/html2markdown/html2markdown.js',
        'js/jquery.min.js',
        'js/clearly.js',
        'js/util.js',
        'js/layer.js'
    ], callback);

}