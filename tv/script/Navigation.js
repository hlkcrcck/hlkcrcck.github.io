
//#region Main Menu
var MainMenuControl = {
    SelectedIndex: 0,
    ActiveFlag: 1,
    timeOut: null,
    MenuItemCount: 7,
    Handler: function (e) {
        var base = MainMenuControl;
        switch (e.keyCode) {
            case KEYS.OK:
                if (MainMenuControl.ActiveFlag) {
                    base.GoToSubMenu(base.SelectedIndex);
                }
                else {
                    base.OpenChannelList(false);
                    $(".channelList .edit").remove();
                    ChannelListControl.generateIconsOk();
                }
                break;
            case KEYS.UP:
                base.Activate();
                break;
            case KEYS.DOWN:
                base.Deactivate();
                break;
            case KEYS.RIGHT:
                if (MainMenuControl.ActiveFlag) {
                    base.GoRight();
                }
                break;
            case KEYS.CHANNELUP:
                base.Deactivate();
                base.SetChannel("next");
                break;
            case KEYS.CHANNELDOWN:
                base.Deactivate();
                base.SetChannel("prev");
                break;
            case KEYS.LEFT:
                if (MainMenuControl.ActiveFlag) {
                    base.GoLeft();
                }

                break;
            case KEYS.BACKSPACE:
                base.Deactivate();
                break;
            case KEYS.ONE:
                base.Deactivate();
                break;

        }
        e.preventDefault();
    },
    SetChannel: function (value) {
        //$(".channelInfoBar").css("top", "880px");
        $(".channelInfoBar").css("-webkit-transform", "translate3d(0, -200px, 0)");
        
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(function () {
            $(".channelInfoBar").css("-webkit-transform", "translate3d(0, 0, 0)");
            //$(".channelInfoBar").css("top", "1081px");
        }, 3000);
        if (value === "next") {
            $(".channelInfoBar .channelIndex").html(document.getElementById("video").currentChannel.minorChannel);
            $(".channelInfoBar #channelName").html(document.getElementById("video").currentChannel.name);
        }
        if (value === "prev") {
            $(".channelInfoBar .channelIndex").html(document.getElementById("video").currentChannel.minorChannel - 2);
            $(".channelInfoBar #channelName").html(document.getElementById("video").currentChannel.name);
        }
    },
    OpenChannelList: function (fromSettings) {
        activeKeyHandler = ChannelListControl.Handler;
        //$("#mainMenu").css("top", "1085px");
        $("#mainMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        setTimeout(function () {
            ChannelListControl.Activate();
            if (fromSettings) {
                $(".flipcard").toggleClass("flip");
            }
        }, 300);
        //$('#topMenu').children().show();

        $("#activeMenu").html("Channel List");
        $("#activeMenu").css("color", "#b3b3b3");
        $(".flipcard").toggleClass("flip");

    },
    GoRight: function () {
        this.Deselect();
        if (this.SelectedIndex < this.MenuItemCount - 1)
            this.SelectedIndex++;
        else this.SelectedIndex = 0;
        this.Select();
    },
    GoLeft: function () {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        else this.SelectedIndex = this.MenuItemCount - 1;
        this.Select();
    },
    Select: function () {
        if ($('#menuItem' + this.SelectedIndex).hasClass("mainMenuItem")) {
            $('#menuItem' + this.SelectedIndex).removeClass("mainMenuItem").addClass("mainMenuSelectedItem");
            $('#menuItem' + this.SelectedIndex + ' a').removeClass("mainMenuLink").addClass("mainMenuSelectedLink");
            $('#menuItem' + this.SelectedIndex + ' a div').addClass("mainmenu_icon_shadow_selected");
            $('#menuItem' + this.SelectedIndex + ' a img').addClass("mainMenuSelectedImage");
            $('#menuItem' + this.SelectedIndex + ' span').removeClass("MainMenumenuName").addClass("MainMenumenuNameSelected");
        }
    },
    Deselect: function () {
        if ($('#menuItem' + this.SelectedIndex).hasClass("mainMenuSelectedItem")) {
            $('#menuItem' + this.SelectedIndex).removeClass("mainMenuSelectedItem").addClass("mainMenuItem");
            $('#menuItem' + this.SelectedIndex + ' a').removeClass("mainMenuSelectedLink").addClass("mainMenuLink");
            $('#menuItem' + this.SelectedIndex + ' a div').removeClass("mainmenu_icon_shadow_selected");
            $('#menuItem' + this.SelectedIndex + ' a img').removeClass("mainMenuSelectedImage");
            $('#menuItem' + this.SelectedIndex + ' span').removeClass("MainMenumenuNameSelected").addClass("MainMenumenuName");
        }
    },
    Activate: function () {
        this.ActiveFlag = 1;
        //$("#mainMenu").css("top", "820px");
        $("#mainMenu").css("-webkit-transform", "translate3d(0, -266px, 0)");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        this.Select();

    },
    Deactivate: function () {
        //        $("#mainMenu").hide("ease", function () {
        //            // Animation complete.
        //        });
        this.ActiveFlag = 0;
        //$("#mainMenu").css("top", "1085px");
        $("#mainMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$("#topMenu").css("top", "-165px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        $('#topMenu').children().hide();
    },
    BindEvents: function () {
        var base = this;
        $('#mainMenu .mainMenuItem').mouseover(function () {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#mainMenu .mainMenuItem').click(function () {
            base.GoToSubMenu(base.SelectedIndex);

        });
        $("#topMenu").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function () {
                if (MainMenuControl.ActiveFlag) {
                    $("#topMenu").children().first().show(1, function showNext() {
                        $(this).next("div").show(75, showNext);
                    });
                };
            });
    },
    GoToSubMenu: function (index) {
        //this.Deactivate();
        switch (index) {
            case 0:
                FavMenuControl.GetFavs();
                activeKeyHandler = FavMenuControl.Handler;
                //$("#mainMenu").css("top", "1085px");
                $("#mainMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
                FavMenuControl.Select();
                setTimeout(function () {
                    FavMenuControl.Activate();
                }, 300);
                FavMenuControl.BindEvents();
                $("#activeMenu").html("Favorites");
                $("#activeMenu").css("color", "#ff5b35");
                $("#topMenuBottomLine").css("background-color", "#ff5b35");
                $(".flipcard").toggleClass("flip");
                this.ActiveFlag = 0;
                break;
            case 1:
                RecentMenuControl.GetRecents();
                activeKeyHandler = RecentMenuControl.Handler;
                //$("#mainMenu").css("top", "1085px");
                $("#mainMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
                RecentMenuControl.Select();
                setTimeout(function () {
                    RecentMenuControl.Activate();
                }, 300);
                RecentMenuControl.BindEvents();
                $("#activeMenu").html("Recents");
                $("#activeMenu").css("color", "rgb(247, 147, 30)");
                $("#topMenuBottomLine").css("background-color", "rgb(247, 147, 30)");
                $(".flipcard").toggleClass("flip");
                this.ActiveFlag = 0;
                break;
            case 2:
                ApplicationManager.getCSPWindow().loadUrl("http://portaltv.tv/advepg/epg.aspx");
                ApplicationManager.getWindowByName("DEFAULT_CSP").bringToFront();
                ApplicationManager.getWindowByName("DEFAULT_CSP").show();
                ApplicationManager.getWindowByName("DEFAULT_CSP").activate();
                break;
            case 3:
                window.location.href = "Applications.html";
                this.ActiveFlag = 0;
                break;
            case 4:
                activeKeyHandler = MediaPlayerMenuControl.Handler;
                //$("#mainMenu").css("top", "1085px");
                $("#mainMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
                setTimeout(function () {
                    MediaPlayerMenuControl.Activate();
                }, 300);
                $("#activeMenu").html("Media Player");
                $("#activeMenu").css("color", "#58c9e9");
                $("#topMenuBottomLine").css("background-color", "#58c9e9");
                $(".flipcard").toggleClass("flip");
                this.ActiveFlag = 0;
                break;
            case 5:
                ApplicationManager.getCSPWindow().loadUrl("browser://open");
                this.ActiveFlag = 0;
                break;
            case 6:
                activeKeyHandler = SettingsMenuControl.Handler;
                $("#mainMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
                //$("#mainMenu").css("top", "1085px");
                setTimeout(function () {
                    SettingsMenuControl.Activate();
                }, 300);
                $("#activeMenu").html("Settings");
                $("#activeMenu").css("color", "#00b288");
                $("#topMenuBottomLine").css("background-color", "#00b288");
                $(".flipcard").toggleClass("flip");
                this.ActiveFlag = 0;
                break;
                break;
            case 7:
                break;
        }
    }
};
//#endregion
var MediaPlayerMenuControl = {
    SelectedIndex: 0,
    ActiveFlag: 1,
    MenuItemCount: 6,
    Handler: function(e) {
        var base = MediaPlayerMenuControl;
        switch (e.keyCode) {
        case KEYS.OK:
            base.GoToSubMenu(base.SelectedIndex);
            break;
        case KEYS.UP:
            base.Activate();
            break;
        case KEYS.DOWN:
            base.CloseAll();
            break;
        case KEYS.RIGHT:
            base.GoRight();
            break;
        case KEYS.LEFT:
            base.GoLeft();
            break;
        case KEYS.BACKSPACE:
            base.Deactivate();
            base.ReturnBack();
            break;
        case KEYS.ONE:
            base.Deactivate();
            base.ReturnBack();
            break;
        }
        e.preventDefault();
    },
    GoRight: function() {
        this.Deselect();
        if (this.SelectedIndex < this.MenuItemCount - 1)
            this.SelectedIndex++;
        else this.SelectedIndex = 0;
        this.Select();
    },
    GoLeft: function() {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        else this.SelectedIndex = this.MenuItemCount - 1;
        this.Select();
    },
    Select: function() {
        if ($('#mediaPlayerMenuItem' + this.SelectedIndex).hasClass("mediaPlayerMenuItem")) {
            $('#mediaPlayerMenuItem' + this.SelectedIndex).removeClass("mediaPlayerMenuItem").addClass("mediaPlayerMenuSelectedItem");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' a').removeClass("mediaPlayerMenuLink").addClass("mediaPlayerMenuSelectedLink");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' a img').removeClass("mediaPlayerMenuImage").addClass("mediaPlayerMenuSelectedImage");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' span').removeClass("mediaPlayerMenuName").addClass("mediaPlayerMenuNameSelected");
        }
        if ($('#mediaPlayerMenuItem' + this.SelectedIndex).hasClass("returnItem")) {
            $('#mediaPlayerMenuItem' + this.SelectedIndex).removeClass("returnItem").addClass("returnSelectedItem");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' a img').removeClass("returnImage").addClass("returnSelectedImage");
        }
    },
    Deselect: function() {
        if ($('#mediaPlayerMenuItem' + this.SelectedIndex).hasClass("mediaPlayerMenuSelectedItem")) {
            $('#mediaPlayerMenuItem' + this.SelectedIndex).removeClass("mediaPlayerMenuSelectedItem").addClass("mediaPlayerMenuItem");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' a').removeClass("mediaPlayerMenuSelectedLink").addClass("mediaPlayerMenuLink");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' a img').removeClass("mediaPlayerMenuSelectedImage").addClass("mediaPlayerMenuImage");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' span').removeClass("mediaPlayerMenuNameSelected").addClass("mediaPlayerMenuName");
        }
        if ($('#mediaPlayerMenuItem' + this.SelectedIndex).hasClass("returnSelectedItem")) {
            $('#mediaPlayerMenuItem' + this.SelectedIndex).removeClass("returnSelectedItem").addClass("returnItem");
            $('#mediaPlayerMenuItem' + this.SelectedIndex + ' a img').removeClass("returnSelectedImage").addClass("returnImage");
        }
    },
    Activate: function() {
        this.ActiveFlag = 1;
        $("#mediaPlayerMenu").css("-webkit-transform", "translate3d(0, -265px, 0)");
        //$("#mediaPlayerMenu").css("top", "820px");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        $('#topMenu').children().show();
        this.Select();
    },
    Deactivate: function() {
        //        $("#mainMenu").hide("ease", function () {
        //            // Animation complete.
        //        });
        this.ActiveFlag = 0;
        //$("#mediaPlayerMenu").css("top", "1085px");
        $("#mediaPlayerMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$("#topMenu").css("top", "-165px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        $('#topMenu').children().hide();
        
    },
    BindEvents: function() {
        var base = this;
        $('#mediaPlayerMenu .mediaPlayerMenuItem').mouseover(function() {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#mediaPlayerMenu .returnItem').mouseover(function() {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#mediaPlayerMenu .mediaPlayerMenuItem').click(function() {
            base.GoToSubMenu(base.SelectedIndex);

        });

        $('#mediaPlayerMenu .returnItem').click(function() {
            base.GoToSubMenu(base.SelectedIndex);

        });

        $("#topMenu").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function() {
                if (MediaPlayerMenuControl.ActiveFlag) {
                    $("#topMenu").children().first().show(1, function showNext() {
                        $(this).next("div").show(75, showNext);
                    });
                };
            });
    },
    CloseAll: function() {
        this.Deactivate();
        this.Deselect();
        this.SelectedIndex = 0;
        activeKeyHandler = MainMenuControl.Handler;
        $(".flipcard").toggleClass("flip");
    },
    ReturnBack: function () {
        this.Deselect();
        this.SelectedIndex = 0;
        setTimeout(function () {
            activeKeyHandler = MainMenuControl.Handler;
            $("#topMenuBottomLine").css("background-color", "white");
            MainMenuControl.Activate();
        }, 400);
        $('#topMenu').children().show();
        $(".flipcard").toggleClass("flip");
    },
    GoToSubMenu: function(index) {
        this.Deactivate();
        switch (index) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            this.ReturnBack();
            break;
        case 6:
            break;
        case 7:
            break;

        }

    }

};
var SettingsMenuControl = {
    SelectedIndex: 0,
    ActiveFlag: 1,
    MenuItemCount: 6,
    Handler: function(e) {
        var base = SettingsMenuControl;
        switch (e.keyCode) {
        case KEYS.OK:
            base.GoToSubMenu(base.SelectedIndex);
            break;
        case KEYS.UP:
            base.Activate();
            break;
        case KEYS.DOWN:
            base.CloseAll();
            break;
        case KEYS.RIGHT:
            base.GoRight();
            break;
        case KEYS.LEFT:
            base.GoLeft();
            break;
        case KEYS.BACKSPACE:
            base.Deactivate();
            base.ReturnBack();
            break;
        case KEYS.ONE:
            base.Deactivate();
            base.ReturnBack();
            break;
        }
        e.preventDefault();
    },
    GoRight: function() {
        this.Deselect();
        if (this.SelectedIndex < this.MenuItemCount - 1)
            this.SelectedIndex++;
        else this.SelectedIndex = 0;
        this.Select();
    },
    GoLeft: function() {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        else this.SelectedIndex = this.MenuItemCount - 1;
        this.Select();
    },
    Select: function() {
        if ($('#settingsMenuItem' + this.SelectedIndex).hasClass("settingsMenuItem")) {
            $('#settingsMenuItem' + this.SelectedIndex).removeClass("settingsMenuItem").addClass("settingsMenuSelectedItem");
            $('#settingsMenuItem' + this.SelectedIndex + ' a').removeClass("settingsMenuLink").addClass("settingsMenuSelectedLink");
            $('#settingsMenuItem' + this.SelectedIndex + ' a img').removeClass("settingsMenuImage").addClass("settingsMenuSelectedImage");
            $('#settingsMenuItem' + this.SelectedIndex + ' span').removeClass("settingsMenuName").addClass("settingsMenuNameSelected");
        }
        if ($('#settingsMenuItem' + this.SelectedIndex).hasClass("returnItem")) {
            $('#settingsMenuItem' + this.SelectedIndex).removeClass("returnItem").addClass("returnSelectedItem");
            $('#settingsMenuItem' + this.SelectedIndex + ' a img').removeClass("returnImage").addClass("returnSelectedImage");
        }
    },
    Deselect: function() {
        if ($('#settingsMenuItem' + this.SelectedIndex).hasClass("settingsMenuSelectedItem")) {
            $('#settingsMenuItem' + this.SelectedIndex).removeClass("settingsMenuSelectedItem").addClass("settingsMenuItem");
            $('#settingsMenuItem' + this.SelectedIndex + ' a').removeClass("settingsMenuSelectedLink").addClass("settingsMenuLink");
            $('#settingsMenuItem' + this.SelectedIndex + ' a img').removeClass("settingsMenuSelectedImage").addClass("settingsMenuImage");
            $('#settingsMenuItem' + this.SelectedIndex + ' span').removeClass("settingsMenuNameSelected").addClass("settingsMenuName");
        }
        if ($('#settingsMenuItem' + this.SelectedIndex).hasClass("returnSelectedItem")) {
            $('#settingsMenuItem' + this.SelectedIndex).removeClass("returnSelectedItem").addClass("returnItem");
            $('#settingsMenuItem' + this.SelectedIndex + ' a img').removeClass("returnSelectedImage").addClass("returnImage");
        }
    },
    Activate: function() {
        this.ActiveFlag = 1;
        $("#settingsMenu").css("-webkit-transform", "translate3d(0, -265px, 0)");
        //$("#settingsMenu").css("top", "820px");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        $('#topMenu').children().show();
        this.Select();
    },
    Deactivate: function() {
        //        $("#mainMenu").hide("ease", function () {
        //            // Animation complete.
        //        });
        this.ActiveFlag = 0;
        //$("#settingsMenu").css("top", "1085px");
        $("#settingsMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$("#topMenu").css("top", "-165px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        $('#topMenu').children().hide();
    },
    BindEvents: function() {
        var base = this;
        $('#settingsMenu .settingsMenuItem').mouseover(function() {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#settingsMenu .returnItem').mouseover(function() {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#settingsMenu .settingsMenuItem').click(function() {
            base.GoToSubMenu(base.SelectedIndex);

        });

        $('#settingsMenu .returnItem').click(function() {
            base.GoToSubMenu(base.SelectedIndex);

        });

        $("#topMenu").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function() {
                if (SettingsMenuControl.ActiveFlag) {
                    $("#topMenu").children().first().show(1, function showNext() {
                        $(this).next("div").show(75, showNext);
                    });
                };
            });
    },
    CloseAll: function() {
        this.Deactivate();
        this.Deselect();
        this.SelectedIndex = 0;
        activeKeyHandler = MainMenuControl.Handler;
        $(".flipcard").toggleClass("flip");
    },
    ReturnBack: function() {
        this.Deselect();
        this.SelectedIndex = 0;
        activeKeyHandler = MainMenuControl.Handler;
        setTimeout(function () {
            $("#topMenuBottomLine").css("background-color", "white");
            MainMenuControl.Activate();
        }, 400);
        $('#topMenu').children().show();
        $(".flipcard").toggleClass("flip");
    },
    GoToSubMenu: function(index) {
        this.Deactivate();
        switch (index) {
        case 0:
            activeKeyHandler = ScreenSettingControl.Handler;
            ScreenSettingControl.Activate();
            $('#topMenu').children().show();
            $(".flipcard").toggleClass("flip");
            setTimeout(function() {
                $("#activeMenu").html("Settings|<span style='font-family:SourceSansPro;color:#b3b3b3'>Screen</span>");
                $(".flipcard").toggleClass("flip");
            }, 500);
            break;
        case 1:
            activeKeyHandler = SoundSettingControl.Handler;
            SoundSettingControl.Activate();
            $('#topMenu').children().show();
            $(".flipcard").toggleClass("flip");
            setTimeout(function() {
                $("#activeMenu").html("Settings |<span style='font-family:SourceSansPro;color:#b3b3b3'> Sound</span>");
                $(".flipcard").toggleClass("flip");
            }, 500);
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            MainMenuControl.OpenChannelList(true);
            $(".channelList .edit").remove();
            ChannelListControl.generateIconsSetting();
            /*activeKeyHandler = ChannelListControl.Handler;
            $("#mainMenu").css("top", "1085px");
            setTimeout(function () {
                $("#activeMenu").html("Channel List");
                $("#activeMenu").css("color", "#b3b3b3");
                ChannelListControl.Activate();
            }, 300);*/

            break;
        case 5:
            this.ReturnBack();
            break;
        case 6:
            break;
        case 7:
            break;

        }

    }

};

var FavMenuControl = {
    SelectedIndex: 1,
    ActiveFlag: 1,
    favList: 0,
    favoriteCount: 0,
    favType: { "0": { "type": "channel", "width": "500px", "style": "favMenuChannel" }, "1": { "type": "application", "width": "500px", "style": "favMenuApp" }, "2": { "type": "setting", "width": "300px", "style": "favMenuSetting"} },
    GetFavs: function () {
        this.favList = JSON.parse(localStorage.getItem("favorites"));
        if (this.favList)
            this.favoriteCount = this.favList.favorites.length;
        else {
            this.favoriteCount = 0;
        }
        $("#favMenuSlider").css("width", this.favoriteCount * 700 + "px");
        for (var i = 0; i < this.favoriteCount; i++) {
            var d = document.createElement('div');
            d.className = 'favMenuItem';
            d.id = 'favMenuItem' + (i + 1);

            var png = document.createElement('img');
            png.className = "favMenuImage";
            png.src = this.favList.favorites[i].image;

            var name = document.createElement('span');
            name.className = "favMenuName";
            name.textContent = this.favList.favorites[i].name;

            d.appendChild(png);
            d.appendChild(name);

            document.getElementById("favMenuSlider").appendChild(d);
        }
    },
    ClearFavs: function () {
        $(".favMenuItem").remove();
    },
    Handler: function (e) {
        var base = FavMenuControl;
        switch (e.keyCode) {
            case KEYS.OK:
                base.GoToSubMenu(base.SelectedIndex);
                break;
            case KEYS.UP:
                base.Activate();
                break;
            case KEYS.DOWN:
                base.CloseAll();
                break;
            case KEYS.RIGHT:
                base.GoRight();
                break;
            case KEYS.LEFT:
                base.GoLeft();
                break;
            case KEYS.BACKSPACE:
                base.Deactivate();
                base.ReturnBack();
                break;
            case KEYS.ONE:
                base.Deactivate();
                base.ReturnBack();
                break;
            case KEYS.TWO:
                base.RemoveFavorite(base.SelectedIndex);
                break;
        }

        e.preventDefault();
    },
    GoRight: function () {
        this.Deselect();
        if (this.SelectedIndex < this.favoriteCount)
            this.SelectedIndex++;
        this.Select();
        if (this.SelectedIndex > 2 && this.SelectedIndex < this.favoriteCount)
            $("#favMenuSlider").css("left", 900 - ($('#favMenuItem' + this.SelectedIndex).position().left));
        if (this.SelectedIndex === (this.favoriteCount - 1) && this.favoriteCount > 4) {
            $("#favMenuSlider").css("left", 1000- ($('#favMenuItem' + (this.favoriteCount-1)).position().left));
        }
    },
    GoLeft: function () {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        this.Select();
        if (this.SelectedIndex < this.favoriteCount - 2 && this.SelectedIndex > 1) {
            $("#favMenuSlider").css("left", 500 - ($('#favMenuItem' + this.SelectedIndex).position().left));
        }
        if (this.SelectedIndex < 2) {
            $("#favMenuSlider").css("left", 0);
        }
    },
    Select: function () {
        if ($('#favMenuItem' + this.SelectedIndex).hasClass("favMenuItem")) {
            $('#favMenuItem' + this.SelectedIndex).addClass("favMenuSelectedItem");
            $('#favMenuItem' + this.SelectedIndex + ' a img').addClass("favMenuSelectedImage");
            $('#favMenuItem' + this.SelectedIndex + ' span').addClass("favMenuNameSelected");
        }
        if ($('#favMenuItem' + this.SelectedIndex).hasClass("returnItem")) {
            $('#favMenuItem' + this.SelectedIndex).removeClass("returnItem").addClass("returnSelectedItem");
            $('#favMenuItem' + this.SelectedIndex + ' a img').removeClass("returnImage").addClass("returnSelectedImage");
        }
        if (this.SelectedIndex == 1) {
            $('#favMenuItem' + this.SelectedIndex).css("margin-left", "0px");
        }
    },
    Deselect: function () {
        if ($('#favMenuItem' + this.SelectedIndex).hasClass("favMenuSelectedItem")) {
            $('#favMenuItem' + this.SelectedIndex).removeClass("favMenuSelectedItem");
            $('#favMenuItem' + this.SelectedIndex + ' a img').removeClass("favMenuSelectedImage");
            $('#favMenuItem' + this.SelectedIndex + ' span').removeClass("favMenuNameSelected");
        }
        if ($('#favMenuItem' + this.SelectedIndex).hasClass("returnSelectedItem")) {
            $('#favMenuItem' + this.SelectedIndex).removeClass("returnSelectedItem").addClass("returnItem");
            $('#favMenuItem' + this.SelectedIndex + ' a img').removeClass("returnSelectedImage").addClass("returnImage");
        }
    },
    Activate: function () {
        this.ActiveFlag = 1;
        //$("#favMenu").css("top", "820px");
        $("#favMenu").css("-webkit-transform", "translate3d(0, -265px, 0)");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        $('#topMenu').children().show();
        this.Select();
    },
    Deactivate: function () {
        //        $("#mainMenu").hide("ease", function () {
        //            // Animation complete.
        //        });
        this.ActiveFlag = 0;
        //$("#favMenu").css("top", "1085px");
        $("#favMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$("#topMenu").css("top", "-165px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        $('#topMenu').children().hide();
    },
    BindEvents: function () {
        var base = this;
        $('#favMenu .favMenuItem').mouseover(function () {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#favMenuItem0').mouseover(function () {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#favMenu .favMenuItem').click(function () {
            base.GoToSubMenu(base.SelectedIndex);
        });

        $('#favMenuItem0').click(function () {
            base.GoToSubMenu(base.SelectedIndex);
        });

        $('.rightArrow').click(function () {
            if(base.favoriteCount > 4){
            if (parseInt($("#favMenuSlider").css("left")) > (1500 - $("#favMenuItem" + (base.favoriteCount - 1)).position().left)) {
                $("#favMenuSlider").css("left", "-=500");
            }
            else {
                $("#favMenuSlider").css("left", 1000 - ($('#favMenuItem' + (base.favoriteCount - 1)).position().left));
            }
        }
        });

        $("#topMenu").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function () {
                if (FavMenuControl.ActiveFlag) {
                    $("#topMenu").children().first().show(1, function showNext() {
                        $(this).next("div").show(75, showNext);
                    });
                };
            });
    },
    RemoveFavorite: function (index) {
        this.favList = JSON.parse(localStorage.getItem("favorites"));
        if (this.favList) {
            this.favList.favorites.splice(index - 1, 1); //null bırakmadan silmek için 
        }
        localStorage.setItem("favorites", JSON.stringify(this.favList));
        this.ClearFavs();
        this.GetFavs();
    },
    CloseAll: function () {
        this.Deactivate();
        this.Deselect();
        this.SelectedIndex = 0;
        activeKeyHandler = MainMenuControl.Handler;
        $(".flipcard").toggleClass("flip");
    },
    ReturnBack: function () {
        activeKeyHandler = MainMenuControl.Handler;
        this.Deselect();
        this.SelectedIndex = 1;
        FavMenuControl.ClearFavs();
        setTimeout(function () {
            $("#topMenuBottomLine").css("background-color", "white");
            MainMenuControl.Activate();
        }, 400);
        $('#topMenu').children().show();
        $(".flipcard").toggleClass("flip");
    },
    GoToSubMenu: function (index) {
        this.Deactivate();
        switch (index) {
            case 0:
                this.ReturnBack();
                break;
            case index:
                ApplicationManager.getCSPWindow().loadUrl(this.favList.favorites[index-1].link);
                ApplicationManager.getWindowByName("DEFAULT_CSP").bringToFront();
                ApplicationManager.getWindowByName("DEFAULT_CSP").show();
                ApplicationManager.getWindowByName("DEFAULT_CSP").activate();
                break;
        }
    }
};
var SoundSettingControl = {
    SelectedIndex: 0,
    ActiveFlag: 1,
    MenuItemCount: 11,
    Handler: function (e) {
        var base = SoundSettingControl;
        switch (e.keyCode) {
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
            case KEYS.ONE:
                base.Deactivate();
                break;
            case KEYS.BACKSPACE:
                base.Deactivate();
                break;
            case KEYS.TWO:
                base.CloseAll();
                break;
        }
        e.preventDefault();
    },
    GoDown: function () {
        this.Deselect();
        if (this.SelectedIndex < this.MenuItemCount - 1)
            this.SelectedIndex++;
        this.Select();
    },
    GoUp: function () {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        this.Select();
    },
    GoLeft: function () {
        if ($('.settingSound #settingElement' + this.SelectedIndex).has(".sliderBall")) {
            if (parseInt($('.settingSound #settingElement' + this.SelectedIndex + " .sliderBall").css("left")) > 0) {
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBall").css("left", "-=10");
                var value = parseInt($('.settingSound #settingElement' + this.SelectedIndex + " .sliderBound").text());
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBound").text(value - 1);
                ChannelParams.decreaseVolume();
            }
        }
        if ($('.settingSound #settingElement' + this.SelectedIndex).has(".LRSetting")) {
            $('.settingSound #settingElement' + this.SelectedIndex + " .LRSetting").text("left");
        }
    },
    GoRight: function () {
        if ($('.settingSound #settingElement' + this.SelectedIndex).has(".sliderBall")) {
            if (parseInt($('.settingSound #settingElement' + this.SelectedIndex + " .sliderBall").css("left")) < 220) {
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBall").css("left", "+=10");
                var value = parseInt($('.settingSound #settingElement' + this.SelectedIndex + " .sliderBound").text());
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBound").text(value + 1);
                ChannelParams.increaseVolume();
            }
        }
        if ($('.settingSound #settingElement' + this.SelectedIndex).has(".LRSetting")) {
            $('.settingSound #settingElement' + this.SelectedIndex + " .LRSetting").text("right");
        }
    },
    Select: function () {
        if ($('.settingSound #settingElement' + this.SelectedIndex).hasClass("settingElement")) {
            if ($('.settingSound #settingElement' + this.SelectedIndex).has(".sliderBall")) {
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBall").addClass("sliderBallSelected");
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBound").addClass("sliderBoundSelected");
            }
            $('.settingSound #settingElement' + this.SelectedIndex).addClass("settingElementSelected");
        }
    },
    Deselect: function () {
        if ($('.settingSound #settingElement' + this.SelectedIndex).hasClass("settingElement")) {
            if ($('.settingSound #settingElement' + this.SelectedIndex).has(".sliderBallSelected")) {
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBallSelected").removeClass("sliderBallSelected");
                $('.settingSound #settingElement' + this.SelectedIndex + " .sliderBound").removeClass("sliderBoundSelected");
            }
            $('.settingSound #settingElement' + this.SelectedIndex).removeClass("settingElementSelected");
        }
    },
    Activate: function () {
        this.ActiveFlag = 1;
        //$(".settingSound").css("left", "0px");
        $(".settingSound").css("-webkit-transform", "translate3d(730px, 0, 0)");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        $('#topMenu').children().show();
        this.Select();
    },
    Deactivate: function () {
        //        $("#mainMenu").hide("ease", function () {
        //            // Animation complete.
        //        });
        this.ActiveFlag = 0;
        $(".settingSound").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$(".settingSound").css("left", "-730px");
        //$("#topMenu").css("top", "-165px");
        //$('#topMenu').children().hide();

        activeKeyHandler = SettingsMenuControl.Handler;
        SettingsMenuControl.Activate();
        $(".flipcard").toggleClass("flip");
        setTimeout(function () {
            $("#activeMenu").html("Settings");
            $(".flipcard").toggleClass("flip");
        }, 500);
    },
    BindEvents: function () {
        var base = this;
        $('.settingSound .settingElement').mouseover(function () {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('.settingSound .settingElement').click(function () {
            base.GoToSubMenu(base.SelectedIndex);

        });

        $("#topMenu").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function () {
                if (SoundSettingControl.ActiveFlag) {
                    $("#topMenu").children().first().show(1, function showNext() {
                        $(this).next("div").show(75, showNext);
                    });
                };
            });
    },
    CloseAll: function () {
        this.ActiveFlag = 0;
        //$(".settingSound").css("left", "-730px");
        $(".settingSound").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$("#topMenu").css("top", "-165px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        $("#topMenuBottomLine").css("background-color", "white");
        $('#topMenu').children().hide();
        activeKeyHandler = MainMenuControl.Handler;
        this.Deselect();
        this.SelectedIndex = 1;
        $(".flipcard").toggleClass("flip");
    },
    GoToSubMenu: function (index) {
        this.Deactivate();
        switch (index) {
            case 0:
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:

                break;
            case 4:
                break;
            case 5:
                break;
            case 6:
                break;
            case 7:
                break;
        }
    }
};
var ScreenSettingControl = {
    SelectedIndex: 0,
    ActiveFlag: 1,
    MenuItemCount: 11,
    Handler: function(e) {
        var base = ScreenSettingControl;
        switch (e.keyCode) {
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
        case KEYS.ONE:
            base.Deactivate();
            break;
        case KEYS.BACKSPACE:
            base.Deactivate();
            break;
        case KEYS.ESC:
            base.CloseAll();
            break;
        case KEYS.TWO:
            base.CloseAll();
            break;
        }
        e.preventDefault();
    },
    GoDown: function() {
        this.Deselect();
        if (this.SelectedIndex < this.MenuItemCount - 1)
            this.SelectedIndex++;
        this.Select();
    },
    GoUp: function() {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        this.Select();
    },
    GoLeft: function() {
        if ($('.settingScreen #settingElement' + this.SelectedIndex).has(".sliderBall")) {
            if (parseInt($('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBall").css("left")) > 0) {
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBall").css("left", "-=10");
                var value = parseInt($('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBound").text());
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBound").text(value - "");
            }
        }
        if ($('.settingScreen #settingElement' + this.SelectedIndex).has(".LRSetting")) {
            $('.settingScreen #settingElement' + this.SelectedIndex + " .LRSetting").text("left");
        }
    },
    GoRight: function() {
        if ($('.settingScreen #settingElement' + this.SelectedIndex).has(".sliderBall")) {
            if (parseInt($('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBall").css("left")) < 220) {
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBall").css("left", "+=10");
                var value = parseInt($('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBound").text());
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBound").text(value + 1);
            }
        }
        if ($('.settingScreen #settingElement' + this.SelectedIndex).has(".LRSetting")) {
            $('.settingScreen #settingElement' + this.SelectedIndex + " .LRSetting").text("right");
        }
    },
    Select: function() {
        if ($('.settingScreen #settingElement' + this.SelectedIndex).hasClass("settingElement")) {
            if ($('.settingScreen #settingElement' + this.SelectedIndex).has(".sliderBall")) {
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBall").addClass("sliderBallSelected");
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBound").addClass("sliderBoundSelected");
            }
            $('.settingScreen #settingElement' + this.SelectedIndex).addClass("settingElementSelected");
        }
    },
    Deselect: function() {
        if ($('.settingScreen #settingElement' + this.SelectedIndex).hasClass("settingElement")) {
            if ($('.settingScreen #settingElement' + this.SelectedIndex).has(".sliderBallSelected")) {
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBallSelected").removeClass("sliderBallSelected");
                $('.settingScreen #settingElement' + this.SelectedIndex + " .sliderBound").removeClass("sliderBoundSelected");
            }
            $('.settingScreen #settingElement' + this.SelectedIndex).removeClass("settingElementSelected");
        }
    },
    Activate: function() {
        this.ActiveFlag = 1;
        //$(".settingScreen").css("left", "0px");
        $(".settingScreen").css("-webkit-transform", "translate3d(730px, 0, 0)");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        $('#topMenu').children().show();
        this.Select();
    },
    Deactivate: function() {
        //        $("#mainMenu").hide("ease", function () {
        //            // Animation complete.
        //        });
        this.ActiveFlag = 0;
        //$(".settingScreen").css("left", "-730px");
        $(".settingScreen").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$("#topMenu").css("top", "-165px");
        //$('#topMenu').children().hide();

        activeKeyHandler = SettingsMenuControl.Handler;
        SettingsMenuControl.Activate();
        $(".flipcard").toggleClass("flip");
        setTimeout(function() {
            $("#activeMenu").html("Settings");
            $(".flipcard").toggleClass("flip");
        }, 500);
    },
    BindEvents: function() {
        var base = this;
        $('.settingScreen .settingElement').mouseover(function() {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('.settingScreen .settingElement').click(function() {
            base.GoToSubMenu(base.SelectedIndex);

        });

        $("#topMenu").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function() {
                if (ScreenSettingControl.ActiveFlag) {
                    $("#topMenu").children().first().show(1, function showNext() {
                        $(this).next("div").show(75, showNext);
                    });
                };
            });
        },
        CloseAll: function () {
            this.ActiveFlag = 0;
            //$(".settingScreen").css("left", "-730px");
            $(".settingScreen").css("-webkit-transform", "translate3d(0, 0, 0)");
            //$("#topMenu").css("top", "-165px");
            $("#topMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
            $('#topMenu').children().hide();
            activeKeyHandler = MainMenuControl.Handler;
            this.Deselect();
            this.SelectedIndex = 1;
            $(".flipcard").toggleClass("flip");
            $("#topMenuBottomLine").css("background-color", "white");
        },
    GoToSubMenu: function(index) {
        this.Deactivate();
        switch (index) {
        case 0:
            break;
        case 1:
            break;
        case 2:
            break;
        case 3:
            break;
        case 4:
            break;
        case 5:
            break;
        case 6:
            break;
        case 7:
            break;
        }
    }
};

var GeneralControl = {
    SelectedIndex: 0,
    ActiveFlag: 1,
    MenuItemCount: 11,
    Handler: function (e) {
        var base = GeneralControl;
        switch (e.keyCode) {
            case KEYS.CHANNELUP:
                document.getElementById("video").nextChannel();
                
                break;
            case KEYS.CHANNELDOWN:
                document.getElementById("video").prevChannel();
                break;
        }
        e.preventDefault();
    }

};


var RecentMenuControl = {
    SelectedIndex: 1,
    ActiveFlag: 1,
    recentList: 0,
    recentCount: 0,
    GetRecents: function () {
        this.recentList = JSON.parse(localStorage.getItem("recents"));
        if (this.recentList)
            this.recentCount = this.recentList.recents.length;
        else {
            this.recentCount = 0;
        }
        $("#recentMenuSlider").css("width", this.recentCount * 700 + "px");
        for (var i = 0; i < this.recentCount; i++) {
            var d = document.createElement('div');
            d.className = 'recentMenuItem';
            d.id = 'recentMenuItem' + (i + 1);

            var png = document.createElement('img');
            png.className = "recentMenuImage" ;
            png.src = this.recentList.recents[i].image;

            var name = document.createElement('span');
            name.className = "recentMenuName";
            name.textContent = this.recentList.recents[i].name;

            d.appendChild(png);
            d.appendChild(name);

            document.getElementById("recentMenuSlider").appendChild(d);
        }
    },
    ClearFavs: function () {
        $(".recentMenuItem").remove();
    },
    Handler: function (e) {
        var base = RecentMenuControl;
        switch (e.keyCode) {
            case KEYS.OK:
                base.GoToSubMenu(base.SelectedIndex);
                break;
            case KEYS.UP:
                base.Activate();
                break;
            case KEYS.DOWN:
                base.CloseAll();
                break;
            case KEYS.RIGHT:
                base.GoRight();
                break;
            case KEYS.LEFT:
                base.GoLeft();
                break;
            case KEYS.BACKSPACE:
                base.Deactivate();
                base.ReturnBack();
                break;
            case KEYS.ONE:
                base.Deactivate();
                base.ReturnBack();
                break;
            case KEYS.TWO:
                base.RemoveRecent(base.SelectedIndex);
                break;
        }

        e.preventDefault();
    },
    GoRight: function () {
        this.Deselect();
        if (this.SelectedIndex < this.recentCount)
            this.SelectedIndex++;
        this.Select();
        if (this.SelectedIndex > 2 && this.SelectedIndex < this.recentCount)
            $("#recentMenuSlider").css("left", 900 - ($('#recentMenuItem' + this.SelectedIndex).position().left));
        if (this.SelectedIndex === (this.recentCount - 1) && this.recentCount > 4) {
            $("#recentMenuSlider").css("left", 1000 - ($('#recentMenuItem' + (this.recentCount - 1)).position().left));
        }
    },
    GoLeft: function () {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        this.Select();
        if (this.SelectedIndex < this.recentCount - 2 && this.SelectedIndex > 1) {
            $("#recentMenuSlider").css("left", 500 - ($('#recentMenuItem' + this.SelectedIndex).position().left));
        }
        if (this.SelectedIndex < 2) {
            $("#recentMenuSlider").css("left", 0);
        }
    },
    Select: function () {
        if ($('#recentMenuItem' + this.SelectedIndex).hasClass("recentMenuItem")) {
            $('#recentMenuItem' + this.SelectedIndex).addClass("recentMenuSelectedItem");
            $('#recentMenuItem' + this.SelectedIndex + ' a img').addClass("recentMenuSelectedImage");
            $('#recentMenuItem' + this.SelectedIndex + ' span').addClass("recentMenuNameSelected");
        }
        if ($('#recentMenuItem' + this.SelectedIndex).hasClass("returnItem")) {
            $('#recentMenuItem' + this.SelectedIndex).removeClass("returnItem").addClass("returnSelectedItem");
            $('#recentMenuItem' + this.SelectedIndex + ' a img').removeClass("returnImage").addClass("returnSelectedImage");
        }
        if (this.SelectedIndex == 1) {
            $('#recentMenuItem' + this.SelectedIndex).css("margin-left", "0px");
        }
    },
    Deselect: function () {
        if ($('#recentMenuItem' + this.SelectedIndex).hasClass("recentMenuSelectedItem")) {
            $('#recentMenuItem' + this.SelectedIndex).removeClass("recentMenuSelectedItem");
            $('#recentMenuItem' + this.SelectedIndex + ' a img').removeClass("recentMenuSelectedImage");
            $('#recentMenuItem' + this.SelectedIndex + ' span').removeClass("recentMenuNameSelected");
        }
        if ($('#recentMenuItem' + this.SelectedIndex).hasClass("returnSelectedItem")) {
            $('#recentMenuItem' + this.SelectedIndex).removeClass("returnSelectedItem").addClass("returnItem");
            $('#recentMenuItem' + this.SelectedIndex + ' a img').removeClass("returnSelectedImage").addClass("returnImage");
        }
    },
    Activate: function () {
        this.ActiveFlag = 1;
        //$("#recentMenu").css("top", "820px");
        $("#recentMenu").css("-webkit-transform", "translate3d(0, -265px, 0)");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        $('#topMenu').children().show();
        this.Select();
    },
    Deactivate: function () {
        //        $("#mainMenu").hide("ease", function () {
        //            // Animation complete.
        //        });
        this.ActiveFlag = 0;
        //$("#recentMenu").css("top", "1085px");
        $("#recentMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        //$("#topMenu").css("top", "-165px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 0, 0)");
        $('#topMenu').children().hide();
    },
    BindEvents: function () {
        var base = this;
        $('#recentMenu .recentMenuItem').mouseover(function () {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#recentMenuItem0').mouseover(function () {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('#recentMenu .recentMenuItem').click(function () {
            base.GoToSubMenu(base.SelectedIndex);
        });

        $('#recentMenuItem0').click(function () {
            base.GoToSubMenu(base.SelectedIndex);
        });

        $('.rightArrow').click(function () {
            if (base.recentCount > 4) {
                if (parseInt($("#recentMenuSlider").css("left")) > (1500 - $("#recentMenuItem" + (base.recentCount - 1)).position().left)) {
                    $("#recentMenuSlider").css("left", "-=500");
                } else {
                    $("#recentMenuSlider").css("left", 1000 - ($('#recentMenuItem' + (base.recentCount - 1)).position().left));
                }
            }
        });

        $("#topMenu").on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
            function () {
                if (RecentMenuControl.ActiveFlag) {
                    $("#topMenu").children().first().show(1, function showNext() {
                        $(this).next("div").show(75, showNext);
                    });
                };
            });
    },
    RemoveRecent: function (index) {
        this.recentList = JSON.parse(localStorage.getItem("recents"));
        if (this.recentList) {
            this.recentList.recents.splice(index - 1, 1); //null bırakmadan silmek için 
        }
        localStorage.setItem("recents", JSON.stringify(this.favList));
        this.Clearrecents();
        this.GetRecents();
    },
    CloseAll: function () {
        this.Deactivate();
        this.Deselect();
        this.SelectedIndex = 0;
        activeKeyHandler = MainMenuControl.Handler;
        $(".flipcard").toggleClass("flip");
    },
    ReturnBack: function () {
        activeKeyHandler = MainMenuControl.Handler;
        this.Deselect();
        this.SelectedIndex = 1;
        RecentMenuControl.ClearFavs();
        setTimeout(function () {
            $("#topMenuBottomLine").css("background-color", "white");
            MainMenuControl.Activate();
        }, 400);
        $('#topMenu').children().show();
        $(".flipcard").toggleClass("flip");
    },
    GoToSubMenu: function (index) {
        this.Deactivate();
        switch (index) {
            case 0:
                this.ReturnBack();
                break;
            case index:
                ApplicationManager.getCSPWindow().loadUrl(this.recentList.recents[index - 1].link);
                ApplicationManager.getWindowByName("DEFAULT_CSP").bringToFront();
                ApplicationManager.getWindowByName("DEFAULT_CSP").show();
                ApplicationManager.getWindowByName("DEFAULT_CSP").activate();
                break;
        }
    }
};