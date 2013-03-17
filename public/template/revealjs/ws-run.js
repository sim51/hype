var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var socket = new WS("ws://localhost:9000/prez/ws?id=###ID###");

var sendMessage = function(txt) {
    console.log("[WS]: sending " + txt + " | " + JSON.stringify(txt))
    socket.send(JSON.stringify(txt));
}

var receiveEvent = function(event) {
    console.log("[WS]: receiving " + event.data)
}
socket.onmessage = receiveEvent;

Reveal.addEventListener( 'slidechanged', function( event ) {
    console.log("[EventListerner]: h=>"+ event.indexh + " v=>" + event.indexv);
    var json = {h:event.indexh, v:event.indexv}
    sendMessage(json);
} );
