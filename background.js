// Copyright 2018 Axel Stenson. All rights reserved.
// Use of this source code is governed by a MIT-style license that can be
// found in the LICENSE file.

var ERROR = "error";
var locationCords = {};
var appid = '7fdf47ba05bd492e4f1beb84ef9f23de';
var user_lng = -1;
var user_lat = -1;
var url = ""

function checkUV() {
  // Check if Lat and Long have been set by getLocation()
  if (user_lat != -1 && user_lng != -1) {

    var url = ("http://api.openweathermap.org/data/2.5/uvi?appid=" +appid + "&lat=" + user_lat + "&lon=" + user_lng + "");;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {

      if (xhr.readyState == 4) {
        // Parse text for use
        var uvdata = JSON.parse(xhr.responseText);
        if (uvdata.value){
          // Number formatting
          if (uvdata.value > 9.99) {
            chrome.browserAction.setBadgeText({ text: (uvdata.value).toFixed(1) + "" });
          } else {
            chrome.browserAction.setBadgeText({ text: uvdata.value + "" });
          }
          // Colors for badge depending on value
          if (uvdata.value < 3.0) {
            chrome.browserAction.setBadgeBackgroundColor({color: '#33b841'});
          }
          else if (uvdata.value < 6.0) {
            chrome.browserAction.setBadgeBackgroundColor({color: '#fec54b'});
          }
          else if (uvdata.value < 8.0) {
            chrome.browserAction.setBadgeBackgroundColor({color: '#ff7243'});
          }
          else if (uvdata.value < 11.0) {
            chrome.browserAction.setBadgeBackgroundColor({color: '#fd0122'});
          }
          else {
            chrome.browserAction.setBadgeBackgroundColor({color: '#8773f6'});
          }
        }
      }
      else {
        chrome.browserAction.setBadgeText({ text: "???"});
      }
    };
    xhr.send();
    }
  else {
    // Loading 'icon'
    chrome.browserAction.setBadgeText({ text: "~" });
  }
} // end checkUV()

function getLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(loc_success, loc_error);
  }
	else {
		checkUV();
  }
} // end getLocation()


function loc_success(position) {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  user_lat = lat;
  user_lng = lng;

  checkUV();
} // end loc_success()


function loc_error() {
  console.log("location error");
  checkUV();
} // end loc_error()

// Set badge color to grey and call getLocation() to get user location
chrome.browserAction.setBadgeBackgroundColor({color: '#535860'});
getLocation();

// Check UV again every 20 minutes using
setInterval(checkUV, 1200000);

// Check Location every 2 hours
setInterval(getLocation, 7200000);
