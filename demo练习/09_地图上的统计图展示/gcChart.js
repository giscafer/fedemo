/**
 * 封装的echart接口，通用方法等
 * @author giscafer
 * @Date 2017年11月25日18:26:32
 */
var gcChart = {
    mapDivId: "mapChart", //mapInstance的div
    isLoadDatasSuccess: false,
    //页面交互的控制变量
    //鼠标样式
    zoomin: "url('/img/chart/big.ico'),default",
    zoomout: "url('/img/chart/small.ico'),default",
    mapOptions: {},
    mapChildOptions: {},
    units: '公顷', //地图maptip单位
    curzqname: 'china', //当前政区名称
    searchAreaName: 'china', //当前政区名称
    /**
     * 地图上加载饼图
     * @param   {Array}   pieData    饼图数据
     * @param   {Object}   mapInstance    echarts实例对象
     * @param   {Object}   baseOption   地图基础option参数
     * @param   {Object}   radius   饼图圆环参数，eg:["5%", '10%']
     */
    createPieMap: function (pieData, mapInstance, baseOption, radius) {
        //默认数据
        var mapOptions = this.getMapOption(baseOption);
        //删除series中序号0以后的对象
        var end = mapOptions.series.length;
        mapOptions.series.splice(1, end - 1);
        mapInstance.setOption(mapOptions, true);
        //遍历饼图数据，给每个饼图确定地图位置
        for (var i = 0; i < pieData.length; i++) {
            var pieOption = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} " + gcChart.units + " ({d}%)"
                },
                label: {

                    normal: {
                        show: false
                    }
                },
                color: mapOptions.color || [
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#bda29a",
                    "#6e7074",
                    "#546570",
                    "#c4ccd3"
                ],
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                type: 'pie',
                radius: radius ? radius : '9%'
            };
            //获取相关数据
            var piePoint = pieData[i].point;
            var seriesModel = mapInstance.getModel().getSeriesByIndex(0);
            // 获取地理坐标系实例
            var coordSys = seriesModel.coordinateSystem;
            var _point = coordSys.dataToPoint(piePoint);

            var _data = pieData[i].data;
            //去除都为0的时候还绘制饼图
            var dflag = true;
            for (var d = 0; d < _data.length; d++) {
                var temp = _data[d];
                if (Number(temp.value) !== 0) {
                    dflag = false;
                    break;
                }
            }
            if (dflag) {
                continue;
            }
            //设置option
            pieOption.center = _point;
            pieOption.data = _data;
            pieOption.name = pieData[i].name;

            mapOptions.series.push(pieOption);
        }
        if (baseOption.mapType !== 'china') { //缓存子地图和全区地图options
            gcChart.mapChildOptions = mapOptions;
            gcChart.level = 2;
        } else {
            gcChart.mapOptions = mapOptions;
            gcChart.level = 1;
        }
        this.mapInstance = mapInstance;
        mapInstance.setOption(mapOptions);
        //绑定鼠标样式修改事件（和tooltip的formatter一起共用）
        mapInstance.off('mouseout');
        mapInstance.on('mouseout', function (e) {
            // console.log(new Date().getTime());
            $('#' + gcChart.mapDivId + ' canvas').css("cursor", 'default');
        });
        return mapOptions;
    },
    /**
     * 地图上加载柱形图
     * @param   {Array}   barData    柱状图数据
     * @param   {Object}   mapInstance    echarts实例对象
     * @param   {Object}   baseOption   地图基础option参数
     */
    createBarMap: function (barData, mapInstance, baseOption) {
        //默认数据
        var mapOptions = this.getMapOption(baseOption);
        var end = mapOptions.series.length;
        mapOptions.series.splice(1, end - 1);
        var color_one = mapOptions.color || ['#A06700', '#DFF868', '#F39800'];
        var color_two = ['#F0CF48', '#D0B02D', '#A4860B', "#6B5703"];
        //用于调整柱型图位置
        mapOptions.grid = [];
        mapOptions.xAxis = [];
        mapOptions.yAxis = [];
        mapInstance.setOption(mapOptions, true);
        this.mapInstance = mapInstance;
        for (var i = 0; i < barData.length; i++) {
            var bar_option = {
                series: []
            };
            for (var j = 0; j < barData[i].data.length; j++) {

                bar_option.series.push({
                    type: "bar",
                    z: 3,
                    barGap: "0%",
                    barWidth: "8",
                    xAxisIndex: [i],
                    yAxisIndex: [i],
                    name: barData[i].data[j].name,
                    data: [barData[i].data[j].data],
                    itemStyle: {
                        normal: { color: color_one[j] }
                    }
                });
            }

            //获取相关数据
            var pie_point = barData[i].point;
            var seriesModel = mapInstance.getModel().getSeriesByIndex(0);
            // 获取地理坐标系实例
            var coordSys = seriesModel.coordinateSystem;
            var point = coordSys.dataToPoint(pie_point);

            //调整柱形图在地图上的位置
            mapOptions.grid.push({ x: point[0] - 20, y: point[1] - 50, width: "40", height: "40" });

            mapOptions.xAxis.push({ gridIndex: i, type: 'category', show: false });

            mapOptions.yAxis.push({ gridIndex: i, type: 'value', show: false });
            for (var k = 0; k < bar_option.series.length; k++) {

                if (barData[i].data.length == 4) {
                    bar_option.series[k].itemStyle.normal.color = color_two[k];
                }
                mapOptions.series.push(bar_option.series[k]);
            }
        }
        mapInstance.setOption(mapOptions);
    },

    /**
     * 获取地图option
     * options.isChildMap=true表示子地图mapOption
     * 通过此控制来修改适合各情景的options
     */
    getMapOption: function (options) {
        var opt = options || {};
        var seriesObj = {
            roam: false,
            data: opt.seriesData || [],
            name: opt.seriesName || '森林资源',
            type: 'map',
            mapType: opt.mapType || 'china',
            selectedMode: 'single',
            //hoverable:false,
            //设置标签的字体颜色
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: '#004532',
                        fontWeight: 500,
                        fontSize: 13
                    },
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    color: 'white'
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                    areaColor: '#2588BF'
                },
                emphasis: {
                    areaColor: '' //空可以去掉默认高亮
                }
            }
        };
        //全区地图maptions居中定位
        if (!options.mapType || options.mapType === 'china') {
            seriesObj.top = '250';
            seriesObj.center = [106.4675667082305, 26.648845023298016];
            seriesObj.zoom = 1.14601000028;
        }
        var data = [seriesObj];
        var mapOption = {
            title: {
                show: opt.titleShow || false,
                text: opt.title || '综合图',
                textStyle: {
                    color: "#fff",
                    fontWeight: "normal",
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'item'
            },
            color: opt.color || [
                "#c23531",
                "#2f4554",
                "#61a0a8",
                "#d48265",
                "#91c7ae",
                "#749f83",
                "#ca8622",
                "#bda29a",
                "#6e7074",
                "#546570",
                "#c4ccd3"
                ],
            toolbox: {
                show: opt.showToolbox || false,
                feature: {
                    // magicType : {show: true, type: ['line', 'bar']},
                    restore: { show: false },
                    saveAsImage: {
                        show: true,
                        backgroundColor: '#1B79AD',
                        iconStyle: {
                            normal: {
                                color: '#184b38',
                                borderColor: '#184b38'
                            }
                        }
                    }
                }
            },
            visualMap: {
                show: false,
                type: 'continuous',
                min: opt.vmapMin || 0,
                max: opt.vmapMax || 100,
                left: 'left',
                //top: 'bottom',
                bottom: '40',
                text: ['高', '低'], // 文本，默认为数值文本
                calculable: true,
                color: opt.visualMapColor ||[
                    "#c23531",
                    "#2f4554",
                    "#61a0a8",
                    "#d48265",
                    "#91c7ae",
                    "#749f83",
                    "#ca8622",
                    "#bda29a",
                    "#6e7074",
                    "#546570",
                    "#c4ccd3"
                    ],
                seriesIndex: 0,

                formatter: opt.visualMapFormatter || function (value) {
                    return toFixed(value);
                }
            },
            series: opt.series || data
        };
        return mapOption;
    }

};

function toFixed(num, radio) {
    radio = radio || 0;
    var base = Math.pow(10, radio);
    return Math.round(base * radio) / base;
}