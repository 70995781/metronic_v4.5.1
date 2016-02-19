/**
 * Created by Darren on 2016/2/14.
 */
var myChart3;
var webSocket3 =
   // new webSocket('ws://localhost:8080/quick4j/ws');
    new WebSocket( 'ws://10.128.92.48:8080/quick4j/Zstucreatepermin');

var Axisdata3=new Array();
var ZsTuCreatePerminToday3=new Array();
var Axisdata3_a3=new Array();
var z3=new Array();


webSocket3.onerror = function(event) {
    onError3(event)
};

webSocket3.onopen = function(event) {
    onOpen3(event)
};

webSocket3.onmessage = function(event) {
    onMessage3(event)
};

function onMessage3(event) {

    document.getElementById('messages').innerHTML
        += '<br />' + event.data;


    var dataObj=eval("("+event.data+")");//转换为json对象
     Axisdata3=[];
    ZsTuCreatePerminToday3=[];
     //遍历json数组
    $.each(dataObj, function(i, item) {
        if (dataObj.length!=1){
            console.log("每分钟zstu定单获得存量数据"+dataObj.length);
            Axisdata3.push(item.minute);
            ZsTuCreatePerminToday3.push(item.count);
        }else{
            console.log("tupermin获得增量数据"+event.data);
            Axisdata3_a3.push(item.min);
            z3.push(item.count);
        }
    });


    //  Axisdata3=data.min;
    //  ZsTuCreatePerminToday3=data.count;



}

function onOpen3(event) {
  //   document.getElementById('messages').innerHTML       = 'Connection established';

}

function onError3(event) {
    alert("websocket连接错误");
}



require.config({
    paths: {
        echarts: '../assets/global/scripts/'
    }
});

setTimeout(function(){showchart3();},3000);

function showchart3(){
    //百度echart开始
    require(
        [
            'echarts',
            'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/line'
        ],

        function (ec) {
            // 基于准备好的dom，初始化echarts图表
             myChart3 = ec.init(document.getElementById('site_zstu1_loading'));

            // 过渡---------------------
            myChart3.showLoading({
                text: '正在努力的读取数据中...',    //loading话术
            });

            // ajax getting data...............

            // ajax callback
            myChart3.hideLoading();


            var option = {
                title : {
                    // text: '今日每分钟定单',
                    // subtext: '测试数据'
                },
                tooltip : {
                    trigger: 'axis'
                },

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
                        boundaryGap : false,
                        axisLabel:{
                            axisLabel:{
                                interval:0}},
                        //data : ['8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时']
                        data:Axisdata3
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
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        areaStyle: {
                            normal: {}
                        },
                        //data:[11, 11, 15, 13, 12, 13, 10],
                        data:ZsTuCreatePerminToday3,
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'},
                                //	{type : 'max', name: '最大值'},
                                //	{type : 'min', name: '最小值'}
                            ]

                        }

                    }
                ]
            };

            // 为echarts对象加载数据
            myChart3.setOption(option);

            //  clearInterval(timeTicket);
            timeTicket = setInterval(function (){

                $.each(Axisdata3_a3,function(i,item){
                    console.log("zstuperm动态追加数据第："+ i);
                    // 动态数据接口 addData
                    myChart3.addData([

                        [
                            0,        // 系列索引
                            z3[i], // 新增数据
                            false,    // 新增数据是否从队列头部插入
                            true,    // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                            Axisdata3_a3[i]  // 坐标轴标签
                        ]
                    ]);


                })
                Axisdata3_a3=[];
                z3.length=[];
            }, 2100);


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
             var Axisdata3=16;
             myChart3.addData([
             [
             0,        // 系列索引
             lastData, // 新增数据
             true,    // 新增数据是否从队列头部插入
             true,    // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
             Axisdata3  // 坐标轴标签
             ]
             ]);
             myChart3.setOption(option);*/
        }
    );
    $("#bm1").text(Math.max.apply(null,ZsTuCreatePerminToday3)) ;//最大值
    $("#bm2").text(Math.min.apply(null,ZsTuCreatePerminToday3)) ;//最小值
    var sum2=0;
    for (var i = 0; i < ZsTuCreatePerminToday3.length; i++) {
        sum2+=parseInt(ZsTuCreatePerminToday3[i]);
    };

    var avg2=Math.round(sum2/ZsTuCreatePerminToday3.length);
    $("#bm3").text(avg2) ;//最小值
    $("#bm4").text(ZsTuCreatePerminToday3[ZsTuCreatePerminToday3.length-1]) ;//最小值);//
}

$(window).resize(function () {
    myChart3.resize();
});
$("#r3").click(function(){
    webSocket3.send("fresh");
    $("#bm1").text("0");
    $("#bm2").text("0");
    $("#bm3").text("0");
    $("#bm4").text("0");
     showchart3();
});

