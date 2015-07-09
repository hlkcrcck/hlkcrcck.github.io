var a = document.getElementById('turkce'); //or grab it by tagname etc
var proto = window.location.protocol;
var host = window.location.hostname;
var path = window.location.pathname;
path = path.replace("/en/", "/tr/");
a.href = proto+"//"+host+path;