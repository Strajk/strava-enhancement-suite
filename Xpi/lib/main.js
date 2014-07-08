/* jshint esnext: true */
/* global require: false */

// Import the APIs we need.
let pageMod = require("sdk/page-mod");
// let Request = require("sdk/request").Request;
let self = require("sdk/self");
// let tabs = require("sdk/tabs");
// let ss = require("sdk/simple-storage");
// let timer = require("sdk/timers");
// let priv = require("sdk/private-browsing");
// let windows = require("sdk/windows").browserWindows;


// require chrome allows us to use XPCOM objects...
const {Cc,Ci,Cu,components} = require("chrome");
let historyService = Cc["@mozilla.org/browser/history;1"].getService(Ci.mozIAsyncHistory);


// Preferences
let prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);


pageMod.PageMod({
	include: ["*.strava.com"],
	//contentScriptWhen: 'start|ready|end' - default is end
	contentScriptFile: [
		self.data.url('jquery-1.10.2.min.js'),
		self.data.url('injected.js'),
		self.data.url('core.js')
	]
});
