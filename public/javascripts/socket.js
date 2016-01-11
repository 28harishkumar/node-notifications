function socketio(url,username, callback){
	var socket = io.connect(url);
	socket.on('connection', function (msg) {
	 	socket.emit('auth',{user:username})
	});

	socket.on('listner',function(session){
		socket.on(session['sessionID'], function(data){
			callback(data.data);
		});
	});
}

function notifyMe(user,message) {
	// Let's check if the browser supports notifications
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}
	// Let's check if the user is okay to get some notification
	else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
		var options = {
			body: message,
			dir : "ltr"
		};
		var notification = new Notification(user + " Posted a comment",options);
	}
	// Otherwise, we need to ask the user for permission
	// Note, Chrome does not implement the permission static property
	// So we have to check for NOT 'denied' instead of 'default'
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
  			// Whatever the user answers, we make sure we store the information
  			if (!('permission' in Notification)) {
				Notification.permission = permission;
  			}
  			// If the user is okay, let's create a notification
  			if (permission === "granted") {
				var options = {
					body: message,
					dir : "ltr"
				};
				var notification = new Notification(user + " Posted a comment",options);
  			}
		});
	}
}