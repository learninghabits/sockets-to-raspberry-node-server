var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
	socket.on('disconnect', function () {
		console.log('client disconnected with ID : ' + socket.id);
	});
	socket.on('pong', function(data){
        console.log("Pong received from client");
    });
	console.log('client connected with ID : ' + socket.id);
});

function sendHeartbeat(){
    setTimeout(sendHeartbeat, 8000);
    io.sockets.emit('ping', { beat : 1 });
}

setTimeout(sendHeartbeat, 8000);

app.get('/device/on', function (request, response) {
	io.emit('SwitchOn');
	response.status(200)
		.send('OK');
});

app.get('/device/off', function (request, response) {
	io.emit('SwitchOff');
	response.status(200)
		.send('OK');
});

app.get('/device/togglestate/:seconds', function (request, response) {
	var seconds = (request.query.Seconds || request.query.seconds) || (request.params.Seconds || request.params.seconds);
	io.emit('ToggleState', { seconds: seconds });
	response.status(200)
		.send('OK');
});

app.get('*', function (req, res) {
	res.send("The socket server is ready for get comms ");
});

var port = process.argv.slice(2)[0] || (process.env.PORT || 80);
http.listen(port, function () {
	console.log("SERVER IS LISTENING ON PORT: " + port);
	console.log("CTRL+C TO STOP ");
});

process.on('SIGINT', function () {	
	console.log('BYE BYE, STOPPED GRACIOUSLY!');
	process.exit();
});