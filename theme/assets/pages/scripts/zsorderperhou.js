/**
 * Created by Darren on 2016/2/14.
 */
var myChart2;
var webSocket2 =
   // new webSocket('ws://localhost:8080/quick4j/ws');
    new WebSocket( 'ws://10.128.92.48:8080/quick4j/Zsordercreateperhou');

var Axisdata2=new Array();
var ZsOrderCreatePerhouToday=new Array();



webSocket2.onerror = function(event) {
    onError2(event)
};

webSocket2.onopen = function(event) {
    onOpen2(event)
};

webSocket2.onmessage = function(event) {
    onMessage2(event)
};

function onMessage2(event) {

    var dataObj=eval("("+event.data+")");//转换为json对象
     Axisdata2=[];
    ZsOrderCreatePerhouToday=[];
    //遍历json数组
    $.each(dataObj, function(i, item) {
             console.log("每小时zs定单获得存量数据"+dataObj.length);
            Axisdata2.push(item.min);
            ZsOrderCreatePerhouToday.push(item.count);

    });

    showchart2() ;
    $("#cm1").text("0");
    $("#cm2").text("0");
    $("#cm3").text("0");
    $("#cm4").text("0");
}

function onOpen2(event) {
  //  document.getElementById('messages').innerHTML        = 'Connection established1';

}

function onError2(event) {
    alert("websocket连接错误");
}

require.config({
    paths: {
        echarts: '../assets/global/scripts/'
    }
});




function showchart2(){
    //百度echart开始
    require(
        [
            'echarts',
            'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/line'
        ],

        function (ec) {
            // 基于准备好的dom，初始化echarts图表
             myChart2 = ec.init(document.getElementById('site_activities_loading'));


            // 过渡---------------------
            myChart2.showLoading({
                text: '正在努力的读取数据中...',    //loading话术
            });

            // ajax getting data...............

            // ajax callback
            myChart2.hideLoading();


            var option = {
                title : {
                  // text: '今日每分钟定单',
                   // subtext: '测试数据'
                },
                tooltip : {
                    trigger: 'axis'
                },
                //legend: {
                //    data: [{
                //        name: '系列1',
                //        // 强制设置图形为圆。
                //        icon: 'circle',
                //        // 设置文本为红色
                //        textStyle: {
                //            color: 'red'
                //        }
                //    }]
                //},
              grid: {
                             z: 0,
                            x: '30px',
                            y: '10px',
                            x2:'30px',
                            y2: '30px'
                   },
                toolbox: {
                    show : false,
                    feature : {
                        //mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : true,
                        axisLabel:{
                            axisLabel:{
                                interval:0}},
                        //data : ['8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时']
                        data:Axisdata2
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} '
                        }
                    }
                ],
                series : [
                    {
                        name:'转售',
                        type:'bar',
                        //data:[11, 11, 15, 13, 12, 13, 10],
                        data:ZsOrderCreatePerhouToday,
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'},
                              	{type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]

                        }

                    }
                ]
            };

            // 为echarts对象加载数据
            myChart2.setOption(option);

            //  clearInterval(timeTicket);
            //timeTicket = setInterval(function (){
            //
            //    $.each(Axisdata_a,function(i,item){
            //        console.log("动态追加数据第："+ i);
            //        // 动态数据接口 addData
            //        myChart.addData([
            //
            //            [
            //                0,        // 系列索引
            //                z1[i], // 新增数据
            //                false,    // 新增数据是否从队列头部插入
            //                true,    // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
            //                Axisdata_a[i]  // 坐标轴标签
            //            ]
            //        ]);
            //
            //
            //    })
            //    Axisdata_a.length=0;
            //    z1.length=0;
            //}, 2100);


            // 增加些数据------------------
            /*	option.legend.data.push('test');
             option.series.push({
             name: 'win',                            // 系列名称
             type: 'line',                           // 图表类型，折线图line、散点图scatter、柱状图bar、饼图pie、雷达图radar
             data: data1.count,
             markLine : {
             data : [
             {type : 'average', name: '平均值'}
             ]
             }
             });

             var lastData=100;
             var axisData=16;
             myChart.addData([
             [
             0,        // 系列索引
             lastData, // 新增数据
             true,    // 新增数据是否从队列头部插入
             true,    // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
             axisData  // 坐标轴标签
             ]
             ]);
             myChart.setOption(option);*/
        }
    );
     $("#cm1").text(Math.max.apply(null,ZsOrderCreatePerhouToday)) ;//最大值
     $("#cm2").text(Math.min.apply(null,ZsOrderCreatePerhouToday)) ;//最小值
    var sum=0;
    for (var i = 0; i < ZsOrderCreatePerhouToday.length; i++) {
        sum+=parseInt(ZsOrderCreatePerhouToday[i]);
    };
    var avg=Math.round(sum/ZsOrderCreatePerhouToday.length);
     $("#cm3").text(avg) ;//最小值
     $("#cm4").text(ZsOrderCreatePerhouToday[ZsOrderCreatePerhouToday.length-1]) ;//最小值);//

}

$(window).resize(function () {
    myChart2.resize();
});

$("#r2").click(function(){
    webSocket2.send("fresh");


});

