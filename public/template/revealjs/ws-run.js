var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var domain = '###DOMAIN###';
var socket = new WS("ws://" + domain + "/prez/ws?id=###ID###");
var sendSlide = function(txt) {
    console.log("[WS]: sending " + txt + " | " + JSON.stringify(txt))
    socket.send(JSON.stringify(txt));
}

var receiveEvent = function(event) {
    console.log("[WS]: receiving " + event.data)
}
socket.onmessage = receiveEvent;
socket.onclose = function(event) {
    //alert("[WS]: Close " + event);
}
socket.onerror = function(event) {
    //alert("[WS]: Error " + event);
}

Reveal.addEventListener( 'slidechanged', function( event ) {
    console.log("[EventListerner]: h=>"+ event.indexh + " v=>" + event.indexv);
    var json = {event:"slide", h:event.indexh, v:event.indexv}
    sendSlide(json);
} );


var keepALive = function(){
    console.log("[WS]: sending keep a live");
    socket.send(JSON.stringify({event:'ping'}));
}
window.setInterval(keepALive, 15000)