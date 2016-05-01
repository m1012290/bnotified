// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('bnotifiedapp', ['ionic','bnotifiedappctrls','bnotifiedappsvcs', 'ionnumerickeypad', 'ngCordova', 'ionMdInput', 'ngMessages', 'ngTouch', 'jett.ionic.filter.bar'])
.run(['$ionicPlatform','$ionicPopup','NETWORK_STATES','$cordovaSQLite','registrationdetsdb','DBA','$state','$ionicHistory','$cordovaPush', '$rootScope', function($ionicPlatform, $ionicPopup, NETWORK_STATES, $cordovaSQLite, registrationdetsdb, DBA, $state, $ionicHistory, $cordovaPush, $rootScope) {
  $ionicPlatform.ready(function() {
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    console.log('checking internet connectivity');
    var state = checkForInternetConnection($ionicPlatform);
    
    if(state === 'none'){
           console.log('no internet connectivity hence the pop up ['+ state +']');
           var alertPopup = ionicAlertPopup($ionicPopup);
           alertPopup.then(function(res) {
              alertPopup.close();
           });
    }
      
    if(window.cordova) {
        // App syntax
        console.log('Within OpenDB call');
        db = $cordovaSQLite.openDB({name:"bnotified.db"});
    }else{/*
        window.sqlitePlugin.openDatabase({name:"bnotified.db"}, function (db) {
            db = db; 
        });*/
        
        db = window.openDatabase("bnotified.db", "1.0", "Demo", -1);
        console.log('printing db object ['+ db + ']');
    }
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS registrationtable(mobilenumber integer, registrationtoken text, deviceuuid text, jsonwebtoken text)").then(function(result){
       console.log('Table created successfully with result as ['+ result.rows.length + ']'); 
    }).catch(function(error){
        console.log('Table creation failed with error as ['+ error + ']');
    });
    /*
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS notificationstable(notificationid text primary key not null, entityid integer, notificationtext text, notificationdatetime text, messageread text)").then(function(result){
        console.log('notificationstable creation was successful');
    }).catch(function(error){
        console.log('notificationstable creation failed with errors as ['+ error + ']');
    }); */
    /*var registrationhandler = function(data){
        //on successful registration handling the scenario
        console.log('data registration id ['+ data.registrationId + ']');
        registrationdetsdb.add({mobilenumber:0, registrationtoken:data.registrationId});
    };

    var notificationhandler = function(data){
        console.log('notification handler ['+ JSON.stringify(data) + ']');   
    };

    var errorhandler = function(error) {
        console.log('error encountered while registering the device ['+ error + ']');  
    };
    */
      
    window.onNotification = function(e){
        console.log('onNotification recieved using window object['+ JSON.stringify(e) + ']');
        switch(e.event) {
        case 'registered':
          if (e.regid.length > 0 ) {
            //alert('registration ID = ' + notification.regid);
              console.log('data registration id ['+ e.regid + ']');
              registration_token = e.regid;
              registrationdetsdb.add({mobilenumber:0, registrationtoken:e.regid, deviceuuid:device.uuid});
          }
          break;
              
        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          alert('message = ' + e.message + ' msgCount = ' + e.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + e.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }  
          
      
      }
      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {
    
          console.log('printing event object when inline message is recieved ['+ JSON.stringify(event) + ']');
          console.log('printing notification object when inline message is recieved ['+ JSON.stringify(notification) + ']');      
      switch(notification.event) {
        case 'registered':
          if (notification.regid.length > 0 ) {
            //alert('registration ID = ' + notification.regid);
              console.log('data registration id ['+ notification.regid + ']');
              registration_token = notification.regid;
              registrationdetsdb.add({mobilenumber:0, registrationtoken:notification.regid, deviceuuid:device.uuid});
          }
          break;
              
        case 'message':
          // this is the actual push notification. its format depends on the data model from the push server
          console.log('printing event object when inline message is recieved ['+ JSON.stringify(event) + ']');
          console.log('printing notification object when inline message is recieved ['+ JSON.stringify(notification) + ']');
          alert('message = ' + notification.message + ' msgCount = ' + notification.msgcnt);
          break;

        case 'error':
          alert('GCM error = ' + notification.msg);
          break;

        default:
          alert('An unknown GCM event has occurred');
          break;
      }
    });

    
    if(window.cordova){
        console.log('Printing device object ['+ JSON.stringify(device) +']');
        var registrationtoken = null;
        registrationdetsdb.query({}).then(function(result){
            var result = DBA.getById(result);
            
            if(!result || !result.registrationtoken){
                /*console.log('Before Push Notifications Invocation within Bnotified');
                var push = PushNotification.init({ "android": {
                    "senderID": '496534223786'
                }});
                push.on('registration', registrationhandler);
                push.on('notification', notificationhandler);
                push.on('error', errorhandler);*/
                
                 $cordovaPush.register({"senderID": "496534223786", "ecb":"onNotification"}).then(function(result){
                    console.log('registration was successful with result of it as ['+ JSON.stringify(result) + ']');   
                 }, function(error){
                    console.log('registration failed hence to try again ['+ error + ']');
                 });
            }else{
                registration_token = result.registrationtoken;
                console.log('registrationtoken retrieved from DB is ['+ result.registrationtoken + ']');
                console.log('Already registered on database hence skipping it'); 
            }
        }).catch(function(error){
            console.log('Error encountered while retrieving registration token hence let registration happen['+ error + ']');
        });
    }else{
        var registrationtoken = null;
        registrationdetsdb.query({}).then(function(result){
            console.log('result.rows ['+ JSON.stringify(result.rows) + ']');
            
        if(result.rows.length === 0){
                
            registrationdetsdb.add({mobilenumber:9739314152, registrationtoken:'APA91bF1pmC17Kw6f9r0V2QwYh-tTmCL3NZzn7aV0NzNDxPhj066aqpAR4oNqfJhqsrirxe2Ay3J7Ghsdt9DwuT701hu2ZyNMbnEJ0YkCActRPQNVTd7A9AU9q1acibh01IfU6I33m_PyHfFNaryvrhOnsbHCkVq5w', deviceuuid:'b80d1ec1a4765302'});
            }else{
                var result = DBA.getById(result);
                registration_token = result.registrationtoken;
                console.log('registrationtoken retrieved from DB is ['+ result.registrationtoken + ']');
                console.log('Already registered on database hence skipping it'); 
            }
        }).catch(function(error){
            console.log('Error encountered while retrieving registration token hence let registration happen['+ error + ']');
        });
    }
    
  });
  ionic.Platform.isFullScreen = true;
  window.addEventListener('native.keyboardshow', function(){
    //cordova.plugins.Keyboard.close();//suppressing native keyboard
  });
    
  window.addEventListener("offline", function(){
    console.log('device went offline ');
    var alertPopup = ionicAlertPopup($ionicPopup);
    alertPopup.then(function(res) {
        //console.log('');
    });
  }, false);
    
  $ionicPlatform.registerBackButtonAction(function(event) {
    console.log('printing state name-->'+$state.current.name);
    if ($state.current.name === 'forgotpassword' || $state.current.name === 'main.recentnotifications' || $state.current.name === 'main.listedentities' || $state.current.name === 'landing') { // your check here
      /*$ionicPopup.confirm({
        title: 'Exit',
        template: 'are you sure you want to exit?'
      }).then(function(res) {
        if (res) {
          ionic.Platform.exitApp();
        }
      })*/
        
    //else if($state.current.name === 'landing')  {
        ionic.Platform.exitApp();
    //}
    }else{
        //console.log('have to return to previous view ['+ JSON.stringify($ionicHistory.viewHistory()) +']');
        console.log('Printing backview object[' + JSON.stringify($ionicHistory.backView()) + ']');
        $ionicHistory.goBack();
    }
  }, 100);
    
   /*$ionicPlatform.onHardwareBackButton(function(event){
         console.log('Printing current state name -->'+ $state.current.name);
        if($state.current.name === 'main.recentnotifications' || $state.current.name === 'main.listedentities'){
            $ionicPopup.confirm({
                title: 'Exit',
                template: 'are you sure you want to exit?'
            }).then(function(res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })    
        }
        
    });*/
}])
.config(['$stateProvider', '$urlRouterProvider','USER_ROLES', function ($stateProvider, $urlRouterProvider, USER_ROLES) {
  $stateProvider
  .state('landing', {
    url: '/landing',
    templateUrl: 'templates/landing.html',
    controller: 'LoginCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'MobileNumberCtrl'
  })
  .state('password', {
    url: '/:mobilenumber/password',
    templateUrl: 'templates/password.html',
    controller: 'PasswordCtrl'
  })
  .state('register', {
     url:'/register',
     templateUrl : 'templates/registration.html',
     controller: 'RegistrationCtrl'
  })
  .state('securitydetails',{
     url: '/:mobilenumber/securitydetails',
     templateUrl: 'templates/securitydetails.html',
     resolve : {
           securityquestionservice : 'securityquestionservice',
           securityquestions : function(securityquestionservice, $stateParams){
                return securityquestionservice.getSecurityQuestions($stateParams.mobilenumber);     
           },
           mobilenumber : function($stateParams){
                return $stateParams.mobilenumber;   
           }
     },
     /*controller: function($scope, $rootScope, securityquestions){
            $scope.securityquesdata = {
                securityquestions : securityquestions,
                selectedquestion  : ''
            }
     }*/
      controller : 'SecurityDetailsCtrl'
  })
  .state('forgotpassword',{
      url :'/:mobilenumber/forgotpassword',
      templateUrl:'templates/forgotpassword.html',
      resolve : {
           securityquestionservice : 'securityquestionservice',
           securityquestions : function(securityquestionservice, $stateParams){
                return securityquestionservice.getSecurityQuestions($stateParams.mobilenumber);     
           }
      },
      controller: 'ForgotPasswordCtrl'
  })
  .state('main', {
    url : '/main',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    data : {
       mobilenumber : ""
    },
    controller : function($scope, $state){
        $scope.mobilenumber = $state.current.data.mobilenumber;
        console.log('$scope.mobilenumber within main ['+ $scope.mobilenumber + ']');
    }
/*    resolve : {
        mobilenumber : function($stateParams){
            $stateParams.mobilenumber = 
            return $stateParams.mobilenumber;
        }
    }*/
  })
  .state('main.recentnotifications', {
    cache: false,
    url: '/recentnotifications/:mobilenumber',
    views: {
        'recent-notifications': {
          templateUrl: 'templates/recententities/recententities.html',
          resolve : {
              mobilenumber : function($stateParams){
                    return $stateParams.mobilenumber;
              }
          },
          controller : 'RecentEntitiesCtrl'
        }
    }
  })
  .state('main.listedentities', {
    cache: false,
    url: '/listedentities',
    views: {
        'listed-entities': {
          templateUrl: 'templates/listedentities/listedentities.html',
          controller: 'EntitiesCtrl'
        }
    }
  })
  /*.state('main.allnotifications',{
    cache: false,
    url: '/allnotifications',
    views: {
        'all-notifications':{
            templateUrl: 'templates/inbox/inboxofallmsg.html',
            controller : 'InboxOfAllMsgCtrl'
        }
    }
  })*/
  .state('main.allnotifications', {
    cache: false,
    url: '/allnotifications',
    views: {
        'all-notifications': {
          templateUrl: 'templates/inbox/inboxofallmsg.html',
          controller: 'InboxOfAllMsgCtrl'
        }
    }
  })
  .state('notifications', {
    cache: false,
    url : '/:entityid/:mobilenumber/notifications',
    templateUrl : 'templates/notifications.html',
    controller: 'NotificationsCtrl'
  })
  .state('addsubscriptions',{
    cache:false,
    url:'/addsubscriptions',
    templateUrl:'templates/addsubscription.html',
    controller: 'SubscriptionCtrl'
  })
  .state('logout', {
    url: '/logout',
    controller: 'LogoutCtrl'
  })
  .state('aboutus', {
    url: '/aboutus',
    controller: 'AboutusCtrl'
  });
  $urlRouterProvider.otherwise('/landing');
}])
.config(['$httpProvider', function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}])
.filter('groupByDayMonthYear', ['$parse',function($parse) {
		var dividers = {};

		return function(input) {
            //console.log('filter called with input [' + JSON.stringify(input) + ']');
			if (!input || !input.length) return;
			
			var output = [], 
				previousDate, 
				currentDate;

			for (var i = 0, ii = input.length; i < ii && (item = input[i]); i++) {
                //console.log('printing item value ['+ JSON.stringify(item) + ']');
                //console.log('item.CreatedAt ['+ item.createdAt +']');
				currentDate = moment.utc(item.createdAt);
                //console.log('current date as UTC ['+ currentDate.format('DDMMYYYY') + ']');
                //console.log('previous date ['+ previousDate.format('DDMMYYYY') + ']');
                /*if(previousDate){
                    console.log('previous date ['+ previousDate.format('DDMMYYYY') + ']');
                }*/
                //console.log('currentDate is same as Previous Date ['+ currentDate.isSame(previousDate) + ']');
                if (!previousDate ||
					!(currentDate.format('DDMMYYYY') === previousDate.format('DDMMYYYY'))) {
                    //console.log('inside if printing divider');
					var dividerId = currentDate.format('DDMMYYYY');
					//console.log('dividerId is ['+ dividerId + ']');
					if (!dividers[dividerId]) {
						console.log('inside if ');
                        dividers[dividerId] = {
							isDivider: true,
							_id: dividerId,
							divider: currentDate.format('DD MMMM YYYY') 
						};
					}
					//console.log('printing dividers[dividerId ['+ JSON.stringify(dividers[dividerId]) + ']');
                    output.push(dividers[dividerId]);
                    //console.log('printing output ['+ JSON.stringify(output) +']');
				}
                //console.log('item being pushed is ['+ JSON.stringify(item) + ']');
				output.push(item);

				previousDate = currentDate;
			}
            //console.log('printing output ['+ JSON.stringify(output) + ']');
			return output;
		};

}]);
//function which validates internet connectivity
function checkForInternetConnection($ionicPlatform){
    var networkState = '';
    $ionicPlatform.ready(function(){
        if(window.cordova && window.navigator.connection){
            networkState = navigator.connection.type;
        }
        console.log('printing networkState when the device is ready on phone ['+ networkState + ']')
    });
    return networkState;
}

function ionicAlertPopup($ionicPopup){
    var alertPopup = $ionicPopup.alert({
             title: 'No Internet Connection',
             template: 'Please check your internet connectivity'
           });
    
    return alertPopup;
}