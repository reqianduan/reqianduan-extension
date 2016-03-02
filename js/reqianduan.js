/**
 * reqianduan.js
 * @author Arvin (arvin@reqianduan.com)
 * @link   http://www.reqianduan.com
 * @date   2016-03-02 16:36:30
 */

var reqianduan = (function(){

    var contributeAPI = '/send2reqianduan.php',
        domain = 'http://www.reqianduan.com',
        domainDebug = 'http://ec2.reqianduan.com',
        username = 'author',
        password = 'send2reqianduan',
        version = '1.0.0',
        data = {};

    function isAuthenticated() {
        //return util.getSetting('email') !== undefined;
        return true;
    }

    function isDebug() {
    	return true;
        // return util.getSetting('debug') !== undefined && util.getSetting('debug');
    }

    function getDomain() {
        return isDebug() ? domainDebug : domain;
    }

    function htmlEscape(str) {
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

    function addPage(data){
        var connection = {
            url : reqianduan.getDomain() + contributeAPI,
            username : username,
            password : password
        };

        /**
         * See the following links for detail:
         * http://codex.wordpress.org/XML-RPC_WordPress_API/Posts#wp.newPost
         * http://codex.wordpress.org/Function_Reference/wp_insert_post
         */
        var post_content = htmlEscape(data.markdown || data.html);//如果不进行escape，mimic无法正确解析xml

        var post_date = moment().format('YYYY-MM-DD H:mm:ss');

        var custom_fields = [
            // {
            //     key: 'source',//来源域名
            //     value: parseURL(data.url).host
            // },
            {
                key: 'source_url',//来源完整地址
                value: data.url
            }
        ];

        var tags = {
            post_tag: []
        };

        var postData = {
            post_type: 'post',
            post_status: 'pending',
            post_title: data.title,
            //post_excerpt: post_excerpt,
            post_content: post_content,
            post_date: post_date,
            // post_format: '',
            // post_name: slug,
            comment_status: 'open', // 'closed' | 'open'
            // ping_status: '',
            // sticky: 0,
            custom_fields: custom_fields,
            // terms: categories,
            // terms_names: tags
        };

        console.log('data', data);
        console.log('connection', JSON.stringify(connection));
        console.log('addPage', JSON.stringify(postData));

        var wp = new WordPress(connection.url, connection.username, connection.password);
        var reply = wp.newPost(1, postData);

        if (!(reply instanceof String)) {
            // 提交失败
            console.error("ERROR: ", reply.faultString.toString());
        } else {
            // 提交成功
            console.info(reply.toString());
            // chrome.tabs.create( { url:reqianduan.getDomain() + '/?p=' + reply.toString() + '&preview=true' } );
        }
    }

    function log(label, data) {
        if (isDebug()) {
            console.log('reqianduan.' + label + ': ' + JSON.stringify(data));
        }
    }

    return {
        addPage: addPage,
        isAuthenticated: isAuthenticated,
        isDebug: isDebug,
        getDomain: getDomain,
        log: log,
        version: version
    };

})();