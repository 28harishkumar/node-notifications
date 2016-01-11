var debug = require('debug')('routing:index');
var app = require('../app');
var listener = require('../listeners/index');
var pusher = require('../middlewares/pusher');
var errors = require('../middlewares/errors');

// ***DEPRECATED*** dummy page for client
// comment it in production
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.post('/emit',
  pusher.validatePusher,
  pusher.sendNotification);

// end point for gcm push on android
app.post('/gcm-emit',
  pusher.validatePusher,
  pusher.sendGCMAlert);

// when a new user is connected
app.io.sockets.on('connection', function (socket) {
    // socket listener object for current session
    var on = listener(socket);
    // send acknowledgement to client
    socket.emit('connection');
    // identify the user
    socket.on('auth', on.auth);
    // when connection disconnect
    socket.on('disconnect',on.disconnect);
});

Object.keys(errors).forEach(function(key){
  app.use(errors[key]);
});

module.exports = app;
