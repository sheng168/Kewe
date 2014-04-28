/**
 * Created by sheng on 4/6/14.
 */

//this hook installs all your plugins

// add your plugins to this list--either
// the identifier, the filesystem location
// or the URL

var pluginlist = [
  114, 60, 144
];

var a = {
  'ios/icon57.png' : 57,
  'ios/icon72.png' : 72,
  'ios/icon76.png' : 76,
  'ios/icon114.png' : 114,
  'ios/icon120.png' : 120,
  'ios/icon144.png' : 144,
  'ios/icon152.png' : 152,

  'android/ldpi.png' : 36,
  'android/mdpi.png' : 48,
  'android/hdpi.png' : 72,
  'android/xhdpi.png' : 92,
  'android/xxhdpi.png' : 144,
  'android/xxxhdpi.png' : 192

}

// no need to configure below

var fs = require('fs');
var path = require('path');
var sys = require('sys')
var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
  sys.puts(stdout)
}

//pluginlist.forEach(function(plug) {
//  exec("sips -Z " + plug + " icon.png --out icon-" + plug + ".png", puts);
//});

for (var plug in a) {
  var size = a[plug];

  exec("sips -Z " + size + " icon1024.png --out " + plug + "", puts);
}
