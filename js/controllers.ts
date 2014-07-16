/// <reference path="types.ts"/>


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

      var rec = {
        business:{objectId:busId},
        customer:{objectId:personId}
      }

      root.child('class/BusinessCustomer').child('_'+busId + '_' + personId).set(rec, function(error) {
        if (error) {
          alert('Data could not be saved.' + error);
        } else {
          alert('Data saved successfully.');
        }
      });

//      root.child('index/CustomerBusiness').child(personId).child(busId).set(rec);
//      root.child('index/BusinessCustomer').child(busId).child(personId).set(rec);

//      root.child('index/PersonBusiness').child(personId).child(busId).set(true, function(error) {
//        if (error) {
//          alert('Data could not be saved.' + error);
//        } else {
//          alert('Data saved successfully.');
//        }
//      });
    }

    $scope.connect_parse = function() {
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
//      alert('Select a friend to refer to.');
      $rootScope.businessIdToRefer = busId;
      $rootScope.businessRefer = bus;

      $state.go('app.friend_list');
    }

    $scope.isFavorite = function() {
      return UserService.isFavorite(busId);
    };

  })

  .controller('BusinessListCtrl', function($scope, $firebase, fireUrl, $ionicModal, UserService, $rootScope) {
    var ref = new Firebase(fireUrl).child('public/Business');

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

    $scope.image = function(item) {
      var n = 'B';
      if (item.name && item.name.length > 1) {
        n = item.name.substr(0,2);
      }
      return 'http://placehold.it/64/2222ff/ffffff&text=' + n;
    }

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
//      return UserService.isFavorite(busId);
      if ($rootScope.favorites[busId]) {
        return true;
      } else {
        return false;
      }
    };
  })

  .controller('CustomerListCtrl', function($scope, $firebase, fireUrl, Auth, $stateParams, $ionicActionSheet, $window, URL) {
    var uid = $stateParams.businessId;
    if (uid === '_my_' || uid == '') {
      uid = Auth.user().get('business').id;
    }

    var refDetail = new Firebase(fireUrl).child('class/Person');
    var refIndex = new Firebase(fireUrl).child('index/BusinessCustomer_business').child(uid);

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

          $scope.$apply(function(){
            $scope.items[snap.name()] = val;
          });
        }
      })
    })

    $scope.filter = function(value) {
      return value.active;
    };

    // Triggered on a button click, or some other target
    $scope.invite = function() {

      // Show the action sheet
      $ionicActionSheet.show({
        titleText: 'Invite customer using',
        buttons: [
          { text: 'Email' },
          { text: 'SMS' },
          { text: 'Other' }
        ],
//        destructiveText: 'Delete',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
//          alert('click ' + index);
          var url = URL+"#/app/business/"+uid+"/"+Auth.user().get('person').id;
//
          if (index == 0) {
            $window.location = "mailto:?subject=Check out Repher&body=" + url;
          } else if (index == 1) {
            $window.location = "sms:?subject=Check out Repher&body=" + url;
          } else {
//            $window.location = url;
            prompt('Copy and send link to invite people', url);
          }
          return true;
        },
        cancel: function() {
//          alert('cancel')
          return false;
        }
      });

    };
  })

  .controller('FavoriteListCtrl', function($scope, $firebase, fireUrl, Auth, $stateParams) {
    var ref = new Firebase(fireUrl).child('class/Business');
    $scope.business_list = {}

    var uid = $stateParams.personId;
    if (uid === '_my_') {
      uid = Auth.user().get('person').id;
    }

    var busRef = new Firebase(fireUrl).child('index/BusinessCustomer_customer').child(uid);
    console.log('busRef', busRef.toString());

    // load bus id, then load bus detail
    busRef.on('child_added', function(data){
      console.log(data.name());
      ref.child(data.val().business.objectId).on('value', function(snap){
        console.log('business', snap.ref().toString(), snap.val())
        if (snap.val() === null) {
//          console.error()
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

  .controller('FriendListCtrl', function($scope, $firebase, fireUrl, Auth, $ionicModal, $ionicActionSheet, $window, URL) {
    $ionicModal.fromTemplateUrl('modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal
    })

    var uid = Auth.user().get('person').id;

    $scope.add = function(){

//      prompt('Copy and send this to your friend', url);
//      $scope.modal.show()
      // Show the action sheet
      $ionicActionSheet.show({
        titleText: 'Invite friend using',
        buttons: [
          { text: 'Email' },
          { text: 'SMS' },
          { text: 'QR Code Scan' },
          { text: 'Other' }
        ],
//        destructiveText: 'Delete',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
//          alert('click ' + index);
//
          var url = URL + '#/app/person/' + uid;

          var subject = encodeURIComponent('Check out Repher');
          var body = encodeURIComponent("Join me on Repher \n" + url)
          if (index == 0) {
            $window.location = "mailto:?subject="+subject+"&body=" + body;
          } else if (index == 1) {
            var sms;
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1)
              sms = "sms:;body=";
            else
              sms = "sms:?body=";

//            $window.location = sms + body;

            location.href = sms+body;
          } else if (index == 2) {
            var url = URL + '#app/person/' + uid;
            console.log('url', url)
            $window.location = "http://zxing.org/w/chart?cht=qr&chs=350x350&chld=L&choe=UTF-8&chl=" + encodeURIComponent(url);
          } else {
//            $window.location = url;
            prompt('Copy and send link to invite people', url);
          }
          return true;
        },
        cancel: function() {
//          alert('cancel')
          return false;
        }
      });

    }

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
    var refIndex = new Firebase(fireUrl).child('index/PersonFriend_person').child(uid);

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

    $scope.signUp = function() {
//      alert('signUp')

      Auth.register({
        email: Math.random() + '@voved.com' ,
        password: 'p' + Math.random()
      }).then(function(user) {
//        loading.hide();

        // The root scope event will trigger and navigate
        console.log('login success', user);
        $state.go('app.mybusiness');
      }, function(error) {
        // Show a form error here
        $scope.message = error.message;
        $scope.$apply();
//        loading.hide();

        console.error('Unable to login', error);
      });
    }

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
    bus.$on('change', function(){
      if (bus.phone && bus.phone.indexOf('0.0') == 0) {
        console.log('hiding fake phone');
        bus.phone = '';
      } else {
        console.log('ok');
      }
    })

    $scope.save = function(){
      var bus = $scope.item;

      if (bus.name && bus.name.length > 0) {
        bus.active = true;
      }

      bus.owner = {
        objectId: Auth.user().get('person').id
      }

      bus.$save();
    }

    $scope.person = $firebase(root.child('class/Person').child(Auth.user().get('person').id));

    var phone = Auth.user().get('username');
    var email = Auth.user().get('email');
    if (phone && phone.indexOf('0.') == 0) {
      phone = '';
    }
    if (email && email.indexOf('0.') == 0) {
      email = '';
    }

//    $scope.user = {
//      phone: phone,
//      email: email,
//      owner: Auth.user().get('business').id != ''
//    };

//    $scope.saveProfile = function(){
//      $scope.person.$save();
//
//      var parse = Auth.user();
//
//      if ($scope.user.phone) parse.set('username', $scope.user.phone);
//      if ($scope.user.email) parse.set('email', $scope.user.email);
//
//      parse.save().then(function(obj) {
//        // the object was saved successfully.
//        alert('save successfull')
//      }, function(error) {
//        // the save failed.
//        console.log(error)
//        alert('save failed ' + error.message)
//      });
//    }
  })

.controller('MyProfileCtrl', function($scope, $firebase, fireUrl, Auth) {
    var id = Auth.user().get('business').id;

    var root = new Firebase(fireUrl);
    var ref = root.child('class/Business').child(id);

    var bus = $firebase(ref);
    $scope.item = bus;
    bus.$on('change', function(){
      if (bus.phone && bus.phone.indexOf('0.0') == 0) {
        console.log('hiding fake phone');
        bus.phone = '';
      } else {
        console.log('ok');
      }
    })

    $scope.save = function(){
      var bus = $scope.item;

      if (bus.name && bus.name.length > 0) {
        bus.active = true;
      }

      bus.owner = {
        objectId: Auth.user().get('person').id
      }

      bus.$save();
    }

    $scope.person = $firebase(root.child('class/Person').child(Auth.user().get('person').id));

    var phone = Auth.user().get('username');
    var email = Auth.user().get('email');
    if (phone && phone.indexOf('0.') == 0) {
      phone = '';
    }
    if (email && email.indexOf('0.') == 0) {
      email = '';
    }

    $scope.user = {
      phone: phone,
      email: email,
      owner: Auth.user().get('business').id != ''
    };

    $scope.saveProfile = function(){
      $scope.person.$save();

      var parse = Auth.user();

      if ($scope.user.phone) parse.set('username', $scope.user.phone);
      if ($scope.user.email) parse.set('email', $scope.user.email);

      parse.save().then(function(obj) {
        // the object was saved successfully.
        alert('save successfull')
      }, function(error) {
        // the save failed.
        console.log(error)
        alert('save failed ' + error.message)
      });
    }
  })

.controller('PersonCtrl', function($scope, $stateParams, $firebase, fireUrl, Auth, $rootScope) {
    var idmy = '_';
    if (Auth.user()) {
      idmy = Auth.user().get('person').id;
    }
    var idp = $stateParams.id;

    var root = new Firebase(fireUrl);
    var ref = root.child('class/Person').child(idp);

    $scope.item = $firebase(ref);

    var id1 = idmy;
    var id2 = idp;
    if (id1 > id2) {
      var tmp = id1;
      id1 = id2;
      id2 = tmp;
    }

    $scope.chat = function() {
      return id1 + '-' + id2;
    }

    $scope.friend = function() {
      var id = idmy + '-' + idp;
      var rec = {
        objectId: id,
        person: {objectId: idmy},
        friend: {objectId: idp}
      };
      root.child('index/PersonFriend_person').child(idmy).child(idp).set({
        friend:{objectId:idp}
      }, function(error) {
        if (error) {
          alert('Data could not be saved.' + error);
        } else {
          alert('Data saved successfully.');
        }
      });
      root.child('index/PersonFriend_person').child(idp).child(idmy).set({
        friend:{objectId:idmy}
      });
    }

    $scope.refer = function() {
      alert('Refer ' + $rootScope.businessIdToRefer + ' to ' + idp);

      var busCust = {
        "a_inviterName" : "",
        "updatedAt" : "2013-10-17T09:37:20.155Z",
        "customerAccept" : true,
        "inviter" : {
          "className" : "Person",
          "objectId" : idmy,
          "__type" : "Pointer"
        },
        "a_businessName" : "",
        "objectId" : "-",
        "businessAccept" : false,
        "a_customerName" : "",
        "customer" : {
          "className" : "Person",
          "objectId" : idp,
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
      $rootScope.businessRefer = undefined;
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
