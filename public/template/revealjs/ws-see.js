var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var id = '###ID###';
var domain = '###DOMAIN###';
var socket = new WS("ws://" + domain + "/prez/ws?id=" + id);

var receiveEvent = function(event) {
    console.log("[WS]: receiving " + event.data)
    var data = JSON.parse(event.data);
    if(data.id == id){
        Reveal.slide(data.h,data.v);
    }
}
socket.onmessage = receiveEvent;

// Reveal read-only mode
Reveal.configure({mouseWheel:false});
Reveal.configure({controls:false});
Reveal.configure({keyboard:false});
Reveal.removeEventListeners();
Reveal.addEventListeners();




