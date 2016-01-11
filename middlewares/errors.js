var errors = {
	// ***USE ONLY IN DEVELOPMENT, COMMENT IT IN PRODUCTION***
	500: function(err, req, res, next) {
	  	res.status(err.status || 500);
	  	res.render('error', {
		    message: err.message,
		    error: {}
	  	});
	},

	// catch 404 and forward to error handler
	404: function(err, req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	}
}

module.exports = errors;