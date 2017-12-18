var socket = io();
var login = jQuery('#login');
var username_jQ = jQuery('[name=username]');
var password_jQ = jQuery('[name=password]');

socket.on('connect', function () {
    console.log('client side: connected');
});

jQuery('#login').on('submit', function (e) {
    e.preventDefault();
    var username = username_jQ.val();
    var password = password_jQ.val();
    socket.emit('loginReq', {username, password}, function(err) {
        if (err === 'invalid credentials') {
            console.log(err);
        } else {
            console.log('successful login!', err);
        }
    });
});
