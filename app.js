var express = require('express'),
	app = express(),
	http = require('http'),

	server = http.Server(app),
	io = require('socket.io').listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/assets'));
app.locals.pretty = true;

app.get('/', function(request, response) {
	response.render('index', {
		title: 'Chat eClass'
	});
})

io.on('connection', function(socket){
	console.log('se conecto un usuario');

  	socket.on('chat message', function(msg, nick) {
		io.emit('chat message', msg, nick);
	});

	socket.on('disconnect', function() {
		io.emit('user disconnect', socket.nick);
	});

	socket.on('user connect', function(nick) {
		socket.nick = nick;
		io.emit('user connect', socket.nick);
	});
});


server.listen(3000, function() {
    console.log('Escuchando en el puerto %d', server.address().port);
});