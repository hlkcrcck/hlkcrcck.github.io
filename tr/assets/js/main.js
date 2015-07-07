var a = document.getElementById('ingilizce'); //or grab it by tagname etc
var host = window.location.hostname;
var path = window.location.pathname;
path = path.replace("/tr/", "/en/");
a.href = host+path;