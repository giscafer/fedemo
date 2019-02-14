var map = L.map('map').setView([18.7, 119.3], 11)
var polyline;
// 基本地图底图
L.tileLayer('http://{s}.tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map)

// 绘制台风路径
renderMainLine();
/**
 * 台风主要路径渲染
 */
function renderMainLine(callback) {
  // 获取数据
  var forecast = typhoonTestData[0]['points'];
  var points = [];
  for (var i = 0; i < forecast.length; i++) {
    var p = forecast[i];
    points.push([Number(p['lat']), Number(p['lng'])]);
  }
  //渲染
  $('#points-div').html(JSON.stringify(points))
  polyline = L.polyline(points, { color: 'blue' }).addTo(map)
  map.fitBounds(polyline.getBounds());
  polyline.snakeIn();

}

function reDraw() {
  polyline.remove();
  polyline.marker && polyline.marker.remove();
  renderMainLine();
}

