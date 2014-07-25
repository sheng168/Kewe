/// <reference path="types.ts"/>
// Ionic Starter App
angular.module('UserService', []).factory('UserService', function (fireUrl, $firebase) {
    var ref = new Firebase(fireUrl);

    var userId = '';
    var friends = {};
    var favorites = {};

    return {
        setCurrentUser: function (uid) {
            if (userId == uid)
                return;

            userId = uid;
            friends = $firebase(ref.child('index/PersonFriend').child(uid));
            favorites = $firebase(ref.child('index/CustomerBusiness').child(uid));
        },
        getCurrentUser: function () {
            return friends;
        },
        isFavorite: function (busId) {
            if (favorites[busId]) {
                return true;
            } else {
                return false;
            }
        },
        isFriend: function (uid) {
            if (friends[uid]) {
                return true;
            } else {
                return false;
            }
        }
    };
});
//# sourceMappingURL=UserService.js.map
