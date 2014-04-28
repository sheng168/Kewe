// Ionic Starter App

angular.module('FirebaseAuth', [])
  .factory('Auth', function($firebaseSimpleLogin, FIREBASE_URL, $rootScope, $state) {
    var ref = new Firebase(FIREBASE_URL);
    var firebaseSL = $firebaseSimpleLogin(ref);

    var Auth = {
      isSignedIn : function() {
        return firebaseSL.user !== null;
      },
      register : function(user) {
        return firebaseSL.$createUser(user.email, user.password);
      },
      login : function(user) {
        return firebaseSL.$login('password', user);
      },
      logout : function() {
        firebaseSL.$logout();
      }
    };

    $rootScope.isSignedIn = function() {
      return Auth.isSignedIn();
    };

    $rootScope.logout = function() {
      console.log("logout");
      Auth.logout();
      $state.go('login');
    };

//  $rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
//    $state.go('home_landing');
//  });
//
//  $rootScope.$on('$firebaseSimpleLogin:logout', function(e, user) {
//    console.log($state);
//    $state.go('login');
//  });

    return Auth;

  });
