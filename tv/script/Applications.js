
var fcount;
var mcount;
var fApps;
var myApps;
var AppManager = function (appName, appPng) {

    timeField();
};

AppManager.prototype.generateFeaturedApps = function () {

    fApps = [["youtube", "http://youtube.com/tv"], ["facebook", "oauth/social/loginform.aspx?app=facebook"], ["twitter", "oauth/social/loginform.aspx?app=twitter"], ["netflix", "http://www.portaltv.tv/swf/netflix/netflix.swf"], ["dailymotion", "http://iptv-app.dailymotion.com/dm-front-vestel/dojoroot/app/pages/vestel/index.jsp?lang=tr"],
                   ["amazon", ""], ["vimeo", ""], ["accuweather", "partner/accuweather/Default.aspx?isNewUI=true"], ["youtube", "http://youtube.com/tv"], ["facebook", "oauth/social/loginform.aspx?app=facebook"], ["twitter", "oauth/social/loginform.aspx?app=twitter"], ["netflix", "http://www.portaltv.tv/swf/netflix/netflix.swf"]];
    fcount = fApps.length;
    $("#featuredSlider").css("width", fcount * 227 + "px");
    for (var i = 0; i < fcount; i++) {

        var d = document.createElement('div');
        d.className = 'appContainer';
        d.id = 'featuredItem' + i;

        var app = document.createElement('div');
        app.className = fApps[i][0];
        app.innerHTML = fApps[i][0];

        var png = document.createElement('div');
        png.className = fApps[i][0] + "_png";

        d.appendChild(png);
        d.appendChild(app);

        var a = document.createElement('div');
        a.className = "favSymbol";
        d.appendChild(a);


        document.getElementById("featuredSlider").appendChild(d);
    }

};
AppManager.prototype.generateMyApps = function () {

    myApps = [["ntv", "main.aspx?app=ntv"], ["digiturk", "https://idtvdilediginzaman.digiturk.com.tr"], ["mynet", ""], ["arte", ""], ["ntvspor", "main.aspx?app=ntvspor"],
                  ["flickr", "oauth/social/flickr/default.aspx"], ["qvc", "http://hbbtv.qvc.de/core/mmh/"], ["mynet", ""], ["arte", ""], ["ntvspor", "main.aspx?app=ntvspor"], ["ligtv", "http://connectedligtv.digiturk.com.tr/tvportal/mainpage.htm"],
                  ["zdf", "http://hbbtv.zdf.de/zdfmediathek/index.php?select=X&amp;amp;noclose=1"], ["operatvstore", "https://vestel.tvstore.opera.com"], ["ebay", "http://nettv.jaast.com"],
                  ["ligtv", "http://connectedligtv.digiturk.com.tr/tvportal/mainpage.htm"], ["zdf", "http://hbbtv.zdf.de/zdfmediathek/index.php?select=X&amp;amp;noclose=1"], ["trt", "partner/trt/default.aspx"],
                  ["ttnet", "partner/ttnetmuzik/main/mainpage.aspx"], ["natgeowild", ], ["filmbox", ], ["ntvspor", "main.aspx?app=ntvspor"], ["operatvstore", "https://vestel.tvstore.opera.com"],
                  ["ebay", "http://nettv.jaast.com"], ["zdf", "http://hbbtv.zdf.de/zdfmediathek/index.php?select=X&amp;amp;noclose=1"],["ligtv", "http://connectedligtv.digiturk.com.tr/tvportal/mainpage.htm"] ];
    mcount = myApps.length;
    $("#mySlider").css("width", Math.ceil(mcount / 2) * 227 + "px");

    for (var i = 0; i < mcount; i++) {

        var d = document.createElement('div');
        d.className = 'appContainer';
        var x = i + 100;
        d.id = 'featuredItem' + x;

        var app = document.createElement('div');
        app.className = myApps[i][0];
        app.innerHTML = myApps[i][0];

        var png = document.createElement('div');
        png.className = myApps[i][0] + "_png";

        d.appendChild(png);
        d.appendChild(app);

        var a = document.createElement('div');
        a.className = "favSymbol";
        d.appendChild(a);

        document.getElementById("mySlider").appendChild(d);
    }

};
AppManager.prototype.generateIcons = function () {

};

var AppsMenuControl = {
    SelectedIndex: 0,
    tempIndex: 0,
    ActiveFlag: 1,

    Handler: function (e) {
        var base = AppsMenuControl;
        switch (e.keyCode) {
            case KEYS.BACKSPACE:
                window.history.back();
                document.getElementById("video").bindToCurrentChannel();
                break;
            case KEYS.OK:
                base.GoToSubMenu(base.SelectedIndex);
                break;
            case KEYS.UP:
                base.GoUp();
                break;
            case KEYS.DOWN:
                base.GoDown();
                break;
            case KEYS.RIGHT:
                base.GoRight();
                break;
            case KEYS.LEFT:
                base.GoLeft();
                break;
            case KEYS.RED:
                base.AddFavorite(base.SelectedIndex);
                base.Select();
                break;
            case KEYS.THREE:
                base.AddFavorite(base.SelectedIndex);
                base.Select();
                break;
            case KEYS.FOUR:
                base.RemoveFavorite(base.SelectedIndex);
                break;
        }
        e.preventDefault();
    },
    GoRight: function () {
        if (this.SelectedIndex < 100) {//featured apps için
            this.Deselect();
            if (this.SelectedIndex < fcount - 1)
                this.SelectedIndex++;
            this.Select();
            var left = $("#featuredSlider").position().left;

            if (this.SelectedIndex > 7 && left > 0 - (this.SelectedIndex - 7) * 227 && this.SelectedIndex <= fcount - 1)
                $("#featuredSlider").css("left", "-" + (this.SelectedIndex - 7) * 227 + "px");
        }
        else if (this.SelectedIndex >= 100 && this.SelectedIndex < 100 + mcount) {//myapps için
            var sec = this.SelectedIndex - 100;
            if (sec != Math.ceil(mcount / 2) - 1) {//ilk satırın sonundaki elemansa sağa gitmeyecek
                this.Deselect();
                if (sec < mcount - 1)
                    this.SelectedIndex++;
                var sec = this.SelectedIndex - 100;
                this.Select();
                var left = $("#mySlider").position().left;
                if (sec % (Math.ceil(mcount / 2)) > 7 && left > 0 - (sec % (Math.ceil(mcount / 2)) - 7) * 227 && sec <= mcount - 1)
                    $("#mySlider").css("left", "-" + (sec % (Math.ceil(mcount / 2)) - 7) * 227 + "px");
            }
        }
        else if (this.SelectedIndex >= 200 && this.SelectedIndex < 202) {
            this.Deselect();
            this.SelectedIndex++;
            this.Select();
        }

    },
    GoLeft: function () {
        if (this.SelectedIndex < 100) {//featured apps için
            this.Deselect();
            if (this.SelectedIndex > 0)
                this.SelectedIndex--;
            this.Select();
            var left = $("#featuredSlider").position().left;
            if (left < 0 - (this.SelectedIndex) * 227 && this.SelectedIndex <= fcount) {
                $("#featuredSlider").css("left", "-" + (this.SelectedIndex) * 227 + "px");
            }
        }
        else if (this.SelectedIndex >= 100 && this.SelectedIndex < 100 + mcount) {//myapps için
            var sec = this.SelectedIndex - 100;
            if (sec != Math.ceil(mcount / 2)) {//ikinci satırın başındaki elemansa sola gitmeyecek
                this.Deselect();
                if (this.SelectedIndex > 100)
                    this.SelectedIndex--;
                var sec = this.SelectedIndex - 100;
                this.Select();
                var left = $("#mySlider").position().left;
                if (left < 0 - sec % (Math.ceil(mcount / 2)) * 227 && this.SelectedIndex <= mcount + 100) {
                    $("#mySlider").css("left", "-" + sec % (Math.ceil(mcount / 2)) * 227 + "px");
                }
            }
        }
        else if (this.SelectedIndex > 200) {
            this.Deselect();
            this.SelectedIndex--;
            this.Select();
        }
    },
    Select: function () {
        if ($('#featuredItem' + this.SelectedIndex).hasClass("appContainer")) {
            $('#featuredItem' + this.SelectedIndex).addClass("appContainerSelected");

            var d = $('<div class="favCircle">');
            var fav = $('<img class="favStar" src="../applications-assets/apps-favorite-icon-outline.svg">');
            d.append(fav);
            $('#featuredItem' + this.SelectedIndex + " .favSymbol").append(d);

            var name="";
            if (this.SelectedIndex < 100) {
                name = fApps[this.SelectedIndex][0];
            } else {
                name = myApps[this.SelectedIndex-100][0];
            }

            var favList = JSON.parse(localStorage.getItem("favorites"));
            var alreadyAdded = false;
            if (favList) {
                for (var i = 0; i < favList.favorites.length; i++) {
                    if (favList.favorites[i]["name"] === name) {
                        alreadyAdded = true;
                    }
                }
            }
            if (alreadyAdded == true)
                $('.favCircle').css("background-color", "#fd5933");

            $('#featuredItem' + this.SelectedIndex + ' > div:nth-child(2)').css("color", "white");
        }
        if (this.SelectedIndex >= 200) {
            $('#featuredItem' + this.SelectedIndex).addClass("iconSelected");
        }
    },
    Deselect: function () {
        if ($('#featuredItem' + this.SelectedIndex).hasClass("appContainerSelected")) {
            $('#featuredItem' + this.SelectedIndex).removeClass("appContainerSelected");
            //('#featuredItem' + this.SelectedIndex + " .favSymbol").removeClass("favSymbolSelected");

            $('#featuredItem' + this.SelectedIndex + " .favSymbol .favCircle").remove();

            $('#featuredItem' + this.SelectedIndex + ' > div:nth-child(2)').css("color", "rgb(115, 114, 114)");
        }
        if (this.SelectedIndex >= 200) {
            $('#featuredItem' + this.SelectedIndex).removeClass("iconSelected");
        }
    },
    GoUp: function () {
        this.Deselect();
        if (this.SelectedIndex >= 100 && this.SelectedIndex < 100 + mcount) {//myApps için
            if (this.SelectedIndex < 100 + Math.ceil(mcount / 2)) { //myAppsin ilk satırı için
                this.SelectedIndex = 0;
                $("#featuredSlider").css("left", "0px");
            }
            else if (this.SelectedIndex >= 100 + Math.ceil(mcount / 2) && this.SelectedIndex < 100 + mcount) {//myAppsin ikinci satırı için
                this.SelectedIndex -= Math.ceil(mcount / 2);
            }
        }
        else if (this.SelectedIndex >= 200) {//iconlar için
            this.SelectedIndex = this.tempIndex;

        }
        this.Select();
    },
    GoDown: function () {
        this.Deselect();
        if (this.SelectedIndex < fcount) { //featuredApps için
            this.SelectedIndex = 100;
            $("#mySlider").css("left", "0px");
        }

        else if (this.SelectedIndex >= 100 && this.SelectedIndex < 100 + Math.ceil(mcount / 2)) { //myApp'in ilk satırı için
            if (mcount % 2 == 1 && this.SelectedIndex != 100 + Math.floor(mcount / 2))
                this.SelectedIndex += Math.ceil(mcount / 2);
            else if (mcount % 2 == 0)
                this.SelectedIndex += Math.ceil(mcount / 2);
        }
        else if (this.SelectedIndex >= 100 + Math.ceil(mcount / 2) && this.SelectedIndex < 100 + mcount) { //myApp'in ikinci satırı için
            this.tempIndex = this.SelectedIndex;
            this.SelectedIndex = 200;
        }
        this.Select();

    },
    AddFavorite: function (index) {
        if (index < fcount) {
            var name = fApps[index][0];
            var link = fApps[index][1];
        }
        else if (index >= 100) {
            var name = myApps[index - 100][0];
            var link = myApps[index - 100][1];
        }
        var image = $("." + name + "_png").css("background-image").match(/url\((.*)\)/)[1];
        var favList = JSON.parse(localStorage.getItem("favorites"));
        var alreadyAdded = false;
        if (favList) {
            for (var i = 0; i < favList.favorites.length; i++) {
                if (favList.favorites[i]["name"] === name) {
                    alreadyAdded = true;
                }
            }
        }
        if (alreadyAdded === false) {
            if (favList) {
                favList.favorites.push({
                    type: "1",
                    name: name,
                    image: image,
                    link: link
                });
            } else {
                favList = {
                    "favorites": [
                        { "type": "1", "name": name, "image": image, "link": link }
                    ]
                };
            }
            localStorage.setItem("favorites", JSON.stringify(favList));
        }
    },
    RemoveFavorite: function (index) {
        if (index < fcount) {
            var name = fApps[index][0];
        }
        else if (index >= 100) {
            var name = myApps[index - 100][0];
        }
        var favList = JSON.parse(localStorage.getItem("favorites"));
        if (favList) {
            for (var i = 0; i < favList.favorites.length; i++) {
                if (favList.favorites[i]["name"] === name) {
                    favList.favorites.splice(i, 1); //null bırakmadan silmek için 
                }
            }
        }
        localStorage.setItem("favorites", JSON.stringify(favList));
    },
    GoToSubMenu: function (index) {
        if (index < fcount) {
            window.location.href = fApps[index][1];
            /*ApplicationManager.getCSPWindow().loadUrl(fApps[index][1]);
            ApplicationManager.getWindowByName("DEFAULT_CSP").bringToFront();
            ApplicationManager.getWindowByName("DEFAULT_CSP").show();
            ApplicationManager.getWindowByName("DEFAULT_CSP").activate();*/
        }
        else if (index >= 100) {
            index = index - 100;
            window.location.href = myApps[index][1];
            /*ApplicationManager.getCSPWindow().loadUrl(myApps[index][1]);
            ApplicationManager.getWindowByName("DEFAULT_CSP").bringToFront();
            ApplicationManager.getWindowByName("DEFAULT_CSP").show();
            ApplicationManager.getWindowByName("DEFAULT_CSP").activate();*/
        }

    },
    BindEvents: function () {
        var base = this;

        $('#_1stline_box .appContainer').mouseover(function () { //featured apps için
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#_1stline_box .appContainer').click(function () {
            base.GoToSubMenu(base.SelectedIndex);
        });

        $('#bluerectangle_1').click(function () {
            if ($("#featuredSlider").position().left > (8 - fcount) * 227) {
                $("#featuredSlider").css("left", "-=227");
            }
        });

        $('#right_arrow_svg_1').click(function () {
            if ($("#featuredSlider").position().left > (8 - fcount) * 227) {
                $("#featuredSlider").css("left", "-=227");
            }
        });

        $('#_2ndtline_box .appContainer').mouseover(function () { //my apps için
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#_2ndtline_box .appContainer').click(function () {
            base.GoToSubMenu(base.SelectedIndex);
        });

        $('#bluerectangle_2').click(function () {
            if ($("#mySlider").position().left > (8 - Math.ceil(mcount / 2)) * 227) {
                $("#mySlider").css("left", "-=227");
            }
        });

        $('#right_arrow_svg_2').click(function () {
            if ($("#mySlider").position().left > (8 - Math.ceil(mcount / 2)) * 227) {
                $("#mySlider").css("left", "-=227");
            }
        });

        $('.icon_container .iconItem').mouseover(function () { //my apps için
            base.Deselect();
            if (base.SelectedIndex < 200)
                base.tempIndex = base.SelectedIndex;

            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('.icon_container .iconItem').click(function () {
            base.GoToSubMenu(base.SelectedIndex);
        });
    }


};
