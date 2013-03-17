var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var socket = new WS("ws://localhost:9000/prez/ws?id=###ID###");

var receiveEvent = function(event) {
    console.log("[WS]: receiving " + event.data)
    var data = JSON.parse(event.data);
    Reveal.slide(data.h,data.v);
}
socket.onmessage = receiveEvent;

Reveal.addEventListener( 'slidechanged', function( event ) {
    console.log("[EventListerner]: h=>"+ event.indexh + " v=>" + event.indexv);
} );


