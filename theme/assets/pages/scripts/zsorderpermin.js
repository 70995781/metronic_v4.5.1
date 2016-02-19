/**
 * Created by Darren on 2016/2/14.
 */
var myChart;
var webSocket =
   // new WebSocket('ws://localhost:8080/quick4j/ws');
    new WebSocket( 'ws://10.128.92.48:8080/quick4j/Zsordercreatepermin');

var Axisdata=new Array();
var ZsOrderCreatePerminToday=new Array();
var Axisdata_a=new Array();
var z1=new Array();


webSocket.onerror = function(event) {
    onError(event)
};

webSocket.onopen = function(event) {
    onOpen(event)
};

webSocket.onmessage = function(event) {
    onMessage(event)
};

function onMessage(event) {

    

    var dataObj=eval("("+event.data+")");//转换为json对象
     Axisdata=[];
    ZsOrderCreatePerminToday=[];

    //遍历json数组
    $.each(dataObj, function(i, item) {
        if (dataObj.length!=1){
            console.log("每分钟zs定单获得存量数据"+dataObj.length);
            Axisdata.push(item.min);
            ZsOrderCreatePerminToday.push(item.count);
        }else{
            console.log("获得增量数据"+event.data);
            Axisdata_a.push(item.min);
            z1.push(item.count);
        }
    });


    //  Axisdata=data.min;
    //  ZsOrderCreatePerminToday=data.count;



}

function onOpen(event) {
  //  document.getElementById('messages').innerHTML        = 'Connection established';

}

function onError(event) {
    alert("websocket连接错误");
}



require.config({
    paths: {
        echarts: '../assets/global/scripts/'
    }
});


 setTimeout(function(){showchart()},3000);




function showchart(){
    //百度echart开始
    require(
        [
            'echarts',
            'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
            'echarts/chart/line'
        ],

        function (ec) {
            // 基于准备好的dom，初始化echarts图表
             myChart = ec.init(document.getElementById('site_statistics_loading'));


            // 过渡---------------------
            myChart.showLoading({
                text: '正在努力的读取数据中...',    //loading话术
            });

            // ajax getting data...............

            // ajax callback
            myChart.hideLoading();


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
                        boundaryGap : false,
                        axisLabel:{
                            axisLabel:{
                                interval:0}},
                        //data : ['8时','9时','10时','11时','12时','13时','14时','15时','16时','17时','18时','19时','20时']
                        data:Axisdata
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
                        data:ZsOrderCreatePerminToday,
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
            myChart.setOption(option);

            //  clearInterval(timeTicket);
            timeTicket = setInterval(function (){

                $.each(Axisdata_a,function(i,item){
                    console.log("zdorderpermin动态追加数据第："+ i);
                    // 动态数据接口 addData
                    myChart.addData([

                        [
                            0,        // 系列索引
                            z1[i], // 新增数据
                            false,    // 新增数据是否从队列头部插入
                            true,    // 是否增加队列长度，false则自定删除原有数据，队头插入删队尾，队尾插入删队头
                            Axisdata_a[i]  // 坐标轴标签
                        ]
                    ]);
                    Axisdata.push[Axisdata_a[i]];
                    ZsOrderCreatePerminToday.push(z1[i]);
                })
                Axisdata_a=[];
                z1.length=[];
                updatele()
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
    updatele(); //更新各个元素
}

$(window).resize(function () {
    myChart.resize();
});
$("#r1").click(function(){
    webSocket.send("fresh");
    $("#am1").text("0");
    $("#am2").text("0");
    $("#am3").text("0");
    $("#am4").text("0");

     showchart();
});

function updatele(){
    $("#am1").text(Math.max.apply(null,ZsOrderCreatePerminToday)) ;//最大值
    $("#am2").text(Math.min.apply(null,ZsOrderCreatePerminToday)) ;//最小值
    var sum=0;
    for (var i = 0; i < ZsOrderCreatePerminToday.length; i++) {
        sum+=parseInt(ZsOrderCreatePerminToday[i]);
    };
   //  $("#todayorders").text(sum);
       var avg=Math.round(sum/ZsOrderCreatePerminToday.length);
    $("#am3").text(avg) ;//最小值
    $("#am4").text(ZsOrderCreatePerminToday[ZsOrderCreatePerminToday.length-1]) ;//最小值);//
}
