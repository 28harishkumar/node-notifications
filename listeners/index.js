var debug = require('debug')('routing:index');
var queue = require('../models/pending_queue');
var users = {};
// user['username']

var listener = function(socket){
	var on = {
		// take data to send
		auth : 	function(data){
			if(!data.user){
				socket.disconnect();
			}
			//data.user = some_function(data.user);
			socket.user = data.user;
			if(Object.keys(users).indexOf(data.user)>-1){
				if(users[data.user].indexOf(socket)>-1){
				  	// do not accept repeated id
				} else{
				  	users[data.user].push(socket);
				}
			} else{
				users[data.user] = [socket];
			}

			// An event for sending notification
			socket.emit('listner',{'sessionID':socket.id});

			// send pending notifications
			queue.select({user:data.user},function(err, pending_notices){
				if(!err && pending_notices && pending_notices.length){
					pending_notices.forEach(function(notice){
						socket.emit(socket.id, { 'data': notice.data });
						// delete notification from database
						queue.remove(notice.id, function(e, r){
							console.log('notification removed');
						});
					});
				}
			});
		},

		// req from user
		notification: function(req){
			var body = req.body;
			if(!body.data || !body.users){
				return false;
			}

			// all valid users
			var user_ids = body.users.split(',');
			user_ids.forEach(function(id){
				// if user is active
				if(Object.keys(users).indexOf(id) > -1){
					// for each device of the user
					users[id].forEach(function(user_socket){
						// emit data for the user
						user_socket.emit(user_socket.id,{'data':body.data});
					});
				} else{
					// if user is not active then save entry in database
					var pending = {
						user: id,
						data: body.data
					};
					queue.insert(pending,function(err, result){
						console.log('notification inserted');
					});
				}
			});
			return true;
		},

		// uses socket of disconnected user
		disconnect: function() {
			var index = users[socket.user].indexOf(socket);
			if (index > -1) {
			    users[socket.user].splice(index, 1);
			}
	    }
	}
	return on;
}

module.exports = listener;