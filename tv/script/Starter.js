var isOnline = false;
var activeKeyHandler;
var generalKeyHandler;
var Start = function () {

    var i = new Image();
    i.onload = DoConnectFunction;
    i.onerror = DoNoConnectFunction;
    i.src = "http://" + window.location.hostname + "/allow/images/error_icon.png?d=" + escape(Date());

    //setInterval(CheckConnection, 2000);

};

function CheckConnection() {
    timeField();
    var i = new Image();
    i.onload = GoOnline;
    i.onerror = GoOffline;
    i.src = "http://" + window.location.hostname + "/allow/images/error_icon.png?d=" + escape(Date());
}


function DoConnectFunction() {

    //SendStatistics();
    //document.getElementById("internetStatus").src = "/advgallery_mb100/images/connected_v1.png";
    isOnline = true;
    AjaxCalls();

}

function DoNoConnectFunction() {
    //document.getElementById("internetStatus").src = "/advgallery_mb100/images/disconnected_v1.png";
    isOnline = false;
    OfflineStorage();
}

function GoOnline() {
    if (!isOnline)
        window.location.href = "http://" + window.location.hostname;
}

function GoOffline() {
    if (isOnline != false) {
        //document.getElementById("internetStatus").src = "/advgallery_mb100/images/disconnected_v1.png";
        isOnline = false;

    }
}

function OfflineStorage() {
    pageData = JSON.parse(localStorage.pageData);
    allApps = JSON.parse(localStorage.allApps);
    appCategories = JSON.parse(localStorage.appCategories);
    mb100favorites = JSON.parse(localStorage.mb100favorites);
    StartApp();
}

function AjaxCalls() {
    //    $.when(
    //    $.get('/allow/PortalGalleryService.ashx?type=pagedata&time=' + new Date().getTime(), function (result) {
    //        pageData = result;
    //    }, 'json'),
    //    $.get('/allow/PortalGalleryService.ashx?type=allapps&time=' + new Date().getTime(), function (result) {
    //        allApps = result;
    //    }, 'json'),
    //    $.get('/allow/PortalGalleryService.ashx?type=appcategories&time=' + new Date().getTime(), function (result) {
    //        appCategories = result;
    //    }, 'json'),
    //    $.get('/allow/PortalGalleryService.ashx?type=mb100favoriteapps&time=' + new Date().getTime(), function (result) {
    //        mb100favorites = result;
    //    }, 'json')
    //    )
    //    .then(function () {
    //        if (typeof (Storage) !== "undefined") {
    //            // Store
    //            localStorage.setItem("pageData", JSON.stringify(pageData));
    //            localStorage.setItem("allApps", JSON.stringify(allApps));
    //            localStorage.setItem("appCategories", JSON.stringify(appCategories));
    //            localStorage.setItem("mb100favorites", JSON.stringify(mb100favorites));
    //            // Retrieve
    //            localStorage.setItem("updated", "false");
    //            StartApp();
    //        }
    //        else {
    //            alert("Sorry! No Web Storage support.");
    //        }
    //    });
    StartApp();
}

keyEventListener = function (e) {
    //var returnflag = 0;
    /*if (!isOnline) {
        if (e.keyCode == KEYS.OK) {
            //            NewUIProps.lastActiveHandlerForInfoBox = activeHandler;
            //            alertBox.Activate(pageData.Resources.NewUIOfflineWarning);
            //            $('#alertbox').addClass('error');
            return false;
        }

    }*/
    //    if ((activeHandler == favApplications.Handler) || (activeHandler == mainSearchKeyHandler && $('#searchinput').val() == ""))
    //        returnflag = 1;
    activeKeyHandler(e);
    generalKeyHandler(e);

    if (!(document.activeElement == document.getElementById('searchinput')))
        return false;

    //if (returnflag) return false;
    return true;
};


$(document).ready(Start);


function StartApp() {
    SetParameters();
    MainMenuControl.Activate();
    document.onkeydown = keyEventListener;
    Document.onpageshow = function () { document.getElementById("video").setFullScreen(true); }
    activeKeyHandler = MainMenuControl.Handler;
    generalKeyHandler = GeneralControl.Handler;


    timeField();
}

function SetParameters() {
    ChannelParams = new ChannelParameters();
    MainMenuControl.BindEvents();
    SettingsMenuControl.BindEvents();
    MediaPlayerMenuControl.BindEvents();
    SoundSettingControl.BindEvents();
    ScreenSettingControl.BindEvents();

    var favList = JSON.parse(localStorage.getItem("favorites"));
    if (favList) {
    } else {
        favList = {
            "favorites": [
                        { "type": "0", "name": "Channel1", "image": "images/favoritesmenu/favorites-1.png", "link": "" },
                        { "type": "1", "name": "dailymotion", "image": "images/favoritesmenu/favorites-3.png", "link": "http://iptv-app.dailymotion.com/dm-front-vestel/dojoroot/app/pages/vestel/index.jsp?lang=tr" },
                        { "type": "0", "name": "Channel2", "image": "images/favoritesmenu/favorites-2.png", "link": "" }
                         ]
        };
        localStorage.setItem("favorites", JSON.stringify(favList));
    }
    var recentList = JSON.parse(localStorage.getItem("recents"));
    if (recentList) {
    } else {
        recentList = {
            "recents": [
                        { "type": "0", "name": "Channel1", "image": "images/favoritesmenu/favorites-1.png", "link": "" },
                        { "type": "1", "name": "dailymotion", "image": "images/favoritesmenu/favorites-3.png", "link": "http://iptv-app.dailymotion.com/dm-front-vestel/dojoroot/app/pages/vestel/index.jsp?lang=tr" },
                        { "type": "0", "name": "Channel2", "image": "images/favoritesmenu/favorites-2.png", "link": "" }
                         ]
        };
        localStorage.setItem("recents", JSON.stringify(recentList));
    }

    var channelList = null;
    try {
        channelList = document.getElementById("video").getChannelConfig().channelList;
    }
    catch (err) {
        console.log(err);
    }
    ChannelListControl.generateChannels(channelList);
}

function timeField() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var hour = hours + "." + minutes;
    document.getElementById("hourField").innerHTML = hour;

    var pm;
    if (hours > 11)
        pm = "pm";
    else
        pm = "am";
    document.getElementById("pmField").innerHTML = pm;

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var day = weekday[currentTime.getDay()];

    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "Aug";
    month[8] = "Septr";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var m = month[currentTime.getMonth()];
    var d = currentTime.getDate();
    var dayField = day + ", " + m + " " + d;
    document.getElementById("dayField").innerHTML = dayField;
}