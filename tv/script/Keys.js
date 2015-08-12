var KEYS = null;

if (typeof (VK_LEFT) == 'undefined') {
    KEYS = {
        UP: 38,
        DOWN: 40,
        RIGHT: 39,
        LEFT: 37,
        BACKSPACE: 48,
        OK: 13,
        DEL: -7,
        TAB: -9,
        ESC: -27,
        COMMA: -188,
        PAGEUP: -33,
        PAGEDOWN: -34,
        NEXTPART: 0,
        PREPART: 0,

        ZERO: 48,
        ONE: 49,
        TWO: 50,
        THREE: 51,
        FOUR: 52,
        FIVE: 53,
        SIX: 54,
        SEVEN: 55,
        EIGHT: 56,
        NINE: 57
    };
}
else {
    KEYS = {
        CHANNELUP: 427,
        CHANNELDOWN: 428,
        UP: VK_UP,
        DOWN: VK_DOWN,
        RIGHT: VK_RIGHT,
        LEFT: VK_LEFT,
        GREEN: VK_GREEN,
        RED: VK_RED,
        YELLOW: VK_YELLOW,
        BLUE: VK_BLUE,
        BACKSPACE: VK_BACK,
        OK: VK_ENTER,
        PLAY: VK_PLAY,
        PAUSE: VK_PAUSE,
        FW: VK_FAST_FWD,
        BW: VK_REWIND,
        STOP: VK_STOP,
        DEL: -7,
        TAB: -9,
        ESC: -27,
        COMMA: -188,
        PAGEUP: -33,
        PAGEDOWN: -34,
        NEXTPART: 0,
        PREPART: 0,
        VOLUMEUP: 174,
        VOLUMEDOWN: 175,
        MUTE: 449,


        ZERO: VK_0,
        ONE: VK_1,
        TWO: VK_2,
        THREE: VK_3,
        FOUR: VK_4,
        FIVE: VK_5,
        SIX: VK_6,
        SEVEN: VK_7,
        EIGHT: VK_8,
        NINE: VK_9
    };
}

if (typeof (VK_ENTER) != 'undefined' && VK_ENTER == 10) {
    KEYS.OK = 13;
}

if (typeof (VK_ENTER) == 'undefined') {
    KEYS.OK = 13;
    KEYS.UP = 38;
    KEYS.DOWN = 40;
    KEYS.RIGHT = 39;
    KEYS.LEFT = 37;
    KEYS.GREEN = 404;
    KEYS.RED = 403;
    KEYS.YELLOW = 405;
    KEYS.BLUE = 406;
    KEYS.BACKSPACE = 461;
    KEYS.OK = 13;
    KEYS.PLAY = 415;
    KEYS.PAUSE = 19;
    KEYS.FW = 417;
    KEYS.BW = 412;
    KEYS.STOP = 413;
}

if (navigator.userAgent.indexOf("CE-HTML") == -1 && navigator.userAgent.indexOf("HbbTV") == -1) //IF PC
{
    KEYS.OK = 13;
    KEYS.UP = 38;
    KEYS.DOWN = 40;
    KEYS.RIGHT = 39;
    KEYS.LEFT = 37;
    KEYS.GREEN = 68; //404;
    KEYS.RED = 65; //403; //a
    KEYS.YELLOW = 67; //405;
    KEYS.BLUE = 66; //406;
    KEYS.BACKSPACE = 48;
    KEYS.OK = 13;
    KEYS.PLAY = 0;
    KEYS.PAUSE = 0;
    KEYS.FW = 0;
    KEYS.BW = 0;
    KEYS.STOP = 0;
}




