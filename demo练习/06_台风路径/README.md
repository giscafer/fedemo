# 06_台风路径

本demo简单模拟台风路径实现。代码见`index.html`

使用技术：`leaflet` ，台风数据来源于http://typhoon.zjwater.gov.cn

## 基本原理描述

实现思路说明：

1、了解如何使用leaflet绘制静态的折线，官方API：http://leafletjs.com/reference-1.2.0.html#polyline

2、将台风数据读取获取对应台风点，将点绘制为线（和步骤1一样）

3、动态路线效果实现，思路是，动态添加点，动态将点拼接成线，通过定时器实现不同长度的线绘制。
demo开发为了节省时间，找了开源的插件修改：https://github.com/IvanSanchez/Leaflet.Polyline.SnakeAnim

4、每次绘制线动画最后一个点，绘制一个marker，图标为台风图标。

5、整个台风路径最后结束后，也就是动画结束之后，marker标记弹窗

**步骤4和步骤5代码如下：**

```js
if (this._map) {
			if (this.marker) {
				this._map.removeLayer(this.marker);
			}
			// 最后一个点的时候，绘制弹窗
			if (this._latlngs[0].length >= this._snakeLatLngs[0].length - 1) {
				let land=typhoonTestData[0]['land'][0]
				this.marker = L.marker(p, { icon: typhoonIcon }).addTo(this._map).bindPopup("<b>" + typhoonTestData[0]['name'] +
				 "</b><br>"+land['info']+"<br>"+land['landtime']+"<br>经度："+land['lng']+"<br>纬度："+land['lat']+"<br>强度："+land['strong']+"<br><br><b>Author：giscafer<b>")
					.openPopup();

			} else {
				this.marker = L.marker(p, { icon: typhoonIcon }).addTo(this._map);
			}
		}

```

效果图：
https://gitee.com/xiaomiquan/fetraning/edit/master/demo练习/06_台风路径/cover.gif


在线demo:

http://fedemo.duapp.com/demo%E7%BB%83%E4%B9%A0/06_%E5%8F%B0%E9%A3%8E%E8%B7%AF%E5%BE%84/index.html
