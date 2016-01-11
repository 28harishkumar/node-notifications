var debug = require('debug')('middleware:auth');
var http = require('http');
var config = require('../config');
var listener = require('../listeners/index');

var pusher = {
	// validate request coming from remote server using auth_token
	validatePusher: function(req, res, next){
		var auth_token = config.auth_token;
		// send error for invalid request
		if(!req.body.auth_token || req.body.auth_token != auth_token){
			var err = new Error('invalid request');
			err.status = 403;
			next(err);
		}
		next();
	},

	// send data to user using sockets
	sendNotification: function(req, res, next){
	    var flag = listener().notification(req);
	    if(flag === true){
	      res.send('success');
	    }else{
	      var err = new Error('Invalid data provided.');
	      err.status = 405;
	      next(err);
	    }
	},

	// gcm (one dimentional array, joined with commas(,)) and data (stringified json)
	sendGCMAlert: function (req, res, next) {
		var err, gcm_list, data;
		if(!req.body.gcm || !req.body.data){
			err = new Error('Invalid parameters sent');
			err.status = 405;
			return next(err);
		}

		gcm_list = req.body.gcm.split(',');
		try{
			data = JSON.parse(req.body.data);
		} catch(e){
			err = new Error('Data is not a valid stringified json');
			err.status = 405;
			return next(err);
		}

		var index = gcm_list.length, i = 1;
		
		gcm_list.forEach(function(gcm){
			var post_data = JSON.stringify({
				'data': {					
					'data' : data					
				},
				'to': gcm
			});

			var post_options = {
			    host: 'gcm-http.googleapis.com',
			    port: '80',
			    path: '/gcm/send',
			    method: 'POST',
			    headers: {
			        'Content-Type': 'application/json',
			        'Content-Length': Buffer.byteLength(post_data),
			        'Authorization': 'key='+config.gcm_authorization_key
			    }
			};

			// Set up the request
			var post_req = http.request(post_options, function(response) {
			    response.setEncoding('utf8');
			    response.on('data', function (chunk) {
			        console.log('Response: ' + chunk);
			    });
			});

			// post the data
			post_req.write(post_data);
			post_req.end();
			
			if(index == i){
				res.send('success');
			}
			i++;
		});
	}
};

module.exports = pusher;