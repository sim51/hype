var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var id = '###ID###';
var socket = new WS("ws://localhost:9000/prez/ws?id=" + id);

var receiveEvent = function(event) {
    console.log("[WS]: receiving " + event.data)
    var data = JSON.parse(event.data);
    if(data.id == id){
        Reveal.slide(data.h,data.v);
    }
}
socket.onmessage = receiveEvent;



