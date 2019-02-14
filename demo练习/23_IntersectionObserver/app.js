/**测试图片 */
var imageItemCollection = [{
        url: "https://images.unsplash.com/photo-1512672378591-74fbb56b1d28?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=111881731843c98860fd6ede341337d7&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1522202757859-7472b0973c69?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b572f100e7f9e458067066ed3171acc7&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1471466054146-e71bcc0d2bb2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=da91d698f6ef403a1eee117137b36e5b&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1513754537542-f85cde07305a?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=c4bb3fbef64d42491d3003ad687cdd6c&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1486495939893-f384c2860f55?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=bf36a4694839666ab094bcdd0bb88651&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1514913274516-4aa04f176f8c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=a6940b0c53d64fc564bed31bb6aa8d9b&auto=format&fit=crop&w=1760&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1523286877159-d9636545890c?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f44497f72d77b9e8e27e87521e025edc&auto=format&fit=crop&w=1351&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1459886757952-87e191b82aeb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=6c977d9f0c074c220a31f1e89449c3aa&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1519423961530-9131478718db?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e6132d79c5060ba00caa99cf39457da6&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1482510356941-d087154c2931?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cd6c067c548407960ec92f1e820775ee&auto=format&fit=crop&w=1355&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1520507215037-061ed0f37178?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=0b0ee4f4dcd684859da448cc26c707a2&auto=format&fit=crop&w=1350&q=80",
        show: false
    },
    {
        url: "https://images.unsplash.com/photo-1522447984233-657d56c465d8?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b2efa4e73b38094995897590487ba5b4&auto=format&fit=crop&w=1350&q=80",
        show: false
    }
];

var count = 0;

function onInit() {
    var imagesEl = document.querySelector('.images');
    if (!hasCompatibleBrowser()) {
        alert('您的浏览器不兼容IntersectionObserver，建议使用最新Chrome浏览器查看效果');
        return;
    }

    for (var i = 0; i < imageItemCollection.length; i++) {
        // 展示默认图片，作为占位
        var divEl = document.createElement('DIV');
        divEl.classList.add('image-container' + i);
        divEl.classList.add('image-container');
        var image = new Image();
        image.classList.add('.beautiful-image');
        image.src = './default.jpg';
        divEl.appendChild(image);
        imagesEl.appendChild(divEl);

        insertion('.image-container' + i, i);

    }

}

/**
 * 异步监听目标元素与其祖先或视窗(viewport)交叉状态
 * https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver
 * @param {*} selector 
 * @param {*} index 
 */

function insertion(selector, index) {
    var curEl = document.querySelector(selector);
    imageItemCollection[index].intersectionObserver = new IntersectionObserver(function(entries) {
        //If intersectionRatio is 0, the target is out of view
        //and we do not need to do anything
        if (entries[0].intersectionRatio <= 0) return;

        loadItems(curEl, index);
        // 图片加载后去除监听事件
        imageItemCollection[index].intersectionObserver.unobserve(curEl);
        console.log('Loaded new items:' + selector);
    });
    // start observing
    imageItemCollection[index].intersectionObserver.observe(curEl);
}

function loadItems(curEl, index) {
    count++;
    var item = imageItemCollection[index];
    var image = curEl.firstChild;
    image.src = item.url;
    document.getElementById('totalImagesShown').innerText = count;
}

/**浏览器是否兼容 */
function hasCompatibleBrowser() {
    var hasIntersectionObserver = 'IntersectionObserver' in window;
    var userAgent = window.navigator.userAgent;
    var matches = userAgent.match(/Edge\/(\d*)\./i);

    var isEdge = !!matches && matches.length > 1;
    var isEdgeVersion16OrBetter = isEdge && (!!matches && parseInt(matches[1], 10) > 15);

    return hasIntersectionObserver && (!isEdge || isEdgeVersion16OrBetter);
}