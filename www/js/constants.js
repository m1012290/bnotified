angular.module('bnotifiedapp')
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized',
  jsonwebtokenExpired : 'json-web-token-expired'
})
.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
})
.constant('NETWORK_STATES', returnNetworkStates)
.constant('NODE_SERVER_DETAILS', {
  server : 'bnotified-service-m1012290.c9users.io',
  protocol : 'https',
  port : 8080
});

function returnNetworkStates(){
    var states = {};
    console.log('Connection.UNKNOWN ['+ Connection.UNKNOWN +']');
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'Please check your internet connection';
    return states;
}