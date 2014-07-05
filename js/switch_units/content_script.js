var s = document.createElement('script');
s.src = chrome.extension.getURL("js/switch_units/injected.js");
s.onload = function() {
    this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);
