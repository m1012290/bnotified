angular.module('bnotifiedappsvcs', ['ngResource'])

/*.service('AuthService', ['$q', '$http', 'USER_ROLES', function($q, $http, USER_ROLES) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var username = '';
  var isAuthenticated = false;
  var role = '';
  var authToken;
 
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    username = token.split('.')[0];
    isAuthenticated = true;
    authToken = token;
 
    if (username == 'admin') {
      role = USER_ROLES.admin
    }
    if (username == 'user') {
      role = USER_ROLES.public
    }
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
 
  var login = function(name, pw) {
    return $q(function(resolve, reject) {
      if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
        // Make a request and receive your auth token from your server
        storeUserCredentials(name + '.yourServerToken');
        resolve('Login success.');
      } else {
        reject('Login Failed.');
      }
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
 
  loadUserCredentials();
 
  return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
}])*/
.factory('registrationservice', ['$q','$resource','NODE_SERVER_DETAILS', function($q, $resource, NODE_SERVER_DETAILS){
    var registrationservice = {};
    var self = this;
    registrationservice.validateMobileNumber = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/validate');
        resource.get({mobileNumber:mobilenumber}, 
        function(data){
           console.log('successfully called validate service ['+ JSON.stringify(data) +'] ');
           deferred.resolve(data);
        }, function(error){
            console.log('failed calling validate service ['+ error +']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    // save registration details to backend
    registrationservice.saveRegistrationDetails = function(registrationdetails){
        console.log('within saveRegistrationDetails service');
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/register', {mobileNumber:registrationdetails.mobilenumber});
        var payload = { securitydetails : 
                        {   mobilenumber:registrationdetails.mobilenumber,
                            securitypin:registrationdetails.securitydetails.securitypin,
                            securityquestion:registrationdetails.securitydetails.securityquestion,
                            securityquestionanswer:registrationdetails.securitydetails.securityquestionanswer,
                            registrationtoken:registrationdetails.securitydetails.registrationtoken
                        } 
                      };
        resource.save(payload, 
        function(data){
            console.log('successfuly called saveRegistrationDetails service ['+ JSON.stringify(data) + ']');
            deferred.resolve(data);
        }, function(error){
            console.log('failed calling saveRegistrationDetails service [' + error + ']');
            deferred.reject(error);
        });
        
        return deferred.promise;
    };
    return registrationservice;
}])
.factory('securityquestionservice', ['$q', '$resource', 'NODE_SERVER_DETAILS', function($q, $resource, NODE_SERVER_DETAILS){
    var securityquestionsvc = {};
    
    securityquestionsvc.getSecurityQuestions = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/securityquestionlist');
        resource.query({mobileNumber:mobilenumber}, function(data){
            console.log('successfully called getSecurityQuestions service ['+ JSON.stringify(data) +'] '); 
            deferred.resolve(data);
        }, function(error){
            console.log('failed calling securityquestionlist service ['+ error +']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    securityquestionsvc.saveSecurityDetails = function(securitydetails){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/register');
        resource.save({securitydetails:securitydetails}, function(data){
            console.log('successfully called saveSecurityDetails service [' + JSON.stringify(data) +'] '); 
            deferred.resolve(data);
        }, function(error){
            console.log('failed calling saveSecurityDetails service ['+ error +']');
            deferred.reject(error); 
        });
        return deferred.promise;
    };
    return securityquestionsvc;
}])
.factory('initiateotpgeneratesvc', ['$q', '$resource','NODE_SERVER_DETAILS',function($q, $resource, NODE_SERVER_DETAILS) {
    var initiateotpgeneratesvc = {};
    initiateotpgeneratesvc.generateOtp = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/generateotp',{mobileNumber:mobilenumber});
        resource.save({mobileNumber:mobilenumber}, function(data){
            console.log('successfully called generateOtp service ['+ JSON.stringify(data) +']'); 
            deferred.resolve(data);
        },  function(error){
            console.log('failed calling generateOtp service ['+ error +'] '); 
            deferred.reject(error);
        });
        return deferred.promise;
    };
    initiateotpgeneratesvc.validateOtp = function(mobilenumber, otp){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/validateotp',
                                 {mobileNumber:mobilenumber});
        console.log('otp has been passed as ['+ otp + ']');
        var postdata = {otp:otp, mobileNumber:mobilenumber};
        resource.save(postdata, function(data){
            console.log('successfully called validateOtp service ['+ JSON.stringify(data) + ']');
            deferred.resolve(data);
        },  function(error){
            console.log('failed calling validateOtp service ['+ error +'] '); 
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return initiateotpgeneratesvc;
}])
.factory('pushnotificationservice', ['$q', '$resource', '$ionicPlatform', function($q, $resource, $ionicPlatform){
    var pushnotificationservice = {};
    pushnotificationservice.registerDevice = function(registrationhandler, notificationhandler, errorhandler){
        
        $ionicPlatform.ready(function() {
            push = PushNotification.init({ "android": {
                "senderID": '496534223786'
            }});
            push.on('registration', registrationhandler);
            push.on('notification', notificationhandler);
            push.on('error', errorhandler);
        });
    };
    return pushnotificationservice;
}])
.factory('internetservice', ['$ionicPlatform', '$rootScope', function($ionicPlatform, $rootScope){
    return {
        //only passed during testing on device
        isInternetAvailable : function(){
            var self = this;
            self.available = true;
            $ionicPlatform.ready(function() {
                if(window.cordova && window.navigator.connection){
                    self.networkState = navigator.connection.type;
                    if(self.networkState === 'none'){
                      //broadcast an event which can tell the appctrl to pop up this message to user
                      //take it from there
                        self.available = false;
                        $rootScope.$broadcast('NoInternet');
                    }
                }
            });
            return self.available;
        }
    };
    
}])
.factory('DBA', ['$q', '$cordovaSQLite', '$ionicPlatform', function($q, $cordovaSQLite, $ionicPlatform){
    var self = this;
    // Handle query's and potential errors
    self.query = function (query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function () {
          $cordovaSQLite.execute(db, query, parameters)
            .then(function (result) {
              console.log('successfully queried result using ['+ query + ']');
              q.resolve(result);
            }, function (error) {
              console.warn('Error encountered while performing query');
              console.warn(error);
              q.reject(error);
            });
        });
        return q.promise;
    }

    // Proces a result set
    self.getAll = function(result) {
        var output = [];

        for (var i = 0; i < result.rows.length; i++) {
          output.push(result.rows.item(i));
        }
        return output;
    }

    // Proces a single result
    self.getById = function(result) {
        var output = null;
        output = angular.copy(result.rows.item(0));
        //console.log('output obtained from getById is['+ output.registrationtoken + ']');
        return output;
    }
    return self;
}])
.factory('registrationdetsdb', ['DBA', function(DBA){
    var self = this;
    self.add = function(registrationdets){
        var parameters = [registrationdets.mobilenumber, registrationdets.registrationtoken, registrationdets.deviceuuid];
        return DBA.query("INSERT INTO registrationtable (mobilenumber, registrationtoken, deviceuuid) VALUES (?,?,?)", parameters);
    };
    self.updateMobileNumber = function(registrationdets) {
        var parameters = [registrationdets.mobilenumber];
        return DBA.query("UPDATE registrationtable SET mobilenumber = (?)", parameters);
    };
    self.query = function(registrationdets) {
        return DBA.query("SELECT mobilenumber, registrationtoken, deviceuuid, jsonwebtoken from registrationtable");
    };
    self.updateJWT = function(registrationdets){
        var parameters = [registrationdets.jsonwebtoken, registrationdets.mobilenumber];
        return DBA.query("UPDATE registrationtable SET jsonwebtoken = (?) where mobilenumber = (?)",parameters);
    };
    self.updateJWTWithoutMobileNo = function(registrationdets){
        var parameters = [registrationdets.jsonwebtoken];
        return DBA.query("UPDATE registrationtable SET jsonwebtoken = (?)",parameters);
    };
    
    return self;
}])
.factory('authservice',['$q', '$resource', 'NODE_SERVER_DETAILS', function($q, $resource, NODE_SERVER_DETAILS){
    var self = this;
    self.loginservice = function(mobilenumber, passcode, registrationtoken){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/login/authenticate');
        resource.save({mobileNumber:mobilenumber, bnotifiedpin:passcode, registrationToken:registrationtoken},
        function(data){
            console.log('login service successfully called with response ['+ JSON.stringify(data) + ']');
            deferred.resolve(data);
        }, function(error){
            console.log('login service call failed with response ['+ error + ']');
            deferred.reject(error);
        });
        return deferred.promise;    
    };
    
    self.validateMobileNumber = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/login/:mobileNumber/validate');
        resource.get({mobileNumber:mobilenumber}, function(data){
            console.log('validateMobileNumber service during login called successfully with response['+ JSON.stringify(data)+']');
            deferred.resolve(data); 
        }, function(error){
            console.log('validateMobileNumber service during login call failed ['+ JSON.stringify(error) + ']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    self.validateSecurityDetails = function(securitydetails){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/forgotpassword/validate',{mobileNumber:securitydetails.mobileNumber});
        resource.save(securitydetails, function(data){
            console.log('validateMobileNumber service during login called successfully with response['+ JSON.stringify(data)+']');
            deferred.resolve(data); 
        }, function(error){
            console.log('validateMobileNumber service during login call failed ['+ error + ']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    self.updatePassword = function(securitydetails){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registration/:mobileNumber/forgotpassword/updatepassword',{mobileNumber:securitydetails.mobileNumber}, {'update': { method:'PUT' } } );
        resource.update(securitydetails, function(data){
            console.log('updatePassword service during forgotpassword call was successful with response['+ JSON.stringify(data)+']');
            deferred.resolve(data);
        }, function(error){
            console.log('updatePassword service during forgotpassword call failed ['+ error + ']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return self;
}])
.factory('notificationservice', ['$q', '$resource','NODE_SERVER_DETAILS', function($q, $resource, NODE_SERVER_DETAILS){
    var self = this;
    self.getRegisteredEntities = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registered/entities/:mobileNumber');
        resource.get({mobileNumber:mobilenumber}, function(data){
            console.log('getRegisteredEntities service called successfully with response['+ JSON.stringify(data)+']');
            deferred.resolve(data); 
        }, function(error){
            console.log('getRegisteredEntities service call failed ['+ JSON.stringify(error) + ']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.getNotifications = function(mobilenumber, entityid, datetime){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registered/entitiesmessages/:mobileNumber/:entityId');
        resource.get({mobileNumber:mobilenumber, entityId:entityid}, function(data){
            //console.log('getNotifications service called successfully with response['+ JSON.stringify(data)+']');
            deferred.resolve(data);
        }, function(error){
            console.log('getNotifications service call failed ['+ JSON.stringify(error) + ']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.getAllNotifications = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registered/:mobileNumber/allmessages');
        resource.get({mobileNumber:mobilenumber}, function(data){
            //console.log('getNotifications service called successfully with response['+ JSON.stringify(data)+']');
            deferred.resolve(data);
        }, function(error){
            console.log('getNotifications service call failed ['+ JSON.stringify(error) + ']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    
    self.deleteNotification = function(mobilenumber, entityid, notificationid){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registered/:mobileNumber/message/:id');
        resource.delete({mobileNumber:mobilenumber, id:notificationid}, function(data){
           console.log('deleteNotification service called successfully with response['+ JSON.stringify(data)+']');
           deferred.resolve(data);
        }, function(error){
           console.log('deleteNotification service call failed ['+ error + ']');
           deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.deleteMultipleNotification = function(mobilenumber, entityid, notificationidlist){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registered/:entityId/:mobileNumber/messages', {entityId:entityid, mobileNumber:mobilenumber}, {'update': { method:'PUT' } });
        resource.update({listtobedeleted:notificationidlist}, function(data){
            deferred.resolve(data);
        }, function(errorresponse){
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.getRecentNotifications = function(mobilenumber, entityid){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registered/:mobileNumber/recentnotifications');
        resource.get({mobileNumber:mobilenumber}, function(data){
           console.log('getRecentNotifications service called successfully with response['+ JSON.stringify(data)+']');
           deferred.resolve(data);
        }, function(error){
           console.log('getRecentNotifications service call failed ['+ error + ']');
           deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.updateNotificationAsRead = function(mobilenumber, entityid, notificationidlist){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':'+ NODE_SERVER_DETAILS.port +'/bnotified/registered/:mobileNumber/:entityid/messagereadstatus', {mobileNumber: mobilenumber});
        resource.save({listtobeupdated:notificationidlist}, function(data){
           console.log('updateNotificationAsRead service called successfully with response['+ JSON.stringify(data)+']');
           deferred.resolve(data);
        }, function(error){
           console.log('updateNotificationAsRead service call failed ['+ error + ']');
           deferred.reject(error);
        });
        return deferred.promise;
        
    };
    
    self.unsubscribeFromEntity = function(mobilenumber, entityid){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':' + 
NODE_SERVER_DETAILS.port + '/bnotified/registered/:mobileNumber/:entityId/unsubscribeentity', {mobileNumber:mobilenumber, entityId:entityid});
        resource.save({mobileNumber:mobilenumber, entityId:entityid}, function(data){
             console.log('unsubscribeFromEntity service called successfully with response['+ JSON.stringify(data)+']');
           deferred.resolve(data);
        }, function(error){
           console.log('updateNotificationAsRead service call failed ['+ JSON.stringify(error) + ']');
           deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.listUnsubscribedEntities = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':' + NODE_SERVER_DETAILS.port + '/bnotified/registered/:mobileNumber/getunsubscribeentitylist');
        resource.get({mobileNumber:mobilenumber}, function(data){
            console.log('unsubscribed entity list obtained successfully with response ['+ JSON.stringify(data) + ']');
            deferred.resolve(data);
        }, function(error){
            console.log('unsubscribed entity list retrieval failed with response ['+ JSON.stringify(error) + ']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.subscribeEntities = function(mobilenumber, entityidlist){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':' + NODE_SERVER_DETAILS.port + '/bnotified/registered/:mobileNumber/subscribeentities', {mobileNumber:mobilenumber});
        resource.save({entityidlist:entityidlist}, function(data){
            console.log('re-subscription of entities was successful');
            deferred.resolve(data);
        }, function(error){
            console.log('re-subscription of entities failed with response ['+ JSON.stringify(error) +']');
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.unreadMessagesCount = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':' + NODE_SERVER_DETAILS.port + '/bnotified/registered/:mobileNumber/unreadmessages/count');
        resource.get({mobileNumber:mobilenumber}, function(data){
            deferred.resolve(data);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    self.messageBookmark = function(mobilenumber, bookmarkpayload){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':' + NODE_SERVER_DETAILS.port + '/bnotified/registered/:mobileNumber/message/bookmark', {mobileNumber:mobilenumber}, {'update': { method:'PUT' } } );
        resource.update({bookmarkpayload:bookmarkpayload}, function(data){
            deferred.resolve(data);
        }, function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
                        
    self.getBookmarkedMessages = function(mobilenumber){
        var deferred = $q.defer();
        var resource = $resource(NODE_SERVER_DETAILS.protocol + '://' + NODE_SERVER_DETAILS.server + ':' + NODE_SERVER_DETAILS.port + '/bnotified/registered/:mobileNumber/messages/bookmarked');
        resource.get({mobileNumber:mobilenumber}, function(data){
            deferred.resolve(data);     
        },function(error){
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    return self;
}])
.factory('AuthInterceptor', ['$rootScope','$q','registrationdetsdb', 'DBA','AUTH_EVENTS',function ($rootScope, $q, registrationdetsdb, DBA, AUTH_EVENTS) {
  return {
    'responseError': function (response) {
      console.log('error encountered');
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized,
        419: AUTH_EVENTS.jsonwebtokenExpired
      }[response.status], response);
      return $q.reject(response);
    },
    // optional method
      
    'request': function(config) {
      // do something on success
        var deferred = $q.defer();
        var url = String(config.url);
        
        //if(config.url && url.search('bnotified') != -1 && window.cordova){
        if(config.url && url.search('bnotified') != -1){
            //check if we do have an internet connectivity
            if(window.cordova && window.navigator.connection){
                if(navigator.connection.type === 'none'){
                    $rootScope.showToast('Please check your internet connectivity !!', 'long', 'center');
                    deferred.reject(config);
                }
            }
            //config.headers['Accept-Encoding']='gzip';
            registrationdetsdb.query({}).then(function(response){
                console.log('response rows fetched with pre-request ['+ response.rows.length + ']');
                var result = DBA.getById(response);
                console.log('response rows fetched with pre-request ['+ JSON.stringify(result) + ']');
                if(result && result.jsonwebtoken){
                    console.log('jsonwebtoken being passed is ['+ result.jsonwebtoken + ']');
                    config.headers['Authorization'] = result.jsonwebtoken;
                    console.log('printing config before leaving the request pre processing method ['+ JSON.stringify(config) + ']');
                    //deferred.resolve(config);
                    //return config;
                }
                deferred.resolve(config);
            }).catch(function(error){
                console.log('error fetching details from registrationtable within interceptor');  
                //return config;
                deferred.reject(config);
            });
        }else{
            return config;
        }
        return deferred.promise;
    }
  };
}]);