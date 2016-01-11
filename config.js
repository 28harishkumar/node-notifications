var config = {
	auth_token : 'a_random_string_set_by_admin_of_the_server',
	gcm_authorization_key : 'gcm_authorization_key_provided_by_google',
	port: '3000',
	// database configuration
	db: require('rc')('notifications',{ // need not to change this line
			host: 'localhost', // host
			user : 'root', // username of mysql
			password : 'itsmine', // password of mysql user
			database: 'notifications', // database in mysql
			min : 1, // minimum number of connections
			max : 50 // maximum number of connections
		})
}

module.exports = config;