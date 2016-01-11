## Basic Info
* Framework used: Express.io
* Template: Jade
* Purpose: Sending data to client from node server using socket.io (all platforms) and GCM token (only on androids).

## Installation
1. Set config.js file
	* auth_token (a random secret string, this token will be sent from remote server in each request).
	* gcm_authorization_key (API key of google app)
	* port (port on which node server will run, default is 3000)
	* Setup database config (mension in file)
2. Setup database:
	* import attached sql file (This file contains table structure for storing pending notificatoins for inacive users).
3. Run these commands in terminal:
	* npm install
	* npm start


## How to use
### Step 1) Include script for client

First of all include these files in frontend page:

1. ```<script src="/socket.io/socket.io.js"></script>```
2. ```<script src="http://code.jquery.com/jquery-1.7.1.min.js">```
3. ```<script src="/public/javascripts/socket.js"> ```

Last file provides a socketio() function which accepts three parameters:
	- link of node server
	- Identification of user (may be username, user_id or something similar)
	- callback function (this function will be called when notice is sent from server).

Call socket.io() function like this:

```$(document).ready(function(){ socketio("http://localhost:3000", '233453', callback);});```

callback function excepts one argument (data which is sent from server). 
This argument will be string only. If you send stringify json from server then first parse it in callback function.
callback function will not parse JSON automatically.

**NOTE:**
	1. you have to set user identification dynamically. 
	2. It must be unique for each user (not for each device).
	3. JS file links are relative here but give absolute links in production code

### Step 2.1) Send Data via web socket
For sending data to client (using socket) hit POST request on url http://localhost:3000/emit with following parameters:
1. auth_token (equal to the value set in config.js file)
2. users (identification of users, saperated by comma (,))
3. data (a string)

**NOTE:**
	1. If you are sending json as data then stringify it in callback function yourself.
	2. Users will get message only if they are active.

### Step 2.2) Send data via GCM (for android)
For sending data to client (using GCM) hit POST request on url http://localhost:3000/gcm-emit with following parameters:
1) auth_token (equal to the value set in config.js file)
2) gcm (gcm token of all devices with comma (,) saperated)
3) data (a stringified json object)

**NOTE:**
	1. Only stringified JSON object is accepted for data
	2. Devices will get notification even if user(s) is (are) not active.

### Step 3) Get response from node server
If notification are sent successfully, you will get "success" (without colons) message in response.

**NOTE:** This is a text response, not a HTML response.

## Desktop Notifications
If you want to turn on desktop notification then you can use notifyMe() function defined in public/javascripts/socket.js.
This function accepts two parameters: 
	1. Title of the message
	2. Body of the message

You can use this function like this:
 
```	function callback(data){
		data = JSON.parse(data);
		notifyMe(data.name, data.message);
	}

	$(document).ready(function(){ 
		socketio("http://localhost:3000", '233453', callback);
	});```

## Node server code flow:
1. Server is started by executing bin/www file 
2. www file includes routes/index file 
3. routes/index file returns the app object (app is server instance which is created in app.js file). 
4. purpose of routes/index file is routing (app.js file is included here and routes are attached with app object). 
5. HTTP requests are handled in middlewares directory 
	* pusher.js is handling normal http requests from remote server
 	* errors.js is handling errors (all errors written here will be included automatically) 
6.  Socket requests are handled in listeners directory 
	* index.js is handling events 
7. Database transactions are handled in models directory
	* db.js file is used to setup database connection
	* pending_queue.js file is linked with pending_queue table in database. (sql file attached)


**NOTE:** All files are well commented, Open files for more details
