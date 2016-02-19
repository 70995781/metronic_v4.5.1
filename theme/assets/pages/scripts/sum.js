/**
 * Created by Darren on 2016/2/17.
 */
var options = {
    useEasing : true,
    useGrouping : true,
    separator : ',',
    decimal : '.',
    prefix : '',
    suffix : ''
};


 var webSocketsum =
// new WebSocket('ws://localhost:8080/quick4j/ws');
    new WebSocket( 'ws://10.128.92.48:8080/quick4j/Zdordersum');

webSocketsum.onmessage = function(event) {
    onMessagesum(event);
};

function onMessagesum(event) {

    console.log(event.data);
      var demo = new CountUp("todayorders",parseInt($("#todayorders").text().replace(",","")), event.data,  0, 2.5, options);
    demo.start();
}

setInterval(function (){
webSocketsum.send("getsumorders");},5000);


