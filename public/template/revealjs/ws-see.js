var WS = window['MozWebSocket'] ? MozWebSocket : WebSocket;
var socket = new WS("ws://localhost:9000/prez/ws?id=###ID###");

var receiveEvent = function(event) {
    var data = JSON.parse(event.data);

    // Handle errors
    if(data.error) {
        // display error !
        alert(data.error);
        socket.close();
        return;
    } else {
        // TODO : goto the slide
    }

}
socket.onmessage = receiveEvent;