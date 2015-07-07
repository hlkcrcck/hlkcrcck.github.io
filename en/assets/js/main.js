var a = document.getElementById('turkce'); //or grab it by tagname etc
var host = window.location.hostname;
var path = window.location.pathname;
path = path.replace("/en/", "/tr/");
a.href = host+path;