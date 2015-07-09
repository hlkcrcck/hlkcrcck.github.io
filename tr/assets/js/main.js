var a = document.getElementById('ingilizce'); //or grab it by tagname etc
var proto = window.location.protocol;
var host = window.location.hostname;
var path = window.location.pathname;
path = path.replace("/tr/", "/en/");
a.href = proto+"\\"+host+path;