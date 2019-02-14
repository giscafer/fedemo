
# 32_typhoon_earth

台风信息获取demo

本demo几年前用node.js实现过，见：https://github.com/viseye/webglearth-typhoon

本次修改为原生js方式，静态页面部署方便，无需nodejs服务器。



**本demo核心代码文件说明**

-  `scripts/map.js` 请求台风数据，使用leflet在三维球上展示

其他js文件是基于 cesium 和 webglearth2 ，对应库在github可以找到

## 使用

- 部署当前目录静态代码即可，或双击打开 `index.html`