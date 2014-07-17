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

interface Auth {
  isSignedIn(): boolean;
  userId(): string;
  user(): any;
//  register();
//  login();
  logout(): void;
}

//.service('jsonStorage', JsonStorage)
class JsonStorage {
//    static STORAGE_ID = 'todos-angularjs';

  // dependencies would be injected here
  constructor() {

  }

  get(id:string, ifNull?:any):any {
    var s = localStorage.getItem(id);
    if (s) {
      return JSON.parse(s || '{}');
    } else {
      return ifNull;
    }
  }

  put(key:string, value:any) {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }
}

class Holder<T> {
  value: T;

  constructor(message: T) {
    this.value = message;
  }
  set(v: T) {
    this.value = v;
  }
  get(): T {
    return this.value;
  }
}

class Referral {
  bus = 'todos-angularjs';
  _person;

  // dependencies would be injected here
  constructor() {

  }

  business(id:string):void {
    this._person = id;
  }
  person(id:string):void {
    this._person = id;
  }

}