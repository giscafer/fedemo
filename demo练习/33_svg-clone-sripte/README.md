

# svg-clone-sripte 源码学习

`svg-clone-sripte` 的功能是将SVG雪碧图文件克隆为单独的svg图标，相当于SVG文件实现切图效果

通过这种方式，您可以创建一个具有所有雪碧图的单一svg文件，而无需构建步骤或手动导出过程将其转换为独立的svg或png文件

## 源码分析

二话不多说，看源码

```javascript



/**
 * 工程源码：https://github.com/substack/svg-clone-sprite/blob/master/index.js
 * 
 */
function createSprite(sprite) {
    var root = null;
    var bboxes = {};
    // svg文件读取后，如果是字符串内容，转为element对象
    if (typeof sprite === 'string') {
        // 先用一个div作为载体
        var div = document.createElement('div');
        // 转为element
        div.innerHTML = sprite;
        // 再取出svg元素对象
        var root = div.children[0];
        // 设置样式
        root.style.position = 'absolute';
        root.style.top = '0px';
        root.style.left = '0px';
        // 隐藏不显示
        // 如果在这个元素上设置display: none，那么绑定rect计算将无法工作。visibility: hidden 熟悉会获取到绝对定位right:0px;left:0 px。如果您将svg内容字符串传递给createSprite()，那么这些css属性就已经设置好了。
        root.style.visibility = 'hidden';

        // 如果直接传的是svg对象
    } else if (sprite && typeof sprite.querySelector === 'function') {
        root = sprite;
    }


    return {
        element: root,
        // api get方法
        // 通过选择器去查询svg元素并返回
        get: function (selector) {
            // 找到元素并拷贝
            var elem = root.querySelector(selector);
            var copy = elem.cloneNode(true);
            // 创建一个SVG元素 SVGSVGElement
            var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            // 创建一个 SVGGElement 
            var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            // 获取该元素的rect信息，然后通过样式定位
            var bbox = bboxes[selector] || elem.getBoundingClientRect();
            bboxes[selector] = bbox;
            svg.setAttribute('width', bbox.width);
            svg.setAttribute('height', bbox.height);
            // g 图形的transform控制样式
            g.setAttribute('transform', 'translate(' + (-bbox.left) + ',' + (-bbox.top) + ')');
            svg.appendChild(g);
            // 将elem放到g中
            g.appendChild(copy);
            // 返回一个含elem的单独的svg元素，相当于切图了。
            return svg;
        }
    }
}


//test

fetch('/icons.svg').then(resp => resp.text()).then(body => {
    var sprite = createSprite(body)
    // 在调用sprite.get()之前，此元素必须存在于页面上。
    document.body.appendChild(sprite.element);
    // 根据id切图（可以注释一两句代码看效果）
    document.body.appendChild(sprite.get('#play'))
    document.body.appendChild(sprite.get('#play'))
    document.body.appendChild(sprite.get('#play'))

    document.body.appendChild(sprite.get('#pause'))
    document.body.appendChild(sprite.get('#pause'))

    document.body.appendChild(sprite.get('#stop'))
    document.body.appendChild(sprite.get('#stop'))
    document.body.appendChild(sprite.get('#stop'))
})

```


以上代码本地运行就可以看到效果了，在线demo见 [SVG文件实现切图_demo]()

# 总结

使用的技术点主要是HTML原生dom操作的API或方法，主要是需要对SVG文件结构和对应知识点熟悉，然后想到此方式，才可以实现这个demo.

细节的地方就是 `visibility: hidden` 和 `getBoundingClientRect()` 配合使用

