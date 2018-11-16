
var ERROR = "error";
var locationCords = {};
var appid = '7fdf47ba05bd492e4f1beb84ef9f23de';
var user_lng = -1;
var user_lat = -1;
var url = ""

function checkUV() {
  chrome.browserAction.setBadgeText({ text: "3"});
  if (user_lat != -1 && user_lng != -1) {
    var url = ("http://api.openweathermap.org/data/2.5/uvi?appid="+ appid + "&lat=" + user_lat + "&lon=" + user_lng + "");;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // Parse text for use
        var uvdata = JSON.parse(xhr.responseText);
        if (uvdata.value){
          chrome.browserAction.setBadgeText({ text: uvdata.value + "" });
        }
      }
      else{
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

// Set badge color and call getLocation() to get user location
chrome.browserAction.setBadgeBackgroundColor({color: '#cc9933'});
getLocation();

// Check UV again every 20 minutes using
setInterval(checkUV, 1200000);

// Check Location every 2 hours
setInterval(getLocation, 7200000);
