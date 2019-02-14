var map;
var SERVER_URL = "http://localhost:3000/";
var typhoonCenterPnt = [23.18, 113.24];

const api_host_name = 'typhoon.zjwater.gov.cn';

const ACTIVITY_API_URL = 'http://' + api_host_name + '/Api/TyhoonActivity?callback=activity_cb';
const TYPHOONLIST_API_URL = 'http://' + api_host_name + '/Api/TyphoonList';

function init() {
    map = WE.map('map', {
        center: [23.08, 113.14],
        zoom: 3,
        dragging: true,
        scrollWheelZoom: true,
        //  proxyHost: 'http://srtm.webglearth.com/cgi-bin/corsproxy.fcgi?url='
    });

    var baselayer = WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // 以下为本地切片
    /*   WE.tileLayer('{z}/{x}/{y}.jpg', {
         tileSize: 256,
         bounds: [[-85, -180], [85, 180]],
         minZoom: 0,
         maxZoom: 16,
         attribution: 'WebGLEarth example',
         tms: true
       }).addTo(map); */

    //Add TileJSON layer
    var json = { "profile": "mercator", "name": "Grand Canyon USGS", "format": "png", "bounds": [-112.26379395, 35.98245136, -112.10998535, 36.13343831], "minzoom": 10, "version": "1.0.0", "maxzoom": 16, "center": [-112.18688965, 36.057944835, 13], "type": "overlay", "description": "", "basename": "grandcanyon", "tilejson": "2.0.0", "sheme": "xyz", "tiles": ["http://tileserver.maptiler.com/grandcanyon/{z}/{x}/{y}.png"] };
    var grandcanyon = WE.tileLayerJSON(json);
    grandcanyon.addTo(map);

    grandcanyon.setOpacity(0.7);
    document.getElementById('opacity2').addEventListener('change', function (e) {
        grandcanyon.setOpacity(e.target.value);
    });


    //Print coordinates of the mouse
    map.on('mousemove', function (e) {
        if (e.latlng) {
            document.getElementById('coords').innerHTML = e.latlng.lat + ', ' + e.latlng.lng;
        }
    });
    addRealTimeTyphoonMarker(2);
}
/* 台风获取成功回调 */
function activity_cb(data) {
    addMarkers(data);
    if (data.length > 0) {
        var lat = data[0]['lat'] - 0,
            lng = data[0]['lng'] - 0;
        window.typhoonCenterPnt = [lat, lng];
        document.getElementById('realtime_center').disabled = false;
    } else {
        window.typhoonCenterPnt = [23.18, 113.24];
        alert('there is no typhoon！');
    }
}
/* 获取实时台风信息 */
function addRealTimeTyphoonMarker(level) {
    if (!level) {
        level = 5;
    }
    document.getElementById('realtime_center').disabled = true;

    $.ajax({
        type: "get",
        // async: true,
        url: ACTIVITY_API_URL,
        dataType: "jsonp",//数据类型为jsonp  
        jsonp: "activity_cb",//服务端用于接收callback调用的function名的参数  
    });
}

var markers = [];

function addMarkers(data, level) {
    if (!data) return;
    map.removeMarker(markers);
    markers = [];
    for (var i = 0; i < data.length; i++) {
        var info = data[i],
            lat = info['lat'] - 0,
            lng = info['lng'] - 0,
            point = [lat, lng];
        var name = info['name'] || '',
            title = info['enname'] + '（' + name + '）',
            power = info['power'] || '',
            speed = info['speed'] || '',
            strong = info['strong'] || '',
            movedirection = info['movedirection'] || '',
            movespeed = info['movespeed'] || '',
            pressure = info['pressure'] || '',
            radius7 = info['radius7'] || '',
            radius10 = info['radius10'] || '',
            tfid = info['tfid'] || '',
            timeformate = info['timeformate'] || '',
            pos = '纬度：' + lat + ',经度：' + lng;
        var templateHtml = '<div style="background:#eee;"><strong style="color:blue;">' + title +
            '</strong><b><br>' + tfid + '号台风，' + timeformate + '</b></div>' +
            '<br>当前位置 <b>' + pos + '</b>' +
            '<br>中心气压 <b>' + pressure + '</b> 百帕' +
            '<br>最大风速 <b>' + speed + '</b> 米/秒' +
            '<br>风 力 <b>' + power + '</b> 级' +
            '<br>等 级 <b>' + strong + '</b> ' +
            '<br>移动速度<b>' + movespeed + '</b> 公里/小时' +
            '<br>移动方向<b>' + movedirection + '</b> ' +
            '<br>七级半径<b>' + radius7 + '</b> 公里' +
            '<br>十级半径<b>' + radius10 + '</b> 公里';
        var marker = WE.marker(point, './images/typhoon.png', 40).addTo(map);
        marker.bindPopup(templateHtml, { maxWidth: 150, closeButton: true }).openPopup();
        markers.push(marker);
    }
    map.setView(typhoonCenterPnt, level);
}

function flyToTyphoonCenter() {
    map.panTo(typhoonCenterPnt);
    return;
}
// center to GuangZhou China
function resetZoom() {
    map.setView(typhoonCenterPnt);
    return;
}

function starOnGithub() {
    window.open('https://t.xiaomiquan.com/zvj2Zzf');
}
