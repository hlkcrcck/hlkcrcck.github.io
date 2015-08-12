//#region Channel List
var ChannelListControl = {
    SelectedIndex: 0,
    SelectedIndexEdit:0,
    ActiveFlag: 1,
    MenuItemCount: 0,
    isSetting:0,
    Input: null,
    Handler: function (e) {
        var base = ChannelListControl;
        switch (e.keyCode) {
            case KEYS.OK:
                base.SetChannel(base.SelectedIndex);
                break;
            case KEYS.BACKSPACE:
                base.Deactivate();
                break;
            case KEYS.TWO:
                base.Deactivate();
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
                
                break;
        }
        e.preventDefault();
    },
    GoDown: function () {
        this.Deselect();
        if (this.SelectedIndex < this.MenuItemCount - 1)
            this.SelectedIndex++;
        this.Select();
        var top = $(".channelsSlider").position().top;

        if (this.SelectedIndex > 9 && top > 0 - (this.SelectedIndex - 9) * 72 && this.SelectedIndex <= this.MenuItemCount - 1)
            $(".channelsSlider").css("top", "-" + (this.SelectedIndex - 9) * 72 + "px");
    },
    GoUp: function () {
        this.Deselect();
        if (this.SelectedIndex > 0)
            this.SelectedIndex--;
        this.Select();
        var top = $(".channelsSlider").position().top;
        if (top < 0 - (this.SelectedIndex) * 72 && this.SelectedIndex <= this.MenuItemCount) {
            $(".channelsSlider").css("top", "-" + (this.SelectedIndex) * 72 + "px");
        }
    },
    GoLeft: function () {
        if (this.isSetting) {
            this.DeselectEdit();
            if (this.SelectedIndexEdit > 0)
                this.SelectedIndexEdit--;
            this.SelectEdit();
        }

    },
    GoRight: function () {
        if (this.isSetting) {
            this.DeselectEdit();
            if (this.SelectedIndexEdit < 3)
                this.SelectedIndexEdit++;
            this.SelectEdit();
        }

    },
    SelectEdit: function () {
        if ($('.mdel' + this.SelectedIndexEdit).hasClass("mdel")) {
            $('.mdel' + this.SelectedIndexEdit).addClass("mdelSelected");
        }
    }, DeselectEdit: function () {
        if ($('.mdel' + this.SelectedIndexEdit).hasClass("mdelSelected")) {
            $('.mdel' + this.SelectedIndexEdit).removeClass("mdelSelected");
        }
    },
    Select: function () {
        if ($('#channelElement' + this.SelectedIndex).hasClass("channelElement")) {
            $('#channelElement' + this.SelectedIndex).addClass("channelElementSelected");
        }
    },
    Deselect: function () {
        if ($('#channelElement' + this.SelectedIndex).hasClass("channelElementSelected")) {
            $('#channelElement' + this.SelectedIndex).removeClass("channelElementSelected");
        }
    },
    Activate: function () {
        this.ActiveFlag = 1;
        //$(".channelList").css("left", "0px");
        $(".channelList").css("-webkit-transform", "translate3d(720px, 0, 0)");
        //$("#topMenu").css("top", "0px");
        $("#topMenu").css("-webkit-transform", "translate3d(0, 165px, 0)");
        $('#topMenu').children().show();
        try {
            this.SelectedIndex = document.getElementById("video").currentChannel.minorChannel - 2;
        }
        catch (err) {

        }

        this.Select();
    },
    Deactivate: function () {
        if (!this.isSetting) {
            this.ActiveFlag = 0;
            $(".channelList").css("-webkit-transform", "translate3d(0, 0, 0)");
            $(".flipcard").toggleClass("flip");
            this.Deselect();
            this.SelectedIndex = 0;
            activeKeyHandler = MainMenuControl.Handler;
            $("#topMenu").css("-webkit-transform", "translate3d(0,0, 0)");
            $('#topMenu').children().hide();
        } else {
            this.ActiveFlag = 0;
            activeKeyHandler = SettingsMenuControl.Handler;
            $(".channelList").css("-webkit-transform", "translate3d(0, 0, 0)");
            SettingsMenuControl.Activate();
            $(".flipcard").toggleClass("flip");
            setTimeout(function () {
                $("#activeMenu").html("Settings");
                $("#activeMenu").css("color", "#00b288");
                $(".flipcard").toggleClass("flip");
            }, 500);
        }

    },
    AddFavorite: function (index) {
        //var name = myApps[index - 100][0];         isim ve linki alınacak
        //var link = myApps[index - 100][1];
        var image = "ok-channellist-assets/brand.gif";  //resim de dinamik çekilecek

        var favList = JSON.parse(localStorage.getItem("favorites"));
        if (favList) {
            favList.favorites.push({
                type: "0",
                name: name,
                image: image,
                link: link
            });
        } else {
            favList = { "favorites": [
             { "type": "0", "name": name, "image": image, "link": link}]
            };
        }
        localStorage.setItem("favorites", JSON.stringify(favList));
    },
    BindEvents: function () {
        var base = this;
        $('.channelList .channelElement').mouseover(function () {
            base.Deselect();
            base.SelectedIndex = Number($(this).attr('id').match(/\d+/)[0]);
            base.Select();
        });

        $('.channelList .channelElement').click(function () {
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
    SetChannel: function (index) {
        try {
            if (document.getElementById("video").currentChannel.minorChannel - 2 == this.SelectedIndex)
                this.Deactivate();
            else
                document.getElementById("video").setChannel(document.getElementById("video").getChannelConfig().channelList[this.SelectedIndex]);
        }
        catch (err) {
            this.Deactivate();
        }
    },

    generateChannels: function (channelList) {


        try {
            this.MenuItemCount = channelList.length;
        }
        catch (err) {
            channelList = ["KANALD", "ATV", "NTV SPOR", "SHOW TV"];
            this.MenuItemCount = channelList.length;
        }

        $(".channelsSlider").css("width", this.MenuItemCount * 72 + "px");

        for (var i = 0; i < this.MenuItemCount; i++) {

            var element = document.createElement('div');
            element.className = 'channelElement';
            element.id = 'channelElement' + i;

            var logo = document.createElement('div');
            logo.className = "channelLogo";

            var index = document.createElement('div');
            index.className = "channelIndex";
            var x = i + 1;
            if (i < 9)
                index.innerHTML = "00" + x;
            else if (i < 99)
                index.innerHTML = "0" + x;

            var name = document.createElement('div');
            name.className = "channelName";
            name.innerHTML = channelList[i].name;

            var ava = document.createElement('div');
            ava.className = "channelAva";

            var type = document.createElement('div');
            type.className = "channelType";
            if (i % 2 == 0)
                type.innerHTML = "DTV";
            else {
                type.innerHTML = "RADIO";
            }

            var fav = document.createElement('img');
            fav.className = "channelFav";
            fav.src = "../ok-channellist-assets/addto-favorite-icon.svg";

            element.appendChild(logo);
            element.appendChild(index);
            element.appendChild(name);
            element.appendChild(fav);
            element.appendChild(type);
            element.appendChild(ava);

            $(".channelsSlider").append(element);
            
        }
    },

    generateIconsSetting: function () {
        this.isSetting = 1;
        var editDiv = document.createElement('div');
        editDiv.className = "edit";

        var move = document.createElement('div');
        move.className = "mdel mdel0";
        move.innerHTML = "MOVE";

        var del = document.createElement('div');
        del.className = "mdel mdel1";
        del.innerHTML = "DELETE";

        var editname = document.createElement('div');
        editname.className = "mdel mdel2";
        editname.innerHTML = "EDIT NAME";

        var lock = document.createElement('div');
        lock.className = "mdel mdel3";
        lock.innerHTML = "LOCK";

        var browse = document.createElement('div');
        browse.className = "channelOperationElement";
        var browseImg = document.createElement('img');
        browseImg.src = '../ok-channellist-assets/move-icon.png';
        var browseP = document.createElement('p');
        browseP.innerHTML = "BROWSE";
        browse.appendChild(browseImg);
        browse.appendChild(browseP);

        var edit = document.createElement('div');
        edit.className = "channelOperationElement";
        var editImg = document.createElement('img');
        editImg.src = '../ok-channellist-assets/browse.png';
        var editP = document.createElement('p');
        editP.innerHTML = "EDIT";
        edit.appendChild(editImg);
        edit.appendChild(editP);

        var select = document.createElement('div');
        select.className = "channelOperationElement";
        var selectImg = document.createElement('img');
        selectImg.src = '../ok-channellist-assets/watch-icon.png';
        var selectP = document.createElement('p');
        selectP.innerHTML = "SELECT";
        select.appendChild(selectImg);
        select.appendChild(selectP);

        var gotono = document.createElement('div');
        gotono.className = "channelOperationElement";
        var gotonoImg = document.createElement('img');
        gotonoImg.src = '../ok-channellist-assets/gotono-icon.png';
        var gotonoP = document.createElement('p');
        gotonoP.innerHTML = "GO TO NO.";
        gotono.appendChild(gotonoImg);
        gotono.appendChild(gotonoP);

        var page = document.createElement('div');
        page.className = "channelOperationElement";
        var pageP = document.createElement('p');
        pageP.innerHTML = "P-+ PAGE UP/DOWN";
        page.appendChild(pageP);


        var addtofav = document.createElement('div');
        addtofav.className = "channelOperationElement";
        var addtofavImg = document.createElement('img');
        addtofavImg.src = '../ok-channellist-assets/addtofav-icon.png';
        var addtofavP = document.createElement('p');
        addtofavP.innerHTML = "ADD TO FAVORITIES";
        addtofav.appendChild(addtofavImg);
        addtofav.appendChild(addtofavP);

        var gotoapp = document.createElement('div');
        gotoapp.className = "channelOperationElement";
        var gotoappImg = document.createElement('img');
        gotoappImg.src = '../ok-channellist-assets/filter-icon.png';
        var gotoappP = document.createElement('p');
        gotoappP.innerHTML = "GO TO APPLICATION";
        gotoapp.appendChild(gotoappImg);
        gotoapp.appendChild(gotoappP);

        var filter = document.createElement('div');
        filter.className = "channelOperationElement";
        var filterImg = document.createElement('img');
        filterImg.src = '../ok-channellist-assets/filter-icon.png';
        var filterP = document.createElement('p');
        filterP.innerHTML = "FILTER";
        filter.appendChild(filterImg);
        filter.appendChild(filterP);

        var exit = document.createElement('div');
        exit.className = "channelOperationElement";
        var exitImg = document.createElement('img');
        exitImg.src = '../ok-channellist-assets/menu-icon.png';
        var exitP = document.createElement('p');
        exitP.innerHTML = "EXIT";
        exit.appendChild(exitImg);
        exit.appendChild(exitP);

        editDiv.appendChild(move);
        editDiv.appendChild(del);
        editDiv.appendChild(editname);
        editDiv.appendChild(lock);

        editDiv.appendChild(browse);
        editDiv.appendChild(edit);
        editDiv.appendChild(select);
        editDiv.appendChild(gotono);
        editDiv.appendChild(page);
        editDiv.appendChild(addtofav);
        editDiv.appendChild(gotoapp);
        editDiv.appendChild(filter);
        editDiv.appendChild(exit);

        $(".channelList").append(editDiv);
        this.SelectEdit();
    },

    generateIconsOk: function () {

        this.isSetting = 0;
        var editDiv = document.createElement('div');
        editDiv.className = "edit";

        var sattelite = document.createElement('div');
        sattelite.className = "sattelite";
        sattelite.innerHTML = "SATTELITE";

        var analog = document.createElement('div');
        analog.className = "analog-cable";
        analog.innerHTML = "ANALOG";

        var cable = document.createElement('div');
        cable.className = "analog-cable";
        cable.innerHTML = "CABLE";

        var move = document.createElement('div');
        move.className = "channelOperationElement";
        var moveImg = document.createElement('img');
        moveImg.src = '../ok-channellist-assets/move-icon.png';
        var moveP = document.createElement('p');
        moveP.innerHTML = "MOVE";
        move.appendChild(moveImg);
        move.appendChild(moveP);

        var browse = document.createElement('div');
        browse.className = "channelOperationElement";
        var browseImg = document.createElement('img');
        browseImg.src = '../ok-channellist-assets/browse.png';
        var browseP = document.createElement('p');
        browseP.innerHTML = "BROWSE";
        browse.appendChild(browseImg);
        browse.appendChild(browseP);

        var watch = document.createElement('div');
        watch.className = "channelOperationElement";
        var watchImg = document.createElement('img');
        watchImg.src = '../ok-channellist-assets/watch-icon.png';
        var watchP = document.createElement('p');
        watchP.innerHTML = "WATCH";
        watch.appendChild(watchImg);
        watch.appendChild(watchP);

        var gotono = document.createElement('div');
        gotono.className = "channelOperationElement";
        var gotonoImg = document.createElement('img');
        gotonoImg.src = '../ok-channellist-assets/gotono-icon.png';
        var gotonoP = document.createElement('p');
        gotonoP.innerHTML = "GO TO NO.";
        gotono.appendChild(gotonoImg);
        gotono.appendChild(gotonoP);

        var exit = document.createElement('div');
        exit.className = "channelOperationElement";
        var exitImg = document.createElement('img');
        exitImg.src = '../ok-channellist-assets/menu-icon.png';
        var exitP = document.createElement('p');
        exitP.innerHTML = "EXIT";
        exit.appendChild(exitImg);
        exit.appendChild(exitP);

        var addtofav = document.createElement('div');
        addtofav.className = "channelOperationElement";
        var addtofavImg = document.createElement('img');
        addtofavImg.src = '../ok-channellist-assets/addtofav-icon.png';
        var addtofavP = document.createElement('p');
        addtofavP.innerHTML = "ADD TO FAVORITIES";
        addtofav.appendChild(addtofavImg);
        addtofav.appendChild(addtofavP);

        var gotoapp = document.createElement('div');
        gotoapp.className = "channelOperationElement";
        var gotoappImg = document.createElement('img');
        gotoappImg.src = '../ok-channellist-assets/filter-icon.png';
        var gotoappP = document.createElement('p');
        gotoappP.innerHTML = "GO TO APPLICATION";
        gotoapp.appendChild(gotoappImg);
        gotoapp.appendChild(gotoappP);

        var filter = document.createElement('div');
        filter.className = "channelOperationElement";
        var filterImg = document.createElement('img');
        filterImg.src = '../ok-channellist-assets/filter-icon.png';
        var filterP = document.createElement('p');
        filterP.innerHTML = "FILTER";
        filter.appendChild(filterImg);
        filter.appendChild(filterP);

        editDiv.appendChild(sattelite);
        editDiv.appendChild(analog);
        editDiv.appendChild(cable);
        editDiv.appendChild(move);
        editDiv.appendChild(browse);
        editDiv.appendChild(watch);
        editDiv.appendChild(gotono);
        editDiv.appendChild(exit);
        editDiv.appendChild(addtofav);
        editDiv.appendChild(gotoapp);
        editDiv.appendChild(filter);

        $(".channelList").append(editDiv);
    }
};
//#endregion
