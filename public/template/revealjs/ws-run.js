var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var socket = new WS("ws://localhost:9000/prez/ws?id=###ID###");

var sendMessage = function() {
    socket.send(JSON.stringify(
        {message: "hello"}
    ));
}
