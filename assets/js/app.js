var app = function() {
	var nickname = ''
		socket = null;

	this.init = function() {
		var self = this;

		$('.intro form').submit(function(e) {
			e.preventDefault();

			var nickname = $(this).find('.nickname').val();
			if (nickname.length < 1) {
				alert('Enter a nickname');
				return;
			}

			self.initIo();

			self.nickname = nickname;

			$('h5 span').text(nickname);
			$('.intro').fadeOut('fast', function() {
				$('.chat').fadeIn('fast');
				$('.writing input').focus();
			});

			self.socket.emit('user connect', self.nickname);

		});

		$('.writing form').submit(function(e) {
			e.preventDefault();

			var message = $(this).find('input');
			if (message.length < 1) {
				alert('Enter a message');
				return;
			}

			self.socket.emit('chat message', message.val(), self.nickname);
			message.val('');
		});
	}

	this.initIo = function() {
		this.socket = io();

		this.socket.on('chat message', function(msg, nickname) {
			$('.room ul').append('<li><cite>' + nickname + '</cite> <span>' + msg + '</span></li>');

			var room = $('.room');
			room.scrollTop(room[0].scrollHeight);
		});

		this.socket.on('user disconnect', function(nick) {
			$('.room ul').append('<li class="system">' + nick + ' has gone</li>');
		});
		this.socket.on('user connect', function(nick) {
			$('.room ul').append('<li class="system">' + nick + ' has joined</li>');
		});
	}

	this.init();
};

$(document).ready(app);