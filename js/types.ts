/**
 * Created by sheng on 7/7/14.
 */

/// <reference path="angular.d.ts"/>
/// <reference path="firebase.d.ts" />

declare var Parse;
//declare var Firebase;

interface User {
    loc: Location;
    presence: number; // < 0 for online, > 0 for offline, abs() is ms
    profile: Profile;
}

interface Profile {
    name: string;
    picture_url: string;
}

interface Location {
    timestamp: number;
    coords: {
        "latitude" : number
        "altitudeAccuracy" : number
        "longitude" : number
        "altitude" : number
        "accuracy" : number
    }
}

