$(document).ready(function() {
  var login = jQuery('#login');
  var username_jQ = jQuery('[name=username]');
  var password_jQ = jQuery('[name=password]');

  $('#login').on('submit', function (e) {
      e.preventDefault();
      var username = username_jQ.val();
      var password = password_jQ.val();
      console.log(username, password);
      $.ajax({
          //The URL to process the request
            'url' : '/admin/login',
          //The type of request, also known as the "method" in HTML forms
          //Can be 'GET' or 'POST'
            'type' : 'POST',
            contentType: "application/json; charset=utf-8",
            //Any post-data/get-data parameters
          //This is optional
            'data' : JSON.stringify({
              'username' : username,
              'password' : password
            }),
          //The response from the server
            'success' : function() {
            //You can use any jQuery/JavaScript here!!!
              window.location.href = '/admin/'
            }
          });
  });
});