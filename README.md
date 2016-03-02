# 热前端文章采集工具

这是一个Chrome扩展程序，可以让你方便地从任意网站上采集喜欢的文章到热前端(reqianduan.com)网站。

## 技术

为了完成这个扩展程序，我使用了一些开源项目：

* [html2markdown] - Converts HTML to Markdown
* [clearly] - clearly
* [markdown-it] - Markdown parser
* [Mimic] - XML-RPC client implemented in JavaScript
* [wordpress.js] - WordPress XmlRpc Javascript Api
* [moment] - Parse, validate, manipulate, and display dates in javascript.
* [jQuery] - duh

## TODO

- [ ] 异步请求
- [ ] 授权功能：插件对账号密码进行规则A加密，服务器端进行反A解密。
    - 服务器端需要修改XMLRPC接口，增加解密操作。
- [ ] 分类功能
- [ ] 标签功能



[html2markdown]: <https://github.com/kates/html2markdown>
[clearly]: <https://github.com/fegeeks/clearly>
[markdown-it]: <https://github.com/markdown-it/markdown-it>
[Mimic]: <http://mimic-xmlrpc.sourceforge.net/>
[wordpress.js]: <https://github.com/developerworks/wordpress-xmlrpc-javascript-api>
[moment]: <https://github.com/moment/moment/>
[jQuery]: <http://jquery.com>