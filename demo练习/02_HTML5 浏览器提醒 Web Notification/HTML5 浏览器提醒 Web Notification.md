
## 前言

给大家介绍一个网站，可以用来查询各种浏览器API支持情况，包括前端框架各种浏览器支持情况。http://caniuse.com/ （很好记，can i use?），如果打不开，可能是网络访问不了墙的那边。。。

我们来查询`Web Notification` API支持情况如截图：

![浏览器兼容性](https://gitee.com/uploads/images/2017/1025/200330_fbb20abe_107020.png "QQ截图20171025200316.png")

可以看到IE版本很多都不支持。如果你用过腾讯体育网站你会遇到过类似的提示，就是使用notification实现的。

## Web Notification Demo

API 详情了解：https://developer.mozilla.org/zh-CN/docs/Web/API/notification

实现demo效果截图：

![demo](https://gitee.com/uploads/images/2017/1025/200450_ac9f894d_107020.gif "notification.gif")


demo源码见：`fetraning/HTML5 浏览器提醒 Web Notification/index.html` 文件。

运行demo源码要注意，直接浏览器打开页面，代码执行没效果，因为Notification API不支持本地文件提示。
需要部署才能开到效果。部署可以使用tomcat或者IIS等，下次有机会教大家如何使用nodejs作为前端开发环境（可以当做tomcat使用）

