/// <reference path="types.ts"/>

angular.module('ParseAuth', [])
  .factory('Auth', function($rootScope, $state, PARSE_ID, PARSE_KEY) {
    Parse.initialize(PARSE_ID, PARSE_KEY);

    var Auth = {
      isSignedIn : function() {
        return Parse.User.current() !== null;
      },
      userId : function() {
        return Parse.User.current().id;
      },
      user : function() {
        return Parse.User.current();
      },
      register : function(form) {
        var user = new Parse.User();
        if (form.email)
          user.set("email", form.email);

        user.set("username", form.username || form.email);
        user.set("password", form.password);

        return user.signUp(null, {
          success: function(user) {
//          $scope.currentUser = user;
//          $scope.$apply();
          },
          error: function(user, error) {
            alert("Unable to sign up:  " + error.code + " " + error.message);
          }
        });
      },
      login : function(form) {
        return Parse.User.logIn(form.email, form.password);
      },
      logout : function() {
        Parse.User.logOut();
      }
    };

    $rootScope.isSignedIn = function() {
      return Auth.isSignedIn();
    };

    $rootScope.logout = function() {
      console.log("logout");
      if (confirm("Logout? If you haven't set your email and phone number, you won't be able to log back in.")) {
        Auth.logout();
        $state.go('app.login');
      }
    };

    return Auth;

  });