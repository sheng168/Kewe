/**
* Created by sheng on 7/7/14.
*/
/// <reference path="angular.d.ts"/>
/// <reference path="firebase.d.ts" />


//.service('jsonStorage', JsonStorage)
var JsonStorage = (function () {
    //    static STORAGE_ID = 'todos-angularjs';
    // dependencies would be injected here
    function JsonStorage() {
    }
    JsonStorage.prototype.get = function (id, ifNull) {
        var s = localStorage.getItem(id);
        if (s) {
            return JSON.parse(s || '{}');
        } else {
            return ifNull;
        }
    };

    JsonStorage.prototype.put = function (key, value) {
        if (value) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.removeItem(key);
        }
    };
    return JsonStorage;
})();

var Holder = (function () {
    function Holder(message) {
        this.value = message;
    }
    Holder.prototype.set = function (v) {
        this.value = v;
    };
    Holder.prototype.get = function () {
        return this.value;
    };
    return Holder;
})();

var Referral = (function () {
    // dependencies would be injected here
    function Referral() {
        this.bus = 'todos-angularjs';
    }
    Referral.prototype.business = function (id) {
        this._person = id;
    };
    Referral.prototype.person = function (id) {
        this._person = id;
    };
    return Referral;
})();
//# sourceMappingURL=types.js.map
