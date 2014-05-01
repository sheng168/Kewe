// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ParseAuth'])

.constant('PARSE_ID', 'oaZEFA20jlwt54s8ciE1I0HGRhC96kbkyGH7rbtT')
.constant('PARSE_KEY', 'fc5YPhAOEEMYaNu2EMp1bZWsB6dWt4Z1o8o45UA0')
.value('fireUrl', 'https://voved.firebaseio.com/')

.run(function($ionicPlatform, Auth) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.intro', {
      url: "/intro",
      views: {
        'menuContent' :{
          templateUrl: "templates/intro.html",
          controller: 'IntroCtrl'
        }
      }
    })

    .state('app.login', {
      url: "/login",
      views: {
        'menuContent' :{
          templateUrl: "templates/login.html",
          controller: 'LoginCtrl'
        }
      }
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.browse', {
      url: "/browse",
      views: {
        'menuContent' :{
          templateUrl: "templates/browse.html"
        }
      }
    })
    .state('app.playlists', {
      url: "/playlists",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlists.html",
          controller: 'PlaylistsCtrl'
        }
      }
    })
    .state('app.message_list', {
      url: "/message/:roomId",
      views: {
        'menuContent' :{
          templateUrl: "templates/message_list.html",
          controller: 'MessageListCtrl'
        }
      }
    })
    .state('app.business_list', {
      url: "/business",
      views: {
        'menuContent' :{
          templateUrl: "templates/business_list.html",
          controller: 'BusinessListCtrl'
        }
      }
    })

    .state('app.favorite_list', {
      url: "/favorite/:personId",
      views: {
        'menuContent' :{
          templateUrl: "templates/favorite_list.html",
          controller: 'FavoriteListCtrl'
        }
      }
    })

    .state('app.friend_list', {
      url: "/friend",
      views: {
        'menuContent' :{
          templateUrl: "templates/friend_list.html",
          controller: 'FriendListCtrl'
        }
      }
    })

    .state('app.customer_list', {
      url: "/customer/:businessId",
      views: {
        'menuContent' :{
          templateUrl: "templates/customer_list.html",
          controller: 'CustomerListCtrl'
        }
      }
    })

    .state('app.mybusiness', {
      url: "/mybusiness",
      views: {
        'menuContent' :{
          templateUrl: "templates/mybusiness.html",
          controller: 'MyBusinessCtrl'
        }
      }
    })

    .state('app.business', {
      url: "/business/:id/:ownerId",
      views: {
        'menuContent': {
          templateUrl: "templates/business.html",
          controller: 'BusinessCtrl'
        }
      }
    })
    .state('app.person', {
      url: "/person/:id",
      views: {
        'menuContent': {
          templateUrl: "templates/person.html",
          controller: 'PersonCtrl'
        }
      }
    })
    .state('app.single', {
      url: "/playlists/:playlistId",
      views: {
        'menuContent' :{
          templateUrl: "templates/playlist.html",
          controller: 'PlaylistCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/business');
});

