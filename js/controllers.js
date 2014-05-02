angular.module('starter.controllers', ['firebase', 'UserService'])

.controller('AppCtrl', function($scope) {
    $scope.user = undefined;

//    $scope.login = function(user) {
//      $scope.user = user;
//    }
//    $scope.logout = function() {
//      $scope.user = undefined;
//    }


})

  .controller('BusinessCtrl', function($scope, $stateParams, $firebase, fireUrl, Auth, UserService, $state, $rootScope) {
    var root = new Firebase(fireUrl);
    var busId = $stateParams.id;
    var ref = root.child('class/Business').child(busId);

    var bus = $firebase(ref);
    $scope.item = bus;

    var ownerId = $stateParams.ownerId;
    $scope.owner = $firebase(root.child('class/Person').child(ownerId));

    var personId = '_';
    if (Auth.user()) {
      personId = Auth.user().get('person').id;
      UserService.setCurrentUser(personId);
    }

//    $scope.busCust = $firebase(root.child('index/CustomerBusiness').child(personId));

    $scope.connect = function() {
      Parse.Cloud.run('DoConnect', {business:busId, customer:personId}, {
        success: function(result) {
          // result is 'Hello world!'
          console.log('connect bus', result);
//          $scope.modal.hide()
        },
        error: function(error) {
          console.log(error);
          alert('error: ' + error);
        }
      });
    }

    $scope.refer = function() {
      alert('Select a friend to refer to.');
      $rootScope.businessIdToRefer = busId;
      $state.go('app.friend_list');
    }

    $scope.isFavorite = function() {
      return UserService.isFavorite(busId);
    };

  })

  .controller('BusinessListCtrl', function($scope, $firebase, fireUrl, $ionicModal, UserService) {
    var ref = new Firebase(fireUrl).child('class/Business');

//    var join = Firebase.util.join(
//      ref, {
//        ref: ref,
//        keyMap: {
//          owner: new Firebase(fireUrl).child('class/Person')
//        }
//      }
//    );
    $ionicModal.fromTemplateUrl('modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal
    })

    $scope.add = function(){
      $scope.modal.show()
    }

    $scope.business_list = $firebase(ref);

    $scope.isActive = function(value) {
      //console.log('isActive', value);
      return value.active && value.name != '';
    };

    $scope.invite = {};

    $scope.doInvite = function(){
      Parse.Cloud.run('inviteBusiness', $scope.invite, {
        success: function(result) {
          // result is 'Hello world!'
          console.log('invite', result);
          $scope.modal.hide()
        },
        error: function(error) {
          $scope.invite.error = error;
        }
      });

    }

    navigator.geolocation.getCurrentPosition(function(position){
//      alert('Latitude: '          + position.coords.latitude          + '\n' +
//        'Longitude: '         + position.coords.longitude         + '\n' +
//        'Altitude: '          + position.coords.altitude          + '\n' +
//        'Accuracy: '          + position.coords.accuracy          + '\n' +
//        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
//        'Heading: '           + position.coords.heading           + '\n' +
//        'Speed: '             + position.coords.speed             + '\n' +
//        'Timestamp: '         + position.timestamp                + '\n');

      $scope.position = position.coords;
      $scope.$apply();
    });

    function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
          Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    $scope.distance = function(coords) {
      var me = $scope.position;

      if (me && coords) {
        return getDistanceFromLatLonInKm(coords.latitude, coords.longitude, me.latitude, me.longitude)
      } else
        return 8888;
    };
    $scope.isFavorite = function(busId) {
      return UserService.isFavorite(busId);
    };
  })

  .controller('CustomerListCtrl', function($scope, $firebase, fireUrl, Auth, $stateParams) {
    var uid = $stateParams.businessId;
    if (uid === '_my_' || uid == '') {
      uid = Auth.user().get('business').id;
    }

    var refDetail = new Firebase(fireUrl).child('class/Person');
    var refIndex = new Firebase(fireUrl).child('index/BusinessCustomer').child(uid);

    $scope.items = {}

    console.log(refIndex.toString());

    refIndex.on('child_added', function(data){
      console.log(data.name());
      var val = data.val();
      refDetail.child(val.customer.objectId).on('value', function(snap){
        console.log(snap.ref().toString(), snap.val())
        if (snap.val() === null) {

        } else {
          val.customer = snap.val();

          $scope.items[snap.name()] = val;
          $scope.$apply();
        }
      })
    })

    $scope.filter = function(value) {
      return value.active;
    };
  })

  .controller('FavoriteListCtrl', function($scope, $firebase, fireUrl, Auth, $stateParams) {
    var ref = new Firebase(fireUrl).child('class/Business');
    var refFav = new Firebase(fireUrl).child('index/CustomerBusiness');

    $scope.business_list = {}

    var uid = $stateParams.personId;
    if (uid === '_my_') {
      uid = Auth.user().get('person').id;
    }

    var busRef = refFav.child(uid);
    console.log(busRef.toString());

    busRef.on('child_added', function(data){
      console.log(data.name());
      ref.child(data.val().business.objectId).on('value', function(snap){
        console.log(snap.ref().toString(), snap.val())
        if (snap.val() === null) {

        } else {
          $scope.business_list[snap.name()] = snap.val();
          $scope.$apply();
        }
      })
    })

//    new FirebaseIndex(busRef, function(key) {
//      console.log('bus ', key);
//
//      return ref.child(key);
//    }).on('child_added', function(data){
//      $scope.business_list[data.name()] = data.val();
//      $scope.$apply();
//    })

    $scope.filter = function(value) {
      return value.active;
    };
  })

  .controller('FriendListCtrl', function($scope, $firebase, fireUrl, Auth, $ionicModal) {
    $ionicModal.fromTemplateUrl('modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal
    })

    $scope.add = function(){
      $scope.modal.show()
    }

    var uid = Auth.user().get('person').id;

    $scope.invite = {person: uid};

    $scope.doInvite = function(){

      Parse.Cloud.run('DoAddFriend', $scope.invite, {
        success: function(result) {
          // result is 'Hello world!'
          console.log('DoAddFriend', result);
          $scope.modal.hide()
        },
        error: function(error) {
          $scope.invite.error = error;
        }
      });

    }


    var refDetail = new Firebase(fireUrl).child('class/Person');
    var refIndex = new Firebase(fireUrl).child('index/PersonFriend').child(uid);

    $scope.items = {}

    console.log(refIndex.toString());

    refIndex.on('child_added', function(data){
      console.log(data.name());
      var val = data.val();
      refDetail.child(val.friend.objectId).on('value', function(snap){
        console.log(snap.ref().toString(), snap.val())
        if (snap.val() === null) {

        } else {
          $scope.items[snap.name()] = snap.val();
          $scope.$apply();
        }
      })
    })

    $scope.filter = function(value) {
      return value.active;
    };
  })

  .controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

    // Called to navigate to the main app
    $scope.startApp = function() {
      $state.go('app.business_list');
    };
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
  })

  .controller('LoginCtrl', function($scope, Auth, $state, $ionicLoading) {
//    if (Auth.isSignedIn()) {
//      name = Auth.userId();
//    }

    $scope.loginData = {
      email:'',
      password:''
    };

    $scope.tryLogin = function() {
      $scope.message = 'trying to login';
      var loading = $ionicLoading.show({content:'Loading'});

      Auth.login($scope.loginData).then(function(user) {
        loading.hide();

        // The root scope event will trigger and navigate
        console.log('login success', user);
        $state.go('app.business_list');
      }, function(error) {
        // Show a form error here
        $scope.message = error.message;
        $scope.$apply();
        loading.hide();

        console.error('Unable to login', error);
      });
    };
  })

.controller('MessageListCtrl', function($scope, $firebase, fireUrl, $timeout, $ionicScrollDelegate, Auth, $stateParams) {
    var roomId = $stateParams.roomId;
    var userid = Auth.userId();
    if (!userid) {
      userid = 'user' + Math.round(Math.random()*999);
    } else {
      var author = Auth.user().get('username');
      $scope.input = {author: author};
    }

    var root = new Firebase(fireUrl);
    var ref = root.child('public/chat').child(roomId).child('messages');

    $scope.items = $firebase(ref.limit(50));
    var comp = ref.parent().child('compose');
    $scope.composes = $firebase(comp);
    $scope.server = $firebase(root.child('.info'));

    var my = comp.child(userid);
    my.onDisconnect().remove();
    $firebase(my).$bind($scope, 'input');

    var scroll = function () {
      $ionicScrollDelegate.resize();
      $timeout(function () {
        $ionicScrollDelegate.scrollBottom(true);
      }, 1);
    };

    $scope.composes.$on('change', scroll);
    $scope.items.$on('change', scroll);

    $scope.send = function(value) {
      $scope.items.$add({
        author: $scope.input.author,
        message: $scope.input.message
      });
      $scope.input.message = '';
    };


    $scope.mine = function(item) {
      return item.author === $scope.input.author;
    };
  })


.controller('MyBusinessCtrl', function($scope, $firebase, fireUrl, Auth) {
    var id = Auth.user().get('business').id;

    var root = new Firebase(fireUrl);
    var ref = root.child('class/Business').child(id);

    var bus = $firebase(ref);
    $scope.item = bus;

    $scope.save = function(){
      $scope.item.$save();
    }

})

.controller('PersonCtrl', function($scope, $stateParams, $firebase, fireUrl, Auth, $rootScope) {
    var id1 = Auth.user().get('person').id;
    var id2 = $stateParams.id;

    var root = new Firebase(fireUrl);
    var ref = root.child('class/Person').child(id2);

    $scope.item = $firebase(ref);

    if (id1 > id2) {
      var tmp = id1;
      id1 = id2;
      id2 = tmp;
    }

    $scope.chat = function() {
      return id1 + '-' + id2;
    }

    $scope.refer = function() {
      alert('Refer ' + $rootScope.businessIdToRefer + ' to ' + id2);

      var busCust = {
        "a_inviterName" : "",
        "updatedAt" : "2013-10-17T09:37:20.155Z",
        "customerAccept" : true,
        "inviter" : {
          "className" : "Person",
          "objectId" : id1,
          "__type" : "Pointer"
        },
        "a_businessName" : "",
        "objectId" : "-",
        "businessAccept" : false,
        "a_customerName" : "",
        "customer" : {
          "className" : "Person",
          "objectId" : id2,
          "__type" : "Pointer"
        },
        "createdAt" : "2013-10-16T18:34:25.683Z",
        "business" : {
          "className" : "Business",
          "objectId" : $rootScope.businessIdToRefer,
          "__type" : "Pointer"
        }
      };

      root.child('class/BusinessCustomer').push(busCust, function(error) {
        if (error) {
          alert('Data could not be saved.' + error);
        } else {
          alert('Data saved successfully.');
        }
      });

      $rootScope.businessIdToRefer = '';
    }

  })

  //////////////


  .controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})
