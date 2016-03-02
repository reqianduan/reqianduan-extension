/**
 * layer.js
 * @author Arvin (arvin@reqianduan.com)
 * @link   http://www.reqianduan.com
 * @date   2016-03-01 11:41:20
 */

(function(){
	// Layer between Tabs and Extensions
    ReqianduanLayer = function () {};

    ReqianduanLayer.prototype = {
        init: function () {
            if (this.initialized) {
                return;
            }

            // do init here

            this.initialized = true;
            this.requestListener = undefined;
        },

        isChrome: function () {
            return window["chrome"] !== undefined && window.chrome.app;
        },

        isSafari: function () {
            return window["safari"] !== undefined;
        },

        addMessageListener: function (listener) {
            // Remove event listener if one is currently registered
            if (this.requestListener !== undefined) {
                this.removeMessageListener();
            }

            // Add request listener
            if (this.isChrome()) {
                this.requestListener = listener;
                chrome.extension.onMessage.addListener(listener);
            } else if (this.isSafari()) {
                this.requestListener = function (thingy) {
                    listener(thingy.message, thingy);
                };
                window.safari.self.addEventListener("message", this.requestListener);
            }
        },

        removeMessageListener: function () {
            if (this.isChrome()) {
                chrome.extension.onMessage.removeListener(this.requestListener);
            } else if (this.isSafari()) {
                window.safari.self.removeEventListener("message", this.requestListener);
            }
            this.requestListener = undefined;
        },

        sendMessage: function (message, callback) {
            if (this.isChrome()) {
                if (window.chrome.runtime.sendMessage) {
                    window.chrome.runtime.sendMessage(message, callback);
                } else if (window.chrome.extension.sendMessage) {
                    window.chrome.extension.sendMessage(message, callback);
                } else {
                    window.chrome.extension.sendRequest(message, callback);
                }
            } else if (this.isSafari()) {
                safari.self.tab.dispatchMessage("message", message);
            }
        },

        savePage: function () {
            var self = this;

            this.addMessageListener(function (response) {
                self.handlePageResponse(response);
            });
            this.sendMessage({
                action: "addPage",
                title: document.title,
                url: window.location.toString(),
                data: window.__getReqianduanClearlyResults()
            }, function () {});
        },

        handlePageResponse: function (response) {
            if (response.status === "success") {
                // 提示信息（成功）
            } else if (response.status === "error") {
                // 提示信息（失败）
            }
        }
    };

    // 真正的处理逻辑
    if (window.__reqianduanLayer) {
        window.__reqianduanLayer.savePage();
    } else {
        // make sure the page has fully loaded before trying anything
        window.setTimeout(function () {
            if (!window.__reqianduanLayer) {
                window.__reqianduanLayer = new ReqianduanLayer();
                window.__reqianduanLayer.init();
            }

            window.__reqianduanLayer.savePage();
        }, 1);
    }
})();